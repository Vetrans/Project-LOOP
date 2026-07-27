# 🔁 LOOP — AI Customer Feedback Intelligence Platform

![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-AI_Service-009688?logo=fastapi&logoColor=white)
![Claude](https://img.shields.io/badge/Claude-AI-6E56CF)

**LOOP turns scattered customer feedback into a ranked, evidence-backed list of what to do next.**

Support tickets, app-store reviews, NPS surveys, sales-call notes, and community posts pile up faster than any team can read them. LOOP ingests all of it, uses Claude to classify and cluster it, surfaces what's trending, and answers plain-English questions grounded in your real feedback — no invented quotes, no guesswork.

This is a multi-tenant SaaS platform: every company that signs up gets its own isolated **Workspace**, three role tiers (Admin / Analyst / Viewer), and a full AI pipeline running against their own data only.

---

## 📚 Table of Contents

1. [Architecture](#-architecture)
2. [Tech Stack](#-tech-stack)
3. [Getting Started](#-getting-started)
4. [Roles & Permissions](#-roles--permissions)
5. [User Guide](#-user-guide)
   - [Landing Page](#landing-page)
   - [Creating Your Account & Workspace](#creating-your-account--workspace)
   - [Logging In](#logging-in)
   - [Dashboard](#dashboard)
   - [Feedback Inbox](#feedback-inbox)
   - [Analytics](#analytics)
   - [Theme Trends](#theme-trends)
   - [Ask LOOP (AI Chat)](#ask-loop-ai-chat)
   - [Reports (Voice of Customer)](#reports-voice-of-customer)
   - [Team Directory](#team-directory)
   - [Workspace Members (RBAC)](#workspace-members-rbac)
   - [Settings](#settings)
6. [API Reference](#-api-reference)
7. [Security](#-security)
8. [Troubleshooting](#-troubleshooting)
9. [Roadmap](#-roadmap)
10. [License](#-license)

---

## 🏗️ Architecture

LOOP is three independent services. The browser only ever talks to the Node backend — it never calls MongoDB or Claude directly, and the Anthropic API key never leaves the server.

```
loop/
├── loop-frontend/      # React + Vite — all UI
├── backend/            # Node.js + Express + MongoDB — auth, RBAC, feedback, themes, reports
└── ai-service/         # Python + FastAPI — the ONLY component that calls the Anthropic API
```

```
Browser (React)
     │
     ▼
Backend (Express)  ──────────────►  MongoDB
     │                              (all persistent data — scoped by workspaceId on every query)
     ▼
AI Service (FastAPI)
     │
     ▼
Claude AI  (classification · report narratives · grounded Q&A)
```

**Why a separate AI service?** Keeping the one Claude-calling code path in its own small Python service (rather than scattered across the Node backend) makes it auditable and swappable independently of the rest of the app. The Node backend resolves *who's asking* (workspace, role) from the verified session and forwards only a server-resolved `workspace_id` — `ai-service` never talks to the browser directly and never receives anything it could use to impersonate another tenant.

> **Non-negotiable rule:** every database query touching feedback, themes, reports, or users is filtered by the authenticated user's `workspaceId`. A user from one company can never read another company's data — not even by guessing an ID in the URL.

---

## 🛠️ Tech Stack

| Layer | Technology | Role |
|---|---|---|
| Frontend | React + Vite, Tailwind CSS, React Router, Framer Motion, Recharts | UI, charts, routing, animation |
| Backend | Node.js + Express, MongoDB + Mongoose, JWT, bcrypt, Zod | Auth, RBAC, API, tenant isolation |
| AI Service | Python + FastAPI, pymongo, Anthropic SDK | Classification, report narration, grounded Q&A |
| AI Model | Claude (Anthropic) | All natural-language reasoning |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and Git
- Python 3.10+
- MongoDB (running locally, or a connection string to a hosted instance)
- An Anthropic API key *(optional — the app runs in a graceful local-fallback mode without one; see below)*

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env — set a real JWT_SECRET, and MONGODB_URI if not using the local default
npm run dev
```
→ runs on `http://localhost:4000`

### 2. AI Service

```bash
cd ai-service
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# edit .env — MONGODB_URI must match the backend's; set ANTHROPIC_API_KEY for real Claude answers
uvicorn main:app --reload --port 8000
```
→ runs on `http://localhost:8000`

### 3. Frontend

```bash
cd loop-frontend
npm install
npm run dev
```
→ runs on `http://localhost:5173`

### Running without an Anthropic API key

LOOP is fully explorable with **zero API keys**: without `ANTHROPIC_API_KEY` set, classification falls back to a local rule-based classifier, Ask LOOP still retrieves and cites real feedback (with a simpler local summary instead of a Claude-written answer), and report generation falls back to a template narrative built from the same real numbers. Nothing fakes success — every fallback is honest about being a fallback.

### Environment variables

| File | Variable | Purpose |
|---|---|---|
| `backend/.env` | `MONGODB_URI` | Mongo connection string |
| | `JWT_SECRET` | Signs auth tokens — must be a real secret, never committed |
| | `AI_SERVICE_URL` | Where the backend finds ai-service (default `http://localhost:8000`) |
| | `CLIENT_ORIGIN` | Allowed CORS origin (default `http://localhost:5173`) |
| `ai-service/.env` | `MONGODB_URI` | Must match the backend's |
| | `ANTHROPIC_API_KEY` | Optional — enables real Claude-written answers |
| | `ANTHROPIC_MODEL` | Defaults to `claude-sonnet-4-6` |

Never commit real `.env` files — only `.env.example` with placeholder values.

---

## 👥 Roles & Permissions

| Role | Can do |
|---|---|
| **Admin** | Everything — manage workspace members and roles, plus everything Analyst can do |
| **Analyst** | Add/import/simulate feedback, change feedback status, reclassify, generate reports |
| **Viewer** | Read-only — views dashboards, feedback, analytics, trends, reports, and can use Ask LOOP |

Permissions are enforced **server-side** on every route, not just hidden in the UI — a forbidden action returns a clean `403`, never a crash. The frontend also hides actions a role can't perform, so the UI never dangles a button that would fail.

---

## 📖 User Guide

This section walks through every part of the app as a first-time user would encounter it.

### Landing Page

The public marketing site — hero section, feature highlights, how LOOP's pipeline works, pricing tiers, testimonials, and FAQ. This is what visitors see before signing up.

> 📸 *Add a screenshot of the landing page hero here*
> `docs/screenshots/landing-hero.png`

---

### Creating Your Account & Workspace

Click **Get Started** from the landing page to reach the registration form. Signing up creates two things at once: a new **Workspace** (your company's isolated tenant) and your **User** account as its first **Admin**.

Right after signing up, you're walked through a short mandatory onboarding flow:

1. **Your Profile** — name, phone, designation, department, optional avatar photo
2. **Your Organization** — company name, timezone, currency, date format, fiscal year

You can't reach the dashboard until onboarding is complete — this is enforced both in the UI and isn't just cosmetic.

> 📸 *Add a screenshot of the registration form*
> `docs/screenshots/register.png`

> 📸 *Add a screenshot of the onboarding steps*
> `docs/screenshots/onboarding.png`

---

### Logging In

Return visitors log in with their email and password. Sessions persist across page refreshes via a stored JWT.

> 📸 *Add a screenshot of the login page*
> `docs/screenshots/login.png`

---

### Dashboard

Your home base after logging in. At a glance:

- **Stat cards** — total feedback, % negative, new this week
- **Weekly feedback trend chart**
- **Sentiment breakdown chart**
- **Top feedback themes**
- **Recent feedback table**

Everything here is computed from real data in your workspace — nothing is hardcoded placeholder content.

> 📸 *Add a screenshot of the full dashboard*
> `docs/screenshots/dashboard.png`

---

### Feedback Inbox

The core working surface for triaging customer feedback. Available at **Feedback** in the sidebar.

**Getting feedback in** (three ways, matching how real teams actually receive it):
- **Add Feedback** — a single-entry form (customer name, message, source channel)
- **Upload CSV** — bulk import with a drag-and-drop uploader; reports exactly how many rows imported vs. failed, with error detail per row
- **Simulate Channel** — since LOOP doesn't connect to real third-party integrations, this drops in realistic sample feedback for a channel you pick (Support ticket, App store review, NPS survey, Sales call note, Community post) and classifies each item exactly like a real submission

Every new item — however it arrives — is automatically sent through AI classification (sentiment, sentiment score, theme(s), and a feature-area label).

**Working the inbox:**
- Full-text search across feedback content
- Filter by channel, sentiment, status, theme, and a date range
- Server-side pagination (the inbox stays fast even with thousands of items)
- **Inline status changes** — flip any item between Pending → In Review → Resolved directly from its row
- Export the current filtered view to CSV

> 📸 *Add a screenshot of the inbox with filters open*
> `docs/screenshots/feedback-inbox.png`

> 📸 *Add a screenshot of the Simulate Channel modal*
> `docs/screenshots/simulate-channel.png`

---

### Analytics

Available at **Analytics** in the sidebar. A dashboard of charts, all driven by real aggregated data and all scoped to a **date range you control**:

- Overview stat cards (total feedback, positive/negative reviews, average rating) with period-over-period comparison
- Feedback volume trend over time
- Sentiment distribution (pie chart)
- Top complaint categories (bar chart)
- Rating distribution (1–5 stars, derived from AI sentiment scores)
- AI-generated written insights summarizing what changed this period

Use the date-range filter at the top (with quick presets for last 7/30/90 days) — every chart and insight below it updates to match.

> 📸 *Add a screenshot of the Analytics page with the date filter open*
> `docs/screenshots/analytics.png`

---

### Theme Trends

Available at **Trends** in the sidebar. This is where LOOP's theme clustering becomes visible and actionable:

- A multi-line chart showing each theme's mention volume week over week
- A "notable spikes" callout strip — themes whose volume jumped or dropped sharply vs. the previous week
- A card grid of every theme with its running total and trend %
- **Click any theme card** to drill into the exact feedback items behind it — no more wondering *why* a theme is spiking

> 📸 *Add a screenshot of the Trends page, ideally with a visible spike*
> `docs/screenshots/trends.png`

> 📸 *Add a screenshot of the theme drilldown modal*
> `docs/screenshots/theme-drilldown.png`

---

### Ask LOOP (AI Chat)

Available at **Ask LOOP** in the sidebar. A chat interface for asking plain-English questions about your feedback — *"What are users saying about onboarding?"*, *"What's our biggest complaint this month?"*

Under the hood, this is retrieval-grounded (RAG), not a general chatbot:
1. Your question is turned into a vector and compared against every piece of feedback in your workspace
2. Only the most relevant real items are handed to Claude as context
3. Claude answers strictly from those items — it's instructed never to invent a quote or number
4. **Every answer shows its sources** — click "Show N sources" under any answer to see the exact feedback items (channel, customer, quoted content) it was grounded in

Suggested starter prompts are shown when the chat is empty to help you get going.

> 📸 *Add a screenshot of a chat exchange with sources expanded*
> `docs/screenshots/ask-loop.png`

---

### Reports (Voice of Customer)

Available at **Reports** in the sidebar. One click generates a shareable digest of a recent period:

- **Generate Report** — pre-computes real stats for the period (top themes, sentiment shift, sample quotes), then Claude writes the executive-summary narrative and recommended actions around those real numbers
- **Inline preview** — see the narrative and recommended actions right on the Reports page without leaving it
- **Open Full Report** — a clean, standalone shareable page at its own URL, formatted for printing
- **Print / Save as PDF** — the full report page has a one-click print button; your browser's native "Save as PDF" gives you a real PDF export with no extra software
- **Download** — a plain-text export of the report's content

> 📸 *Add a screenshot of the Reports list with a report selected*
> `docs/screenshots/reports.png`

> 📸 *Add a screenshot of the full shareable report page*
> `docs/screenshots/report-detail.png`

---

### Team Directory

Available at **Team** in the sidebar. A roster view of people in your organization — role/title, department, contact info, project load, and a performance indicator. This is an internal HR-style directory, distinct from workspace login access (see **Members** below).

> 📸 *Add a screenshot of the Team page*
> `docs/screenshots/team.png`

---

### Workspace Members (RBAC)

Available at **Members** in the sidebar — **Admins only**. This is where actual login accounts and permissions live:

- See every account with access to your workspace and their role
- **Invite Member** — creates a real login account immediately with a one-time temporary password shown once (LOOP doesn't send real invite emails — this is by design, since real third-party integrations are out of scope; you relay the password to them directly)
- Change anyone's role between Admin / Analyst / Viewer
- Remove a member's access entirely

Safety rails: you can't remove your own account, and you can't demote or remove the last remaining Admin — a workspace can never end up locked out of admin access.

> 📸 *Add a screenshot of the Members page*
> `docs/screenshots/members.png`

> 📸 *Add a screenshot of the invite flow showing the temp password*
> `docs/screenshots/invite-member.png`

---

### Settings

Available at **Settings** in the sidebar — personal and organization-wide preferences:

- **Profile** — name, phone, designation, department, profile photo
- **Security** — password change, two-factor toggle, login alerts
- **Notifications** — email/push/weekly-report/AI-alert/security-alert toggles
- **AI Preferences** — model choice, response style, language, auto-summary/suggestions toggles
- **Appearance** — theme, accent color, compact mode
- **Organization** — company name, timezone, currency, date format, fiscal year

Changes here are saved for real (no `localStorage` shortcuts) and immediately reflected across the app.

> 📸 *Add a screenshot of the Settings page*
> `docs/screenshots/settings.png`

---

## 🔌 API Reference

Full endpoint-by-endpoint documentation lives with each service:

- [`backend/README.md`](./backend/README.md) — every REST route, required role, and request/response shape
- [`ai-service/README.md`](./ai-service/README.md) — `/classify`, `/report-narrative`, and `/ask` endpoint contracts

Quick summary of the request flow: **Browser → Backend (auth + role check + workspace scoping) → AI Service (only for AI features) → Claude.**

---

## 🔒 Security

- Passwords hashed with bcrypt; sessions are stateless JWTs
- Every tenant-data query is scoped by the authenticated user's `workspaceId` — enforced in code, not convention
- Roles enforced server-side on every mutating route; forbidden actions return `403`
- The Anthropic API key lives only in `ai-service`'s environment — it never reaches the browser or the Node backend
- `.env` files are gitignored everywhere; only `.env.example` (placeholder values) is committed

---

## 🐛 Troubleshooting

| Symptom | Likely cause |
|---|---|
| Ask LOOP / classification returns a 503 | `ai-service` isn't running, or `AI_SERVICE_URL` in `backend/.env` doesn't match where it's listening |
| "Invalid email or password" on a fresh install | You haven't created an account yet — use **Register**, not **Login**, the first time |
| Charts show no data | Try widening the Analytics date-range filter, or add some feedback first (manual entry / CSV / Simulate Channel) |
| CSV import shows failures | Check the row-level error list in the upload result — usually a missing `content` column or an unrecognized `channel` value |

---

## 🗺️ Roadmap

- Real email delivery for member invites
- Slack / Teams integrations
- Webhooks for real third-party channel ingestion
- Custom dashboards
- MongoDB Atlas / production-hosted deployment guide

---

## 📄 License

Built for the Zidio Development internship program. Intended for educational and portfolio purposes.