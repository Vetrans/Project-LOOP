# LOOP — Frontend (React + Vite, MERN stack)

This is the **frontend** for Project LOOP, an AI customer-feedback intelligence
platform. It's built with the MERN-stack frontend piece (React), and is designed
to talk to an Express + MongoDB backend that isn't built yet — see "Demo mode"
below and the companion backend guide.

Architecture, roles, data model, and features all follow the original Project
LOOP brief exactly — only the implementation stack changed (Next.js → React +
Vite, Prisma/Postgres → Mongoose/MongoDB on the backend side).

## Stack

- **React 18 + Vite** — SPA build tooling
- **React Router 6** — client-side routing (`/`, `/inbox`, `/trends`, `/ask`, `/reports`, `/settings`)
- **Tailwind CSS** — utility-first styling, with the LOOP design tokens in `tailwind.config.js`
- **Recharts** — dashboard and trend charts
- **Axios** — API client (`src/lib/api.js`), already wired for a JWT-style `Authorization: Bearer` header
- **lucide-react** — icon set

## What's included

| Page | Route | Matches brief feature(s) |
|---|---|---|
| Login / Signup | `/login`, `/signup` | C1 Auth & workspaces |
| Dashboard | `/` | C5 Analytics dashboard |
| Feedback Inbox | `/inbox` | C3 Ingestion, C4 Inbox |
| Trends | `/trends` | AI2 Theme clustering & trends |
| Ask LOOP | `/ask` | AI3 Grounded Q&A |
| Reports | `/reports` | AI4 Voice-of-Customer report |
| Members | `/settings` | C2 RBAC (Admin-only route) |

RBAC is modeled client-side in `src/context/AuthContext.jsx` via a `can(action)`
helper (`manage_members`, `manage_feedback`, `use_ai`, `view`), and routes are
gated with `RequirePermission` in `src/components/RouteGuards.jsx`. **This is a
UX nicety only** — the real enforcement (returning 403s) must happen server-side
in the Express API, per the brief's non-negotiable security rule.

## Demo mode

There's no backend yet, so the app currently runs on **mock data**
(`src/lib/mockData.js`) and a **demo auth mode** (`DEMO_MODE = true` in
`src/context/AuthContext.jsx`) — any email/password logs you in as an Admin.

To connect the real backend once it exists:
1. Set `DEMO_MODE = false` in `src/context/AuthContext.jsx`.
2. Replace the mock data + `setTimeout` calls in `Dashboard.jsx`, `Inbox.jsx`,
   `Trends.jsx`, `AskLoop.jsx`, and `Reports.jsx` with the corresponding
   functions already stubbed out in `src/lib/api.js` (`feedbackApi`,
   `themesApi`, `insightsApi`, `reportsApi`, `membersApi`).
3. Point `VITE_API_URL` at your deployed Express API.

## Setup

**Prerequisites:** Node.js 18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Copy the env file (defaults are fine for demo mode)
cp .env.example .env

# 3. Run the dev server
npm run dev
# → http://localhost:5173
```

Sign in with any email/password on `/login` — demo mode logs you in as an
Admin in workspace "Acme Corp" so every route and permission is visible.

### Building for production

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

Deploy `dist/` to any static host (Vercel, Netlify, Render static site, etc).
When you deploy the real backend, set `VITE_API_URL` as an environment
variable on your host to point at it.

## Project structure

```
src/
  components/
    Layout.jsx        # sidebar + topbar shell, role-aware nav
    RouteGuards.jsx    # ProtectedRoute, RequirePermission
    ui.jsx             # StatCard, Badge, Modal, EmptyState, etc.
    charts.jsx          # Recharts wrappers (volume, sentiment, themes, trend)
  context/
    AuthContext.jsx     # session state + can() RBAC helper
  lib/
    api.js              # Axios instance + endpoint helpers for the future Express API
    mockData.js          # demo-mode data, shaped like the Mongoose schemas
  pages/
    auth/Login.jsx, Signup.jsx, AuthShell.jsx
    Dashboard.jsx, Inbox.jsx, Trends.jsx, AskLoop.jsx, Reports.jsx, Settings.jsx
    StatusPages.jsx      # 404 / 403
  App.jsx                # route table
  main.jsx                # entry point
```

## Next step: the backend

This frontend expects an Express + MongoDB (Mongoose) API at `VITE_API_URL`
exposing routes matching `src/lib/api.js`:

```
/api/auth          signup, login, me, logout
/api/feedback       list, create, import (CSV), :id/status, :id/reclassify
/api/themes         list, trends
/api/insights/ask    grounded Q&A (embeddings + retrieval + Claude)
/api/reports         list, generate, :id
/api/workspace/members  list, invite, :id (role update)
```

Every route must authenticate the session, check the caller's role, and scope
all Mongo queries by `workspaceId` — that's the one non-negotiable rule
carried over from the original brief. Ask for the backend build next and it
can follow this same file-by-file approach.
