"""
LOOP ai-service — the ONLY component in the whole app that calls the
Anthropic API. Everything else (auth, RBAC, feedback CRUD, CSV import)
lives in the Node/Express backend, which forwards requests here.

Endpoints:
  POST /classify          — AI1: sentiment + themes + feature area for one item
  POST /report-narrative  — AI4: narrative + recommended actions around pre-computed stats
  POST /ask                — AI3: retrieval-grounded Q&A over a workspace's feedback
  GET  /health             — liveness + whether an Anthropic key is configured

Run with: uvicorn main:app --reload --port 8000
"""
import json
import re as _re
import math
import os
import re
from typing import List, Optional

from bson import ObjectId  # type: ignore
from bson.errors import InvalidId  # type: ignore
from dotenv import load_dotenv  # type: ignore
from fastapi import FastAPI, HTTPException  # type: ignore
from starlette.middleware.cors import CORSMiddleware  # type: ignore
from pydantic import BaseModel, field_validator  # type: ignore[import]
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
    from anthropic import Anthropic  # type: ignore

    anthropic_client = Anthropic(api_key=ANTHROPIC_API_KEY)


def call_claude_json(prompt: str, max_tokens: int = 600) -> Optional[dict]:
    """Calls Claude, strips stray markdown fences, and parses JSON.
    Returns None (never raises) if the model is unavailable or the
    response can't be parsed — callers are responsible for falling
    back gracefully."""
    if anthropic_client is None:
        return None

    try:
        response = anthropic_client.messages.create(
            model=ANTHROPIC_MODEL,
            max_tokens=max_tokens,
            messages=[{"role": "user", "content": prompt}],
        )
        text = "".join(b.text for b in response.content if b.type == "text").strip()
        cleaned = _re.sub(r"^```(json)?|```$", "", text, flags=_re.MULTILINE).strip()
        return json.loads(cleaned)
    except Exception:
        return None


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

class ClassifyRequest(BaseModel):
    content: str
    existing_themes: List[str] = []


class ClassifyResponse(BaseModel):
    sentiment: str
    sentimentScore: float
    themes: List[str]
    featureArea: str
    rationale: str

    @field_validator("sentiment")
    @classmethod
    def sentiment_must_be_valid(cls, v: str) -> str:
        if v not in ("POS", "NEU", "NEG"):
            raise ValueError("sentiment must be one of POS, NEU, NEG")
        return v

    @field_validator("sentimentScore")
    @classmethod
    def score_in_range(cls, v: float) -> float:
        if v < -1 or v > 1:
            raise ValueError("sentimentScore must be between -1 and 1")
        return v


class ReportNarrativeRequest(BaseModel):
    stats: dict


class ReportNarrativeResponse(BaseModel):
    narrative: str
    recommendedActions: List[str]


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


# --------------------------------------------------------------------- #
# AI1 — Structured classification
# --------------------------------------------------------------------- #

def _heuristic_classify(content: str, existing_themes: List[str]) -> dict:
    """Local, dependency-free fallback used only when Claude is
    unavailable or returns something that fails validation. Keeps the
    endpoint returning a valid, schema-conformant response either way,
    so callers never have to special-case a missing AI key."""
    lower = content.lower()
    neg_words = ["broken", "slow", "timeout", "confusing", "hate", "terrible",
                 "bug", "fail", "worst", "frustrat", "crash", "missing", "waiting"]
    pos_words = ["love", "great", "gorgeous", "fast", "amazing", "excellent",
                 "saved", "improvement", "thank", "helpful", "smooth"]

    neg_hits = sum(1 for w in neg_words if w in lower)
    pos_hits = sum(1 for w in pos_words if w in lower)

    if pos_hits > neg_hits:
        sentiment, score = "POS", min(0.9, 0.3 + pos_hits * 0.2)
    elif neg_hits > pos_hits:
        sentiment, score = "NEG", -min(0.9, 0.3 + neg_hits * 0.2)
    else:
        sentiment, score = "NEU", 0.0

    theme = next(
        (t for t in existing_themes if t.split(" ")[0].lower() in lower),
        None,
    ) or (
        "Onboarding friction" if "onboard" in lower else
        "Billing & invoices" if "bill" in lower or "invoice" in lower else
        "Mobile experience" if "mobile" in lower or "app" in lower else
        "SSO / security" if "sso" in lower or "security" in lower else
        "Export & reporting" if "export" in lower or "report" in lower else
        "General feedback"
    )

    return {
        "sentiment": sentiment,
        "sentimentScore": round(score, 2),
        "themes": [theme],
        "featureArea": theme,
        "rationale": "Rule-based fallback classification (Claude unavailable or returned an invalid response).",
    }


@app.post("/classify", response_model=ClassifyResponse)
def classify(req: ClassifyRequest):
    if len(req.content.strip()) < 1:
        raise HTTPException(status_code=422, detail="Feedback content is required.")

    prompt = (
        "Classify this piece of customer feedback. Return ONLY JSON, no markdown fences, "
        "no commentary, matching exactly this shape:\n"
        '{"sentiment": "POS" | "NEU" | "NEG", "sentimentScore": number between -1 and 1, '
        '"themes": [string, ...], "featureArea": string, "rationale": string (one line)}\n\n'
        "Reuse one of these existing theme names if the feedback genuinely fits one of them, "
        "rather than inventing a near-duplicate:\n"
        f"{json.dumps(req.existing_themes)}\n\n"
        f"Feedback:\n\"\"\"\n{req.content}\n\"\"\""
    )

    parsed = call_claude_json(prompt, max_tokens=400)

    if parsed is not None:
        try:
            return ClassifyResponse(**parsed)
        except Exception:
            # Claude responded but not in the exact required shape —
            # retry once with a stricter reminder before giving up.
            retry_prompt = prompt + (
                "\n\nYour previous response was not valid JSON in the exact required shape. "
                "Return ONLY the raw JSON object this time, nothing else."
            )
            parsed_retry = call_claude_json(retry_prompt, max_tokens=400)
            if parsed_retry is not None:
                try:
                    return ClassifyResponse(**parsed_retry)
                except Exception:
                    pass

    # Claude unavailable (no API key) or failed validation twice —
    # fall back to the heuristic so the caller still gets a valid,
    # demoable classification instead of a 500.
    return ClassifyResponse(**_heuristic_classify(req.content, req.existing_themes))


# --------------------------------------------------------------------- #
# AI4 — Voice-of-Customer report narrative
# --------------------------------------------------------------------- #

@app.post("/report-narrative", response_model=ReportNarrativeResponse)
def report_narrative(req: ReportNarrativeRequest):
    stats = req.stats

    prompt = (
        "You are writing the narrative section of a Voice-of-Customer report. "
        "Use ONLY the numbers and facts given below — never invent a statistic, quote, "
        "or theme that isn't present in this data. Return ONLY JSON, no markdown fences, "
        "matching exactly this shape:\n"
        '{"narrative": string (3-5 sentences), "recommendedActions": [string, ...] (2-4 items)}\n\n'
        f"Stats:\n{json.dumps(stats, default=str)}"
    )

    parsed = call_claude_json(prompt, max_tokens=600)

    if parsed is not None:
        try:
            return ReportNarrativeResponse(**parsed)
        except Exception:
            pass

    # Fallback: template narrative built directly from the same stats
    # object, so report generation never hard-fails without an API key.
    top_themes = stats.get("topThemes") or []
    total_items = stats.get("totalItems", 0)
    pct_negative = stats.get("pctNegative", 0)
    sentiment_delta = stats.get("sentimentDelta", 0)
    trend_word = "worsened" if sentiment_delta > 0 else "improved" if sentiment_delta < 0 else "held steady"

    if top_themes:
        top = top_themes[0]
        others = ", ".join(f'"{t["name"]}"' for t in top_themes[1:3]) or "other themes"
        narrative = (
            f"Over this period the workspace logged {total_items} feedback item"
            f"{'' if total_items == 1 else 's'}, {pct_negative}% negative — sentiment has "
            f"{trend_word} versus the prior period. The leading theme was \"{top['name']}\" "
            f"with {top['count']} mention{'' if top['count'] == 1 else 's'}, ahead of {others}. "
            f"(Fallback narrative — ANTHROPIC_API_KEY not configured or unavailable.)"
        )
    else:
        narrative = (
            "No feedback was logged in this period. "
            "(Fallback narrative — ANTHROPIC_API_KEY not configured or unavailable.)"
        )

    recommended_actions = [
        f"Investigate and address \"{t['name']}\" — it's a top driver of this period's "
        f"feedback ({t['count']} mentions)."
        for t in top_themes[:3]
    ]

    return ReportNarrativeResponse(narrative=narrative, recommendedActions=recommended_actions)


# --------------------------------------------------------------------- #
# AI3 — Retrieval-grounded Q&A
# --------------------------------------------------------------------- #

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