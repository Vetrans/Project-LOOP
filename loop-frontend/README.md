# LOOP — Frontend (React + Vite, pure CSS)

The frontend for Project LOOP. Talks to the Node/Express API in
`../backend` (which itself proxies Ask LOOP to `../ai-service`).
Architecture, roles, and features follow the original Project LOOP brief —
implemented as plain React + hand-written CSS (no Tailwind, no CSS
framework) to keep the build simple and dependency-light.

## Design

A color-graded near-black canvas (soft violet/teal/amber light sources,
not a flat single accent), a faint film-grain texture, and tonal —
never flat-saturated — accent fills. Type pairs **Fraunces** (an editorial
serif, used sparingly for page titles, the wordmark, and the big numbers a
person is meant to trust) against **Inter** for the actual interface, with
**IBM Plex Mono** marking anything that's data — timestamps, counts,
status. The signature mark is a deliberately unclosed ring with one dot
slowly completing the orbit — LOOP's whole premise is closing the gap
between scattered feedback and a decision.

This is one part of the `loop/` monorepo:
```
loop/
  loop-frontend/   ← you are here
  backend/         ← Express + MongoDB API
  ai-service/      ← Python FastAPI, Ask LOOP only
```

## Stack

- **React 18 + Vite** — SPA build tooling, no CSS framework
- **React Router 6** — client-side routing (`/`, `/inbox`, `/trends`, `/ask`, `/reports`, `/settings`)
- **Plain CSS** — hand-written design system in `src/styles/` using CSS
  custom properties (see `variables.css`), imported once from `src/index.css`
- **Recharts** — dashboard and trend charts
- **Axios** — API client (`src/lib/api.js`), sends `Authorization: Bearer <token>`
- **lucide-react** — icon set

## Styling approach

There's no utility-class framework here — every class in the JSX maps to a
real rule in `src/styles/*.css`:

| File | Covers |
|---|---|
| `variables.css` | Color tokens, gradients, fonts, radii, shadows |
| `base.css` | Reset, grain texture, focus states, the `.text-*` type scale, shimmer skeleton |
| `layout.css` | Sidebar, topbar, nav links, the app shell |
| `components.css` | Buttons, inputs, panels, badges, tables, modal, empty/error states, layout helpers (`.grid-*`, `.stack`, `.row`) |
| `pages.css` | Page-specific patterns: Inbox's CSV dropzone, Trends' theme list & drill-down, Reports' cards, Settings' invite box |
| `auth.css` | Login/signup page frame |
| `chat.css` | Ask LOOP's chat bubbles and citations |

`src/components/LoopMark.jsx` holds the signature logo mark (shared by
the sidebar and the auth screens) so it's defined once, not copy-pasted.

## What's included

| Page | Route | Matches brief feature(s) | Backend calls |
|---|---|---|---|
| Login / Signup | `/login`, `/signup` | C1 Auth & workspaces | `authApi` |
| Dashboard | `/` | C5 Analytics dashboard | `feedbackApi.stats`, `themesApi.list` |
| Feedback Inbox | `/inbox` | C3 Ingestion, C4 Inbox | `feedbackApi.*` |
| Trends | `/trends` | AI2 Theme clustering & trends | `themesApi.*`, `feedbackApi.list` (drill-down) |
| Ask LOOP | `/ask` | AI3 Grounded Q&A | `insightsApi.ask` (→ backend → ai-service → Claude) |
| Reports | `/reports` | AI4 Voice-of-Customer report | `reportsApi.*` |
| Members | `/settings` | C2 RBAC (Admin-only route) | `membersApi.*` |

RBAC is modeled client-side in `src/context/AuthContext.jsx` via a
`can(action)` helper (`manage_members`, `manage_feedback`, `use_ai`,
`view`), and routes are gated with `RequirePermission` in
`src/components/RouteGuards.jsx`. **This is a UX nicety only** — the real
enforcement (403s on forbidden actions) happens server-side in the Express
API.

## "Looks as per the company that's logged in"

The sidebar (`src/components/Layout.jsx`) and every page header pull the
current company's name straight from the logged-in user's session
(`user.workspace.name`), and every list/chart/report on every page is
populated only by what the backend returns for that session — which is
already scoped to that one workspace server-side. Log in as a different
company's user (or sign up a second workspace) and the entire app reflects
only that company's data, automatically.

## Setup

**Prerequisites:** Node.js 18+, and the backend running (see
`../backend/README.md` — you need that running first, with `npm run seed`
done at least once, before login will work here).

```bash
npm install
cp .env.example .env
npm run dev
```
→ `http://localhost:5173`

| Role | Email | Password |
|---|---|---|
| Admin | `admin@acme-demo.com` | `Password123!` |
| Analyst | `analyst@acme-demo.com` | `Password123!` |
| Viewer | `viewer@acme-demo.com` | `Password123!` |

Or go to `/signup` to create your own workspace from scratch.

### Building for production

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Project structure

```
src/
  styles/            variables.css, base.css, layout.css, components.css, pages.css, auth.css, chat.css
  components/
    Layout.jsx         sidebar + topbar shell, role-aware nav
    LoopMark.jsx         the signature logo mark (shared by sidebar + auth)
    RouteGuards.jsx     ProtectedRoute, RequirePermission
    ui.jsx               StatCard, Badge, Modal, EmptyState, Skeleton, etc.
    charts.jsx            Recharts wrappers (volume, sentiment, themes, trend)
  context/
    AuthContext.jsx       session state + can() RBAC helper, calls authApi
  lib/
    api.js                Axios instance + every backend endpoint wrapper
  pages/
    auth/Login.jsx, Signup.jsx, AuthShell.jsx
    Dashboard.jsx, Inbox.jsx, Trends.jsx, AskLoop.jsx, Reports.jsx, Settings.jsx
    StatusPages.jsx        404 / 403
  App.jsx                  route table
  main.jsx                  entry point
```

Every page fetches its own data with `useEffect` + the matching function
from `src/lib/api.js`, and shows loading skeletons / empty states / inline
errors — there's no mock data in the app.
