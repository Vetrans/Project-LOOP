# LOOP — ai-service (Python + FastAPI)

The **only** place in the entire app that calls the Anthropic API. Everything else — auth, RBAC, feedback CRUD, CSV import, theme management, report generation triggers — lives in `../backend` (Node/Express) and never touches Claude directly.

This service handles three of LOOP's four AI features:

- **AI1 — Auto-classification** (`/classify`): sentiment, sentiment score, themes, and a feature-area label for one piece of feedback.
- **AI3 — Ask LOOP** (`/ask`): grounded, retrieval-based Q&A over a workspace's feedback.
- **AI4 — Voice-of-Customer narrative** (`/report-narrative`): writes the narrative + recommended actions around stats the backend has already pre-computed.

(AI2 — theme clustering & trends — is computed entirely in `../backend` via MongoDB aggregation; it doesn't need Claude.)

## Why a separate Python service

- Keeps the one Claude-calling code path small, auditable, and swappable independent of the rest of the app.
- `pymongo` + the Anthropic Python SDK are a natural fit for the retrieve-then-answer pipeline (embeddings, ranking, prompting) that AI3 needs.
- The Node backend only ever forwards **server-resolved** data (a `workspace_id` from the caller's verified session, feedback content, pre-computed stats) — this service never receives or trusts anything about _who's_ asking beyond what Node already validated.

## File layout

There's really one file that matters here:

```
ai-service/
├── main.py              # The entire service: FastAPI app, all 4 endpoints, the embedding
│                          # algorithm, and the Claude-calling helper. Organized top-to-bottom as:
│                          #   1. Setup — env vars, FastAPI app, CORS, Mongo connection, Anthropic client
│                          #   2. call_claude_json() — shared helper: calls Claude, strips markdown
│                          #      fences, parses JSON, returns None on any failure (never raises)
│                          #   3. Embeddings — tokenize/hash_token/embed_text/cosine_similarity —
│                          #      MUST match backend/src/utils/embeddings.js exactly
│                          #   4. Pydantic request/response models for every endpoint
│                          #   5. GET  /health
│                          #   6. POST /classify           (AI1)
│                          #   7. POST /report-narrative   (AI4)
│                          #   8. POST /ask                (AI3) + its answer_from_evidence() helper
├── requirements.txt      # fastapi, uvicorn, pymongo, anthropic, python-dotenv, pydantic
└── .env.example
```

## How retrieval works (AI3)

`main.py` implements the exact same hashing-trick embedding scheme as `backend/src/utils/embeddings.js` (same tokenizer, same hash function, same 256 dimensions), so a question embedded here lands in the same vector space as the feedback embeddings the Node backend already computed and stored at ingestion time. `/ask`:

1. Reads that workspace's `feedbacks` and `themes` collections straight from MongoDB (read-only).
2. Embeds the question and ranks all feedback by cosine similarity.
3. Passes only the top-5 matches to Claude as grounding context, instructing it to answer strictly from them and cite items by number.
4. Returns the written answer **plus the exact feedback items used** (`citations`), so the caller can verify it — grounding is mandatory, and the frontend renders these citations under each chat answer.

Without `ANTHROPIC_API_KEY` set, `/ask` still retrieves and returns real citations, just with a local (non-Claude) one-line summary instead of a written answer.

## How classification works (AI1)

`/classify` sends the feedback text plus the workspace's existing theme names (so Claude reuses themes instead of inventing near-duplicates) and requires a strict JSON response: `sentiment`, `sentimentScore`, `themes`, `featureArea`, `rationale`. If Claude's response fails validation, it retries once with a stricter reminder; if that also fails (or no API key is configured), it falls back to a local rule-based classifier — so the endpoint always returns a valid, schema-conformant response.

## How report narration works (AI4)

`/report-narrative` receives stats the backend has **already computed for real** (top themes, sentiment deltas, sample quotes) and asks Claude to write only the prose narrative and a short list of recommended actions around those numbers — Claude is never allowed to invent a statistic. Falls back to a template narrative built from the same real stats object if Claude is unavailable.

## Setup

**Prerequisites:** Python 3.10+, and the same local MongoDB the backend uses (seeded or with real feedback already ingested, so there's something to retrieve/classify).

```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env
# edit .env: MONGODB_URI should match the backend's, and set
# ANTHROPIC_API_KEY for real Claude-written answers (optional)

uvicorn main:app --reload --port 8000
```

You should see it come up on `http://localhost:8000`. Check `/health`.

The Node backend finds this service via `AI_SERVICE_URL` in its own `.env` (defaults to `http://localhost:8000`) — start this service before or after the backend, order doesn't matter, but AI1/AI3/AI4 requests will fail (with a clear 503, not a crash) until both are running.

## API

| Method | Route               | Body                           | Purpose                                                         |
| ------ | ------------------- | ------------------------------ | --------------------------------------------------------------- |
| GET    | `/health`           | —                              | Liveness + whether an Anthropic key is configured               |
| POST   | `/classify`         | `{ content, existing_themes }` | AI1 — sentiment, score, themes, feature area, rationale         |
| POST   | `/report-narrative` | `{ stats }`                    | AI4 — narrative + recommendedActions around pre-computed stats  |
| POST   | `/ask`              | `{ workspace_id, question }`   | AI3 — retrieve top-5 relevant feedback, answer grounded in them |

### `/classify` response shape

```json
{
  "sentiment": "POS",
  "sentimentScore": 0.62,
  "themes": ["Onboarding friction"],
  "featureArea": "Onboarding friction",
  "rationale": "Customer praised how quickly they got set up."
}
```

### `/report-narrative` response shape

```json
{
  "narrative": "…",
  "recommendedActions": ["…", "…"]
}
```

### `/ask` response shape

```json
{
  "answer": "…",
  "citations": [
    {
      "id": "…",
      "content": "…",
      "channel": "…",
      "customerLabel": "…",
      "themes": ["…"]
    }
  ]
}
```
