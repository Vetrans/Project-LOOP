# LOOP — Backend (Express + MongoDB, Node)

The core API for Project LOOP: auth, RBAC, multi-tenant data isolation,
feedback ingestion, CSV import, themes, and Voice-of-Customer reports.

**This service never calls the Anthropic API.** Classification (AI1) and
report narration (AI4) run as deterministic local logic in
`src/utils/ai.js`. The one AI feature that needs Claude — Ask LOOP (AI3) —
is proxied to the Python `ai-service` (see `src/routes/insight.routes.js`
and `../ai-service`). This route resolves the caller's `workspaceId`
server-side from their session and forwards only that + the question —
`ai-service` never talks to the browser directly.

> **On "every company has its own login":** LOOP is one shared app with one
> login page — that's what makes it multi-tenant SaaS. Signing up creates a
> new Workspace and makes you its Admin; logging in resolves *which*
> workspace you belong to from your account. Every query in this codebase
> is scoped by `workspaceId`, resolved server-side from the verified JWT —
> never trusted from a URL or request body. A user from one company can
> never read another company's data.

## Stack

- **Express** — REST API
- **MongoDB + Mongoose** — schemas in `src/models`
- **JWT (jsonwebtoken)** + **bcryptjs** — stateless sessions, hashed passwords
- **Zod** — request validation on every route
- **multer + csv-parse** — CSV bulk import

## Database setup

This project uses a **locally installed MongoDB** — see the root
`README.md` → "1. Install MongoDB locally" for OS-specific install steps.
Once it's running on the default port, the included `.env.example` needs
no changes:
```
MONGODB_URI=mongodb://127.0.0.1:27017/loop
```
(Point this at a different host/port if your local install uses one.)

## Setup

```bash
npm install
cp .env.example .env
# edit .env: set a real JWT_SECRET

npm run seed     # wipes + recreates the demo workspace (required)
npm run dev      # → http://localhost:4000
```

### Seed data

`npm run seed` creates:
- One workspace, **Acme Corp**
- Three users, one per role, all with password `Password123!`:
  `admin@acme-demo.com` (ADMIN), `analyst@acme-demo.com` (ANALYST),
  `viewer@acme-demo.com` (VIEWER)
- Five themes and **130 feedback items** across all five channels, each
  classified by the local heuristic in `src/utils/ai.js`

Re-run `npm run seed` any time to reset to a clean demo state.

## API reference

All routes are prefixed `/api`. All routes except `/auth/*` and `/health`
require `Authorization: Bearer <token>`.

| Method | Route | Role | Purpose |
|---|---|---|---|
| POST | `/auth/signup` | — | Create a workspace + Admin user |
| POST | `/auth/login` | — | Log in |
| GET | `/auth/me` | any | Current user + workspace |
| GET | `/feedback` | any | Paginated/searchable/filterable inbox |
| GET | `/feedback/stats` | any | Dashboard stats (volume, sentiment, totals) |
| POST | `/feedback` | Admin/Analyst | Add one feedback item (classified locally) |
| POST | `/feedback/import` | Admin/Analyst | CSV bulk import (multipart, field `file`) |
| PATCH | `/feedback/:id/status` | Admin/Analyst | NEW → REVIEWED → ACTIONED |
| POST | `/feedback/:id/reclassify` | Admin/Analyst | Re-run local classification |
| GET | `/themes` | any | Themes with counts |
| GET | `/themes/trends` | any | Weekly volume per theme + spike detection |
| POST | `/insights/ask` | any | Proxies to `ai-service` for grounded Q&A |
| GET | `/reports` | any | List saved reports |
| POST | `/reports/generate` | Admin/Analyst | Generate a VoC report (`{ days }`) |
| GET | `/reports/:id` | any | One report |
| GET | `/workspace/members` | Admin | List members |
| POST | `/workspace/members/invite` | Admin | Create a member (returns temp password) |
| PATCH | `/workspace/members/:id` | Admin | Change a member's role |

Every handler that reads or writes tenant data filters by
`req.user.workspaceId`. Forbidden actions return `403`, not a crash.

## Project structure

```
backend/
  server.js                 # entry point
  src/
    config/db.js             # mongoose connection (local Mongo)
    models/                  # Workspace, User, Feedback, Theme, Report
    middleware/
      auth.js                 # verifies JWT, resolves req.user.workspaceId
      roles.js                 # requireRole(...) → 403 on mismatch
      errorHandler.js           # central error → HTTP mapping
    utils/
      ai.js                    # LOCAL classification + report narrative — no external calls
      embeddings.js             # hashing-trick vectors (same algorithm as ai-service/main.py)
      AppError.js                # AppError + asyncHandler
    routes/
      insight.routes.js         # the ONE route that talks to ai-service
      auth/feedback/theme/report/workspace routes.js
  seed/seed.js
```

## On embeddings

`src/utils/embeddings.js` computes a feedback item's vector at ingestion
time and stores it on the `Feedback` document. `ai-service/main.py`
implements the **exact same** hashing-trick algorithm in Python, so a
question embedded there lands in the same vector space as these
Node-computed vectors — no shared embeddings service needed, and no
external API call for retrieval itself (only the final answer-writing step
calls Claude, from `ai-service`).
