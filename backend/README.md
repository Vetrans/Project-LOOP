# LOOP — Backend (Express + MongoDB, Node)

The core API for Project LOOP: authentication, RBAC, multi-tenant data isolation, feedback ingestion, CSV import, theme clustering, and Voice-of-Customer reports.

This service is the **only thing the browser ever talks to**. It never exposes MongoDB or the Anthropic API key to the client — every tenant-data query is scoped by the authenticated user's `workspaceId`, and every AI feature is proxied to `../ai-service`, which holds the actual Anthropic API key.

> **On "every company has its own login":** LOOP is one shared app with one login page — that's what makes it multi-tenant SaaS. Signing up creates a new Workspace and makes you its Admin; logging in resolves _which_ workspace you belong to from your account. Every query in this codebase is scoped by `workspaceId`, resolved server-side from the verified JWT — never trusted from a URL or request body. A user from one company can never read another company's data.

## Stack

- **Express** — REST API
- **MongoDB + Mongoose** — schemas in `src/models`
- **JWT (jsonwebtoken)** + **bcryptjs** — stateless sessions, hashed passwords
- **Zod** — request validation on every route
- **multer + csv-parse** — CSV bulk import

## How the AI features actually work here

This is important to get right, because it changed partway through the build:

- **AI1 (auto-classification)** and **AI4 (report narrative)** genuinely call Claude now — via `src/utils/ai.js`'s `classifyFeedbackWithAI()` and `writeReportNarrativeWithAI()`, both of which make an HTTP call to `../ai-service`'s `/classify` and `/report-narrative` endpoints. If `ai-service` is unreachable or has no `ANTHROPIC_API_KEY` configured, both fall back gracefully (a local heuristic classifier, or a template narrative built from the same real numbers) rather than crashing — but the real path is a genuine Claude call.
- **AI3 (Ask LOOP)** is handled entirely by `../ai-service`; this backend's job for AI3 is just `insight.routes.js`, which resolves the caller's `workspaceId` server-side and forwards it + the question — it never touches embeddings or Claude directly.
- `src/utils/ai.js` also exports `classifyFeedbackHeuristic()` — a dependency-free, rule-based classifier used **only by `seed/seed.js`**, so that seeding 130 demo items doesn't require an API key or burn real credits. Real, live-ingested feedback always goes through the genuine `classifyFeedbackWithAI()` path in `feedback.routes.js`.

## Setup

```bash
npm install
cp .env.example .env
# edit .env: set a real JWT_SECRET

npm run dev      # → http://localhost:4000
```

### Database

Uses a **locally installed MongoDB** by default:

```
MONGODB_URI=mongodb://127.0.0.1:27017/loop
```

Point this at a different host/port (or a hosted Atlas cluster) if needed.

### Seed data (optional)

```bash
npm run seed     # creates one demo workspace, 3 role accounts, ~130 feedback items, 5 themes
npm run clear    # wipes everything
```

This is purely a manual convenience for demoing/grading — real signups via `/register` never touch it and always start with a clean, empty workspace.

## Folder-by-folder guide

```
backend/
├── server.js                      # Entry point — wires up Express, CORS, JSON body parsing, Morgan
│                                    # logging, mounts every route module under /api/*, connects to Mongo,
│                                    # then starts listening.
│
├── seed/
│   ├── seed.js                     # Optional demo-data script (see above)
│   └── clear.js                     # Wipes all collections
│
└── src/
    ├── config/
    │   └── db.js                    # mongoose.connect() wrapper + connection logging
    │
    ├── middleware/
    │   ├── auth.js                   # requireAuth — verifies the JWT, loads the user, and attaches
    │   │                              # req.user = { id, role, workspaceId } for every downstream handler
    │   ├── roles.js                   # requireRole(...roles) — 403s if req.user.role isn't in the allowed list
    │   └── errorHandler.js             # Central error → HTTP response mapping (AppError, Zod errors,
    │                                    # Mongoose validation errors, duplicate-key errors, and a 404 fallback)
    │
    ├── models/                      # One Mongoose schema per entity — see "Data model" below
    │   ├── Workspace.js
    │   ├── User.js
    │   ├── Feedback.js
    │   ├── Theme.js
    │   ├── Report.js
    │   └── TeamMember.js
    │
    ├── routes/                      # One router per resource, each mounted in server.js under /api/*
    │   ├── auth.routes.js             # /api/auth      — signup, login, /me, onboarding completion
    │   ├── feedback.routes.js          # /api/feedback  — inbox CRUD, CSV import, simulate-channel,
    │   │                                 # status changes, reclassify (AI1 entry point)
    │   ├── theme.routes.js              # /api/themes    — theme list + counts, weekly trend + spike detection (AI2)
    │   ├── insight.routes.js             # /api/insights  — Ask LOOP proxy to ai-service (AI3)
    │   ├── report.routes.js               # /api/reports   — VoC report generation (AI4), listing, single-report fetch
    │   ├── analytics.routes.js             # /api/analytics — dashboard/analytics aggregates, date-range aware
    │   ├── workspace.routes.js              # /api/workspace — REAL RBAC: list/invite/change-role/remove members
    │   ├── team.routes.js                    # /api/team      — cosmetic team directory (not login accounts)
    │   └── settings.routes.js                 # /api/settings  — profile/security/notifications/AI/appearance/org
    │
    └── utils/
        ├── ai.js                      # classifyFeedbackWithAI, writeReportNarrativeWithAI (real Claude path,
        │                                # via ai-service) + classifyFeedbackHeuristic (seed-only fallback)
        ├── embeddings.js               # Hashing-trick bag-of-words embeddings — MUST match
        │                                # ai-service/main.py's Python implementation exactly (same
        │                                # tokenizer, hash function, 256 dimensions) so a question embedded
        │                                # in ai-service lands in the same vector space as feedback
        │                                # embeddings computed here at ingestion time.
        └── AppError.js                  # AppError class + asyncHandler() wrapper (routes throw AppError,
                                           # asyncHandler forwards it to errorHandler.js)
```

## Data model

| Model        | Key fields                                                                                                                                                                           | Notes                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `Workspace`  | `name`, `slug`, `timezone`, `currency`, `dateFormat`, `language`, `fiscalYear`                                                                                                       | One per tenant                                                                             |
| `User`       | `email`, `passwordHash`, `role` (ADMIN/ANALYST/VIEWER), `workspaceId`, `onboardingCompleted`, nested `security`/`notifications`/`ai`/`appearance` prefs                              | `toSafeJSON()` strips `passwordHash` before ever returning a user object                   |
| `Feedback`   | `content`, `channel`, `customerLabel`, `sentiment`/`sentimentScore`/`featureArea` (AI1 output), `needsReview`, `themes[]` (links + confidence), `embedding` (select:false), `status` | Text index on `content` for full-text search; compound index on `(workspaceId, createdAt)` |
| `Theme`      | `name`, `description`, `color`                                                                                                                                                       | Unique per `(workspaceId, name)` — reused across items rather than duplicated              |
| `Report`     | `title`, `periodStart/End`, `contentJson.{stats, narrative, recommendedActions}`, `generatedBy`                                                                                      | `contentJson.stats` holds the pre-computed real numbers Claude writes the narrative around |
| `TeamMember` | Job title, department, contact info, performance                                                                                                                                     | Cosmetic directory — unrelated to `User`/login access                                      |

## API reference

All routes are prefixed `/api`. All routes except `/auth/signup`, `/auth/login`, and `/health` require `Authorization: Bearer <token>`.

| Method                | Route                       | Role                       | Purpose                                                                                |
| --------------------- | --------------------------- | -------------------------- | -------------------------------------------------------------------------------------- |
| POST                  | `/auth/signup`              | —                          | Create a workspace + Admin user                                                        |
| POST                  | `/auth/login`               | —                          | Log in                                                                                 |
| GET                   | `/auth/me`                  | any                        | Current user + workspace                                                               |
| PATCH                 | `/auth/onboarding`          | any                        | Complete mandatory onboarding                                                          |
| GET                   | `/feedback`                 | any                        | Paginated/searchable/filterable inbox (channel, sentiment, status, theme, date range)  |
| GET                   | `/feedback/stats`           | any                        | Dashboard stats (volume, sentiment, totals)                                            |
| POST                  | `/feedback`                 | Admin/Analyst              | Add one feedback item — classified via AI1                                             |
| POST                  | `/feedback/import`          | Admin/Analyst              | CSV bulk import (multipart, field `file`)                                              |
| POST                  | `/feedback/simulate`        | Admin/Analyst              | Seed realistic items for a channel (simulated integration)                             |
| PATCH                 | `/feedback/:id/status`      | Admin/Analyst              | NEW → REVIEWED → ACTIONED                                                              |
| POST                  | `/feedback/:id/reclassify`  | Admin/Analyst              | Re-run AI1 classification                                                              |
| GET                   | `/themes`                   | any                        | Themes with counts                                                                     |
| GET                   | `/themes/trends`            | any                        | Weekly volume per theme + spike detection                                              |
| POST                  | `/insights/ask`             | any                        | Proxies to `ai-service` for grounded Q&A (AI3)                                         |
| GET                   | `/reports/summary`          | any                        | Report count stat cards                                                                |
| GET                   | `/reports`                  | any                        | List saved reports                                                                     |
| POST                  | `/reports/generate`         | Admin/Analyst              | Generate a VoC report (`{ days }`) — AI4                                               |
| GET                   | `/reports/:id`              | any                        | One report, full detail                                                                |
| GET                   | `/analytics/*`              | any                        | Overview/trend/sentiment/categories/ratings/insights, all accept `startDate`/`endDate` |
| GET                   | `/workspace/members`        | Admin                      | List real login accounts + roles                                                       |
| POST                  | `/workspace/members/invite` | Admin                      | Create a member (returns one-time temp password)                                       |
| PATCH                 | `/workspace/members/:id`    | Admin                      | Change a member's role                                                                 |
| DELETE                | `/workspace/members/:id`    | Admin                      | Remove a member                                                                        |
| GET/POST/PATCH/DELETE | `/team`                     | any (writes Admin/Analyst) | Cosmetic team directory CRUD                                                           |
| GET/PUT/POST          | `/settings*`                | any                        | Profile/org/security/notification/AI/appearance preferences                            |

Every handler that reads or writes tenant data filters by `req.user.workspaceId`. Forbidden actions return `403`, not a crash.
