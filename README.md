# LOOP — AI Customer-Feedback Intelligence Platform

Multi-tenant SaaS: any number of companies ("workspaces") share this one
deployment, each with its own isolated data, its own three-tier team
(Admin / Analyst / Viewer), and its own branded view of the app driven by
whichever company the logged-in person belongs to.

```
loop/
  loop-frontend/   React + Vite + pure CSS (no framework/utility library)
  backend/         Node/Express + MongoDB — auth, RBAC, feedback, themes, reports
  ai-service/      Python + FastAPI — Ask LOOP only, the one place that calls Claude
```cd 

## Why three services

| Service | Language | Responsible for |
|---|---|---|
| `loop-frontend` | JS (React) | UI only — calls `backend`, never `ai-service` directly |
| `backend` | JS (Node/Express) | Auth, sessions, RBAC, tenant isolation, feedback CRUD, CSV import, themes, Voice-of-Customer reports. All of this runs as fast deterministic logic — **no external AI calls**. |
| `ai-service` | Python (FastAPI) | Ask LOOP (grounded Q&A) only. This is the **only** component that calls the Anthropic API. `backend` resolves the caller's `workspaceId` from their session and forwards just that + the question — `ai-service` never talks to the browser directly. |

This keeps the one AI-calling code path small and isolated, and satisfies
"use Python and JS in the backend" without scattering Claude calls
throughout the app.

## The three-tier user hierarchy (per company)

Every workspace (company) has its own members split across exactly three
roles, enforced server-side on every request:

| Role | Can do |
|---|---|
| **Admin** | Everything — manage members & roles, full data access |
| **Analyst** | Ingest/manage feedback, use AI features, cannot manage members |
| **Viewer** | Read-only — dashboards, reports, Ask LOOP |

A forbidden action always returns a clean `403`, never a silent no-op or a
crash. This is enforced in `backend/src/middleware/roles.js` on every
protected route — the frontend hiding a button is a UX nicety, not the
real boundary.

## Multi-tenant SaaS architecture

Signing up at `/signup` creates a brand-new **Workspace** (company) and
makes the creator its Admin. One login page serves every company — logging
in resolves *which* workspace you belong to from your account, and the
backend scopes **every single database query** by that `workspaceId`,
resolved server-side from your verified session token, never trusted from
a URL or request body. Two companies can run in the same database and
never see a byte of each other's data — the person you're logged in as
only ever sees their own company's feedback, themes, reports, and
teammates, and the sidebar always shows which company that is.

---

## 0. Prerequisites

- **Node.js 18+** and npm
- **Python 3.10+** and pip
- **MongoDB**, installed locally (Step 1 below)
- Optional: an **Anthropic API key**, used only by `ai-service` for Ask
  LOOP. Without one, Ask LOOP still retrieves and cites real feedback, just
  with a simple local summary instead of a Claude-written answer — so the
  whole app is demoable with zero API keys.

---

## 1. Install MongoDB locally

Pick your OS:

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Download the MSI installer from
<https://www.mongodb.com/try/download/community>, run it (choose "Install
as a Service" so it starts automatically), then confirm it's running via
the Services app or:
```powershell
net start MongoDB
```

**Linux (Ubuntu/Debian):**
```bash
# Follow the official instructions for your exact version:
# https://www.mongodb.com/docs/manual/administration/install-on-linux/
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Or, if you have Docker and don't want a native install:**
```bash
docker run -d --name loop-mongo -p 27017:27017 mongo:7
```

Whichever route you pick, you should end up with MongoDB listening on
`mongodb://127.0.0.1:27017` — that's the default every `.env.example` in
this repo already points to, so no extra config is needed for local dev.

Verify it's up:
```bash
mongosh --eval "db.runCommand({ ping: 1 })"
```

---

## 2. Start the backend (Node/Express)

```bash
cd backend
npm install
cp .env.example .env
```

`.env` defaults already match a standard local Mongo install — open it and
set a real `JWT_SECRET` (any long random string, e.g. `openssl rand -hex 32`).

Seed the demo workspace (required — creates a company, three role-based
users, and 130 realistic feedback items), then start the API:

```bash
npm run seed
npm run dev
```
→ `http://localhost:4000`

| Role | Email | Password |
|---|---|---|
| Admin | `admin@acme-demo.com` | `Password123!` |
| Analyst | `analyst@acme-demo.com` | `Password123!` |
| Viewer | `viewer@acme-demo.com` | `Password123!` |

---

## 3. Start the AI service (Python/FastAPI)

In a **second terminal**:

```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Open `.env` — `MONGODB_URI` should match the backend's, and optionally set
`ANTHROPIC_API_KEY` for real Claude-written Ask LOOP answers.

```bash
uvicorn main:app --reload --port 8000
```
→ `http://localhost:8000` — check `/health`.

---

## 4. Start the frontend (React)

In a **third terminal**:

```bash
cd loop-frontend
npm install
cp .env.example .env
npm run dev
```
→ `http://localhost:5173` — log in with any seeded account above.

---

## 5. Try it out

- **Dashboard** — real stats and charts computed from the seeded feedback
- **Inbox** — search/filter the 130 seeded items, add a new one (classified
  instantly by local logic), or import a CSV
- **Trends** — click a theme to drill into the actual feedback behind it
- **Ask LOOP** — ask "What are users saying about onboarding?" — this is
  the one request that leaves Node and goes to `ai-service`, which
  retrieves real feedback and asks Claude to answer only from it
- **Reports** — generate a Voice-of-Customer report; try it as Analyst vs
  Viewer to see RBAC in action
- **Members** (Admin only) — invite a teammate; since real email delivery
  is out of scope, LOOP shows a one-time temp password to share directly

Sign up a **second company** at `/signup` to see tenant isolation for
yourself — it gets its own empty inbox, themes, and members, completely
separate from Acme Corp.

---

## Project structure

```
loop/
  loop-frontend/
    src/
      styles/            variables.css, base.css, layout.css, components.css, auth.css, chat.css
      components/         Layout, RouteGuards, ui.jsx, charts.jsx
      context/AuthContext.jsx
      lib/api.js           every backend endpoint wrapper
      pages/                 Dashboard, Inbox, Trends, AskLoop, Reports, Settings, auth/*
  backend/
    server.js
    src/
      models/               Workspace, User, Feedback, Theme, Report (Mongoose)
      middleware/            auth.js (JWT + tenant resolution), roles.js (RBAC), errorHandler.js
      routes/                 auth, feedback, theme, insight (proxy), report, workspace
      utils/ai.js              local classification + report narrative (no external calls)
      utils/embeddings.js       hashing-trick vectors, shared algorithm with ai-service
    seed/seed.js
  ai-service/
    main.py                  FastAPI app — the only Anthropic API caller in this project
```

See `backend/README.md`, `ai-service/README.md`, and `loop-frontend/README.md`
for each service's full API reference and internals.
