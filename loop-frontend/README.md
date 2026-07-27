# LOOP — Frontend (React + Vite)

The entire user-facing application: the marketing site, auth flows, and the full dashboard (feedback inbox, analytics, trends, Ask LOOP chat, reports, team/members, settings).

This app **never calls MongoDB or Claude directly** — every request goes through the backend's REST API (`src/services/api.js`), which resolves auth and workspace scoping server-side.

## Stack

- **React 19** + **Vite** — app shell and build tooling
- **React Router** — client-side routing (`src/App.jsx`)
- **Tailwind CSS v4** — utility-first styling
- **Framer Motion** — page/element transitions
- **Recharts** — all charts (dashboard, analytics, trends)
- **Axios** — HTTP client, wrapped in `src/services/api.js`
- **Sonner** — toast notifications
- **lucide-react** — icon set

## Setup

```bash
npm install
npm run dev      # → http://localhost:5173
```

The dev server proxies `/api` to `http://localhost:4000` (see `vite.config.js`), so the backend must be running for anything beyond the landing page to work.

## Folder-by-folder guide

```
src/
├── App.jsx                # Owns ALL routing — every route the app has is declared here
├── main.jsx                # Entry point: mounts <App/> inside <AuthProvider> + <Toaster/>
├── index.css / App.css      # Global styles, Tailwind imports, a couple of hand-written animations
│
├── components/
│   ├── analytics/           # Charts + filters for the Analytics page
│   ├── askloop/             # The Ask LOOP chat UI (window, bubbles, header, suggested prompts)
│   ├── auth/                # Login/Register forms, shared auth layout & illustration
│   ├── common/               # Small reusable primitives: Button, Modal, Badge, Loader, Pagination, EmptyState
│   ├── dashboard/            # Widgets for the home Dashboard page
│   ├── feedback/             # Everything for the Feedback Inbox: table, filters, add/upload/simulate modals
│   ├── landing/               # The public marketing site, broken into hero/, pricing/, faq/, footer/, etc.
│   ├── layout/                 # App chrome: Sidebar, Topbar, DashboardLayout, PageContainer, public Navbar/Footer
│   ├── members/                 # Workspace Members (RBAC) page's header/table/invite-modal
│   ├── reports/                  # Reports list, filters, inline preview, export modal
│   ├── settings/                  # One component per settings section (Profile, Security, AI, Appearance, Org...)
│   ├── team/                       # Team directory page's header/table/modals (cosmetic HR directory, not RBAC)
│   ├── trends/                     # Theme Trends page's header, chart, cards, drilldown modal
│   └── ui/                          # shadcn-style base primitives (button.jsx etc.) used sparingly
│
├── context/
│   ├── AuthContext.jsx        # THE source of truth for the logged-in user. Exposes login/signup/logout/
│   │                           # completeOnboarding/updateUser via useAuth(). Reads/writes the JWT in localStorage.
│   └── ThemeContext.jsx        # (present for future light/dark theming; Appearance settings currently
│                                 # only persist to the backend, this context isn't the active theme source)
│
├── data/                    # Static arrays for dropdowns and landing-page copy (not from the API) —
│                             # e.g. teamData.js (role/department options), faq.js, pricing.js, workflow.js
│
├── hooks/                   # useAuth.js, useFeedback.js, useTheme.js — thin wrappers, mostly re-exporting context
│
├── lib/
│   └── utils.js              # cn() — clsx + tailwind-merge helper used by the ui/ primitives
│
├── pages/                   # One file per route — see "Pages" table below
│
├── routes/
│   └── AppRoutes.jsx          # ⚠️ Dead code — empty/unused. App.jsx owns all routing directly.
│                                # Safe to delete; nothing imports this file.
│
├── services/                # One file per backend resource — every API call in the app goes through these.
│   ├── api.js                  # The axios instance: base URL, auth header injection, 401 handling
│   ├── authService.js           # (thin — most auth calls actually live in AuthContext.jsx itself)
│   ├── feedbackService.js        # getFeedback, addFeedback, updateFeedbackStatus, uploadFeedbackCSV, simulateChannel
│   ├── themeService.js            # getThemes, getThemeTrends
│   ├── analyticsService.js         # getOverviewStats, getFeedbackTrend, getSentimentData, getCategoryData,
│   │                                 # getRatingDistribution, getAIInsights, exportAnalytics (stub)
│   ├── askLoopService.js            # askLoop(question) → { answer, citations }
│   ├── reportsService.js             # getReportSummary, getReports, getReportById, generateReport, downloadReport
│   ├── teamService.js                # Team directory CRUD (cosmetic roster, not login accounts)
│   ├── workspaceService.js            # Real RBAC: getWorkspaceMembers, inviteMember, updateMemberRole, removeMember
│   ├── settingsService.js              # getSettings, saveSettings, resetSettings, changePassword
│   └── dashboardService.js              # Aggregates a few feedback endpoints into Dashboard-page-shaped data
│
├── styles/                  # theme.js/colors.js/typography.js/shadows.js/radius.js — design-token constants
│                             # used by a handful of the earlier landing-page components; globals.css holds
│                             # the marquee keyframes used by the Companies logo strip
│
└── utils/
    ├── constants.js           # Misc shared constants
    ├── exportCSV.js            # Client-side CSV export used by the Feedback inbox's "Export CSV" button
    └── formatters.js / helpers.js  # Small formatting helpers
```

## Pages (`src/pages/`)

| File               | Route          | Who can view it                             | What it does                                                                         |
| ------------------ | -------------- | ------------------------------------------- | ------------------------------------------------------------------------------------ |
| `LandingPage.jsx`  | `/`            | Public                                      | Marketing site — hero, features, pricing, FAQ, testimonials                          |
| `Login.jsx`        | `/login`       | Public                                      | Sign in                                                                              |
| `Register.jsx`     | `/register`    | Public                                      | Sign up — creates a Workspace + Admin user                                           |
| `Onboarding.jsx`   | `/onboarding`  | Logged in, not yet onboarded                | Mandatory profile + organization setup, reuses the Settings profile/org components   |
| `Dashboard.jsx`    | `/dashboard`   | Any role                                    | Home — stat cards, charts, recent feedback                                           |
| `Feedback.jsx`     | `/feedback`    | Any role (write actions Admin/Analyst only) | The feedback inbox — search, filters, pagination, add/upload/simulate, inline status |
| `Analytics.jsx`    | `/analytics`   | Any role                                    | Charts + date-range filter                                                           |
| `Trends.jsx`       | `/trends`      | Any role                                    | Theme clustering & spike detection, drilldown into feedback per theme                |
| `AskLoop.jsx`      | `/ask-loop`    | Any role                                    | The grounded Q&A chat                                                                |
| `Reports.jsx`      | `/reports`     | Any role (generate is Admin/Analyst only)   | Voice-of-Customer report list + inline preview                                       |
| `ReportDetail.jsx` | `/reports/:id` | Any role                                    | Standalone, printable full report ("shareable page" / PDF export via browser print)  |
| `Team.jsx`         | `/team`        | Any role (write actions Admin/Analyst only) | Cosmetic team directory (job titles, departments — not login access)                 |
| `Members.jsx`      | `/members`     | **Admin only**                              | Real RBAC: invite/remove members, change roles                                       |
| `Settings.jsx`     | `/settings`    | Any role                                    | Profile/security/notifications/AI/appearance/organization preferences                |
| `NotFound.jsx`     | `*`            | Public                                      | 404 page                                                                             |
| `Forbidden.jsx`    | `/forbidden`   | Public                                      | 403 page, reached when a role-gated route is hit directly                            |

## How auth flows through the app

1. `AuthContext.jsx` holds the current `user` object and a `loading` flag, and exposes `login`, `signup`, `logout`, `completeOnboarding`, `updateUser`.
2. `App.jsx`'s `ProtectedRoute` wrapper checks `user` + `onboardingCompleted` before rendering any dashboard route, redirecting to `/login` or `/onboarding` as needed. It also accepts an optional `allowedRoles` prop (used on `/members`) to redirect to `/forbidden` for a role mismatch.
3. `services/api.js`'s axios instance attaches the JWT from `localStorage` to every request and clears it on a `401` response.
4. Every page that needs to hide an action for non-Admin/Analyst roles computes `const canManage = user?.role === "ADMIN" || user?.role === "ANALYST"` via `useAuth()` and conditionally renders — mirroring exactly what the backend's `requireRole()` guards enforce, so the UI never shows a button that would 403 if clicked.

## Known cleanup item

`src/routes/AppRoutes.jsx` is empty and unused — `App.jsx` owns all routing directly. Delete it whenever convenient; nothing references it.
