# LOOP — ai-service (Python + FastAPI)

The **only** place in this app that calls the Anthropic API. Handles Ask LOOP
(AI3): grounded, retrieval-based Q&A over a workspace's feedback.

Everything else — auth, RBAC, feedback CRUD, CSV import, classification,
themes, and Voice-of-Customer reports — lives in `../backend` (Node/Express)
and never touches the Anthropic API.

## Why a separate Python service

- Keeps the one Claude-calling code path small, auditable, and swappable
  independent of the rest of the app.
- `pymongo` + `anthropic`'s Python SDK are a natural fit for the
  retrieve-then-answer pipeline (embeddings, ranking, prompting).
- The Node backend only ever forwards a **server-resolved** `workspace_id`
  (from the caller's verified session) plus the question — this service
  never receives or trusts anything else about who's asking.

## How retrieval works

`main.py` implements the exact same hashing-trick embedding scheme as
`backend/src/utils/embeddings.js` (same tokenizer, same hash function, same
256 dimensions), so a question embedded here lands in the same vector space
as the feedback embeddings the Node backend already computed and stored at
ingestion time. It reads `feedbacks` and `themes` straight from MongoDB
(read-only), ranks by cosine similarity, and passes only the top-5 matches
to Claude as grounding context — Claude is instructed to answer strictly
from them and never invent a quote or fact.

Without `ANTHROPIC_API_KEY` set, `/ask` still retrieves and cites real
items, just with a local (non-Claude) one-line summary instead of a written
answer — so the whole app stays demoable with zero API keys.

## Setup

**Prerequisites:** Python 3.10+, and the same local MongoDB the backend uses
(seeded at least once, so there's feedback to retrieve).

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

The Node backend finds this service via `AI_SERVICE_URL` in its own `.env`
(defaults to `http://localhost:8000`) — start this service before or after
the backend, order doesn't matter, but Ask LOOP requests will fail with a
clear 503 until both are running.

## API

| Method | Route | Body | Purpose |
|---|---|---|---|
| GET | `/health` | — | Liveness + whether an Anthropic key is configured |
| POST | `/ask` | `{ workspace_id, question }` | Retrieve top-5 relevant feedback, answer grounded in them |

Response shape:
```json
{
  "answer": "…",
  "citations": [
    { "id": "…", "content": "…", "channel": "…", "customerLabel": "…", "themes": ["…"] }
  ]
}
```
