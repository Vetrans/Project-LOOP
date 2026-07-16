import "dotenv/config";
import { connectDB } from "../src/config/db.js";
import mongoose from "mongoose";
import Workspace from "../src/models/Workspace.js";
import User from "../src/models/User.js";
import Theme from "../src/models/Theme.js";
import Feedback from "../src/models/Feedback.js";
import { classifyFeedback } from "../src/utils/ai.js";
import { embedText } from "../src/utils/embeddings.js";

const CHANNELS = ["Support ticket", "App store review", "NPS survey", "Sales call note", "Community post"];

const THEMES = [
  { name: "Onboarding friction", color: "#FB7185" },
  { name: "Billing & invoices", color: "#F5B043" },
  { name: "Mobile experience", color: "#7C6FF0" },
  { name: "SSO / security", color: "#FB7185" },
  { name: "Export & reporting", color: "#2DD9B9" },
];

// Templated but varied sample content — enough real variety for AI
// classification and Ask LOOP retrieval to behave meaningfully (brief
// Appendix A + "seed data is mandatory", 120+ items).
const TEMPLATES = [
  { text: "Onboarding took forever — I couldn't figure out how to invite my team.", channel: "Support ticket" },
  { text: "The new dashboard is gorgeous and finally fast. Huge improvement.", channel: "App store review" },
  { text: "It does the job, but the mobile experience needs work.", channel: "NPS survey" },
  { text: "Prospect wants SSO before they'll sign — third time this month.", channel: "Sales call note" },
  { text: "Love the new export feature, saved me an hour today.", channel: "Community post" },
  { text: "Billing page keeps timing out when I try to download an invoice.", channel: "Support ticket" },
  { text: "Setup wizard is confusing, I gave up halfway through onboarding.", channel: "Support ticket" },
  { text: "Mobile app crashes every time I try to open the inbox.", channel: "App store review" },
  { text: "Would love SSO support for our security team's compliance review.", channel: "Sales call note" },
  { text: "Invoice totals don't match what we were quoted, very frustrating.", channel: "Support ticket" },
  { text: "Reporting exports are amazing now, thank you for the CSV option.", channel: "Community post" },
  { text: "Great product overall, onboarding docs could use more screenshots.", channel: "NPS survey" },
  { text: "We need role-based access before we can roll this out company-wide.", channel: "Sales call note" },
  { text: "The mobile experience feels like an afterthought compared to desktop.", channel: "App store review" },
  { text: "Support team was fast and helpful resolving my billing question.", channel: "Support ticket" },
  { text: "Dashboard load times have gotten noticeably slower this month.", channel: "NPS survey" },
  { text: "Onboarding flow saved us hours compared to our old tool.", channel: "Community post" },
  { text: "Still waiting on SSO — this is blocking our security sign-off.", channel: "Sales call note" },
  { text: "Exported report was missing several columns we needed.", channel: "Support ticket" },
  { text: "App store reviewers keep mentioning the app is confusing to navigate.", channel: "App store review" },
];

const CUSTOMER_NAMES = [
  "Nadia K.", "Devon P.", "Priya S.", "Marcus L.", "Aiko T.", "Chris W.", "Elena R.",
  "Sam O.", "Fatima Z.", "Jordan B.", "Wei C.", "Ines M.", "Tom H.", "Grace N.",
];

function randomDateWithinDays(days) {
  const now = Date.now();
  const offset = Math.random() * days * 24 * 60 * 60 * 1000;
  return new Date(now - offset);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function run() {
  await connectDB();

  console.log("[seed] clearing existing demo data…");
  await Promise.all([
    Feedback.deleteMany({}),
    Theme.deleteMany({}),
    User.deleteMany({}),
    Workspace.deleteMany({}),
  ]);

  const workspace = await Workspace.create({ name: "Acme Corp", slug: "acme-corp" });
  console.log(`[seed] created workspace "${workspace.name}" (${workspace._id})`);

  const themeDocs = {};
  for (const t of THEMES) {
    themeDocs[t.name] = await Theme.create({ ...t, workspaceId: workspace._id });
  }

  const users = [
    { name: "Ada Admin", email: "admin@acme-demo.com", role: "ADMIN", password: "Password123!" },
    { name: "Ana Analyst", email: "analyst@acme-demo.com", role: "ANALYST", password: "Password123!" },
    { name: "Vic Viewer", email: "viewer@acme-demo.com", role: "VIEWER", password: "Password123!" },
  ];
  for (const u of users) {
    const user = new User({ name: u.name, email: u.email, role: u.role, workspaceId: workspace._id });
    await user.setPassword(u.password);
    await user.save();
    console.log(`[seed] user ${u.role.padEnd(7)} → ${u.email} / ${u.password}`);
  }

  console.log("[seed] generating 130 feedback items (this classifies each one — may take a bit)…");
  let created = 0;
  for (let i = 0; i < 130; i++) {
    const template = pick(TEMPLATES);
    const content = template.text;
    const channel = template.channel || pick(CHANNELS);
    const createdAt = randomDateWithinDays(42);

    const classification = classifyFeedback(
      content,
      Object.keys(themeDocs)
    );

    const themeLinks = classification.themes
      .filter((name) => themeDocs[name])
      .map((name) => ({ themeId: themeDocs[name]._id, confidence: 0.8 }));

    // Guarantee at least one theme link even if the classifier picked an
    // unseeded name, so every item is drill-down-able from Trends.
    if (themeLinks.length === 0) {
      const fallback = pick(Object.values(themeDocs));
      themeLinks.push({ themeId: fallback._id, confidence: 0.5 });
    }

    await Feedback.create({
      workspaceId: workspace._id,
      content,
      channel,
      customerLabel: pick(CUSTOMER_NAMES),
      sentiment: classification.sentiment,
      sentimentScore: classification.sentimentScore,
      featureArea: classification.featureArea,
      classificationRationale: classification.rationale,
      themes: themeLinks,
      embedding: embedText(content),
      status: pick(["NEW", "NEW", "REVIEWED", "ACTIONED"]),
      createdAt,
    });
    created += 1;
    if (created % 20 === 0) console.log(`[seed]   ${created}/130`);
  }

  console.log(`[seed] done — ${created} feedback items, ${THEMES.length} themes, 3 users.`);
  console.log("[seed] log in with any of the emails above at /login.");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
