// Demo-mode data. The real app replaces every one of these with a call
// through src/lib/api.js once the Express + MongoDB backend is running.
// Shapes intentionally mirror the Mongoose schemas (Section 07 of the brief).

export const mockUser = {
  id: "u_1",
  name: "Rishi Sharma",
  email: "rishi@acme-demo.com",
  role: "ADMIN",
  workspace: { id: "w_1", name: "Acme Corp" },
};

export const mockStats = {
  totalItems: 1284,
  pctNegative: 24,
  newThisWeek: 63,
  gaugeTrend: +8,
};

export const mockVolume = [
  { date: "Jun 15", volume: 38 },
  { date: "Jun 22", volume: 52 },
  { date: "Jun 29", volume: 41 },
  { date: "Jul 06", volume: 67 },
  { date: "Jul 13", volume: 74 },
  { date: "Jul 20", volume: 58 },
  { date: "Jul 27", volume: 89 },
];

export const mockSentiment = [
  { name: "Positive", value: 612, color: "#2DD9B9" },
  { name: "Neutral", value: 364, color: "#F5B043" },
  { name: "Negative", value: 308, color: "#FB7185" },
];

export const mockThemes = [
  { id: "t_1", name: "Onboarding friction", count: 142, trend: 34, color: "#FB7185" },
  { id: "t_2", name: "Billing & invoices", count: 98, trend: 12, color: "#F5B043" },
  { id: "t_3", name: "Mobile experience", count: 87, trend: -6, color: "#7C6FF0" },
  { id: "t_4", name: "SSO / security", count: 61, trend: 41, color: "#FB7185" },
  { id: "t_5", name: "Export & reporting", count: 54, trend: 9, color: "#2DD9B9" },
];

export const mockThemeTrend = [
  { week: "W1", "Onboarding friction": 18, "Billing & invoices": 12, "SSO / security": 4 },
  { week: "W2", "Onboarding friction": 22, "Billing & invoices": 14, "SSO / security": 6 },
  { week: "W3", "Onboarding friction": 27, "Billing & invoices": 15, "SSO / security": 9 },
  { week: "W4", "Onboarding friction": 31, "Billing & invoices": 16, "SSO / security": 13 },
  { week: "W5", "Onboarding friction": 34, "Billing & invoices": 18, "SSO / security": 15 },
  { week: "W6", "Onboarding friction": 41, "Billing & invoices": 19, "SSO / security": 18 },
];

export const mockFeedback = [
  {
    id: "f_1",
    content: "Onboarding took forever — I couldn't figure out how to invite my team.",
    channel: "Support ticket",
    sentiment: "NEG",
    score: -0.72,
    themes: ["Onboarding friction"],
    status: "NEW",
    createdAt: "2026-07-12T09:20:00Z",
    customerLabel: "Nadia K.",
  },
  {
    id: "f_2",
    content: "The new dashboard is gorgeous and finally fast. Huge improvement.",
    channel: "App store review",
    sentiment: "POS",
    score: 0.88,
    themes: ["Mobile experience"],
    status: "REVIEWED",
    createdAt: "2026-07-12T07:05:00Z",
    customerLabel: "Devon P.",
  },
  {
    id: "f_3",
    content: "It does the job, but the mobile experience needs work.",
    channel: "NPS survey",
    sentiment: "NEU",
    score: 0.02,
    themes: ["Mobile experience"],
    status: "NEW",
    createdAt: "2026-07-11T18:40:00Z",
    customerLabel: "Priya S.",
  },
  {
    id: "f_4",
    content: "Prospect wants SSO before they'll sign — third time this month.",
    channel: "Sales call note",
    sentiment: "NEG",
    score: -0.4,
    themes: ["SSO / security"],
    status: "ACTIONED",
    createdAt: "2026-07-11T11:15:00Z",
    customerLabel: "Marcus L.",
  },
  {
    id: "f_5",
    content: "Love the new export feature, saved me an hour today.",
    channel: "Community post",
    sentiment: "POS",
    score: 0.81,
    themes: ["Export & reporting"],
    status: "REVIEWED",
    createdAt: "2026-07-10T15:50:00Z",
    customerLabel: "Aiko T.",
  },
  {
    id: "f_6",
    content: "Billing page keeps timing out when I try to download an invoice.",
    channel: "Support ticket",
    sentiment: "NEG",
    score: -0.66,
    themes: ["Billing & invoices"],
    status: "NEW",
    createdAt: "2026-07-10T08:30:00Z",
    customerLabel: "Chris W.",
  },
];

export const mockReports = [
  {
    id: "r_1",
    title: "Voice of Customer — Week of Jul 6",
    period: "Jul 6 – Jul 12, 2026",
    createdAt: "2026-07-13T09:00:00Z",
    topThemes: ["Onboarding friction", "SSO / security", "Billing & invoices"],
  },
  {
    id: "r_2",
    title: "Voice of Customer — Week of Jun 29",
    period: "Jun 29 – Jul 5, 2026",
    createdAt: "2026-07-06T09:00:00Z",
    topThemes: ["Mobile experience", "Onboarding friction"],
  },
];

export const mockMembers = [
  { id: "u_1", name: "Rishi Sharma", email: "rishi@acme-demo.com", role: "ADMIN" },
  { id: "u_2", name: "Bhavesh Sompura", email: "bhavesh@acme-demo.com", role: "ANALYST" },
  { id: "u_3", name: "Saloni Soni", email: "saloni@acme-demo.com", role: "VIEWER" },
];
