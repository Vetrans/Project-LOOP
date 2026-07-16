"""
LOOP ai-service — Ask LOOP (AI3), grounded Q&A.

This is the ONLY component in the whole app that calls the Anthropic API.
Everything else (auth, RBAC, feedback CRUD, classification, reports) lives
in the Node/Express backend. This service:

  1. Receives a workspace_id (resolved server-side by Node from the
     caller's session — this service trusts Node, not the browser) and a
     question.
  2. Reads that workspace's Feedback documents straight from MongoDB
     (read-only) and retrieves the top-K most relevant ones using local
     embeddings + cosine similarity.
  3. Calls Claude with ONLY those retrieved items as context, instructing
     it to answer strictly from them.
  4. Returns the answer plus the exact items used, so the caller can
     verify it — grounding is mandatory, never invent a feedback item.

Run with: uvicorn main:app --reload --port 8000
"""

import hashlib
import math
import os
import re
from typing import List, Optional

from bson import ObjectId # type: ignore
from bson.errors import InvalidId # type: ignore
from dotenv import load_dotenv # type: ignore
from fastapi import FastAPI, HTTPException # type: ignore
from starlette.middleware.cors import CORSMiddleware # type: ignore
from pydantic import BaseModel  # type: ignore[import]
from pymongo import MongoClient  # type: ignore[import]

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://127.0.0.1:27017/loop")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "").strip()
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-6")

app = FastAPI(title="LOOP ai-service")

# Only the Node backend calls this service directly (never the browser),
# but CORS is left open for local dev convenience.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

mongo = MongoClient(MONGODB_URI)
db = mongo.get_default_database()

anthropic_client = None
if ANTHROPIC_API_KEY:
    from anthropic import Anthropic # type: ignore

    anthropic_client = Anthropic(api_key=ANTHROPIC_API_KEY)


# --------------------------------------------------------------------- #
# Embeddings — MUST match backend/src/utils/embeddings.js exactly (same
# tokenizer, same hash function, same 256 dimensions) so a question
# embedded here lands in the same vector space as the feedback embeddings
# the Node backend already computed and stored at ingestion time.
# --------------------------------------------------------------------- #
DIMENSIONS = 256
STOPWORDS = {
    "the", "a", "an", "is", "are", "was", "were", "to", "of", "and", "in", "on",
    "for", "it", "this", "that", "i", "we", "you", "they", "with", "my", "our",
}
TOKEN_RE = re.compile(r"[^a-z0-9\s]")


def tokenize(text: str) -> List[str]:
    cleaned = TOKEN_RE.sub(" ", text.lower())
    return [w for w in cleaned.split() if len(w) > 1 and w not in STOPWORDS]


def hash_token(token: str) -> int:
    h = 0
    for ch in token:
        h = (h * 31 + ord(ch)) & 0xFFFFFFFF
    return h % DIMENSIONS


def embed_text(text: str) -> List[float]:
    vector = [0.0] * DIMENSIONS
    for token in tokenize(text):
        vector[hash_token(token)] += 1
    norm = math.sqrt(sum(v * v for v in vector)) or 1
    return [v / norm for v in vector]


def cosine_similarity(a: List[float], b: List[float]) -> float:
    return sum(x * y for x, y in zip(a, b))


# --------------------------------------------------------------------- #
# Request / response models
# --------------------------------------------------------------------- #
class AskRequest(BaseModel):
    workspace_id: str
    question: str


class Citation(BaseModel):
    id: str
    content: str
    channel: str
    customerLabel: Optional[str] = ""
    themes: List[str] = []


class AskResponse(BaseModel):
    answer: str
    citations: List[Citation]


@app.get("/health")
def health():
    return {"ok": True, "service": "loop-ai-service", "anthropic_configured": bool(anthropic_client)}


@app.post("/ask", response_model=AskResponse)
def ask(req: AskRequest):
    try:
        workspace_oid = ObjectId(req.workspace_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid workspace id.")

    if len(req.question.strip()) < 3:
        raise HTTPException(status_code=422, detail="Ask a fuller question.")

    # Scoped strictly to this workspace — same tenant-isolation rule as
    # every query in the Node backend.
    docs = list(
        db.feedbacks.find(
            {"workspaceId": workspace_oid, "embedding": {"$exists": True}},
            {"content": 1, "channel": 1, "customerLabel": 1, "embedding": 1, "themes": 1},
        ).limit(500)
    )

    theme_ids = {link["themeId"] for d in docs for link in d.get("themes", [])}
    theme_names = {
        t["_id"]: t["name"] for t in db.themes.find({"_id": {"$in": list(theme_ids)}}, {"name": 1})
    }

    question_vector = embed_text(req.question)
    scored = [
        (cosine_similarity(question_vector, d.get("embedding", [])), d)
        for d in docs
    ]
    scored.sort(key=lambda pair: pair[0], reverse=True)
    top = [d for score, d in scored[:5] if score > 0]

    citations = [
        Citation(
            id=str(d["_id"]),
            content=d["content"],
            channel=d["channel"],
            customerLabel=d.get("customerLabel", ""),
            themes=[theme_names.get(link["themeId"], "") for link in d.get("themes", []) if theme_names.get(link["themeId"])],
        )
        for d in top
    ]

    answer = answer_from_evidence(req.question, citations)
    return AskResponse(answer=answer, citations=citations)


def answer_from_evidence(question: str, citations: List[Citation]) -> str:
    if not citations:
        return (
            "I couldn't find any feedback in this workspace relevant to that question. "
            "Try rephrasing, or check back once more feedback has been ingested."
        )

    if anthropic_client is None:
        names = sorted({t for c in citations for t in c.themes if t})
        theme_part = ", ".join(names) if names else "the topic you asked about"
        return (
            f"Based on {len(citations)} matching feedback item(s), the recurring pattern relates to "
            f"{theme_part}. (Local fallback answer — set ANTHROPIC_API_KEY in ai-service/.env for a "
            f"Claude-written answer.)"
        )

    context = "\n".join(f"[{i + 1}] ({c.channel}) {c.content}" for i, c in enumerate(citations))
    prompt = (
        "Answer the question using ONLY the feedback items listed below. Never invent a claim, "
        "quote, or number that isn't in them. If the items don't actually answer the question, say "
        "so plainly. Cite items by their [number].\n\n"
        f"Feedback items:\n{context}\n\n"
        f"Question: {question}\n\n"
        "Give a concise, evidence-grounded answer (3-5 sentences)."
    )

    try:
        response = anthropic_client.messages.create(
            model=ANTHROPIC_MODEL,
            max_tokens=500,
            messages=[{"role": "user", "content": prompt}],
        )
        text_blocks = [b.text for b in response.content if b.type == "text"]
        return "".join(text_blocks).strip() or "The AI service returned an empty answer."
    except Exception as exc:  # noqa: BLE001 — surface any SDK/network error as a clean message
        return f"The AI service is temporarily unavailable ({exc.__class__.__name__}). Please try again shortly."
