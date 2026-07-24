import { z } from "zod";

/* ------------------------------------------------------------------ *
 * AI1 — Real Claude-backed classification, proxied through ai-service
 * (the ONLY component that holds the Anthropic API key). Node's job
 * here is to call it, validate the shape with Zod before anything
 * touches the database, and retry/flag-for-review on failure — per
 * brief §9.1.
 * ------------------------------------------------------------------ */

const classificationSchema = z.object({
  sentiment: z.enum(["POS", "NEU", "NEG"]),
  sentimentScore: z.number().min(-1).max(1),
  themes: z.array(z.string().min(1)).min(1),
  featureArea: z.string().min(1),
  rationale: z.string().min(1),
});

async function callClassifyEndpoint(content, existingThemeNames) {
  const base = process.env.AI_SERVICE_URL || "http://localhost:8000";
  const response = await fetch(`${base}/classify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, existing_themes: existingThemeNames }),
  });
  if (!response.ok) throw new Error(`ai-service /classify returned ${response.status}`);
  const body = await response.json();
  return classificationSchema.parse(body);
}

/* Real AI1 entry point. Retries once on any failure (network or
 * validation), then returns a "needs manual review" shape rather than
 * silently faking a classification — matches brief §9.1's "retry once,
 * then flag for manual review." */
export async function classifyFeedbackWithAI(content, existingThemeNames = []) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await callClassifyEndpoint(content, existingThemeNames);
      return { ...result, needsReview: false };
    } catch (err) {
      if (attempt === 0) continue;
      return {
        sentiment: null,
        sentimentScore: null,
        themes: [],
        featureArea: null,
        rationale:
          "Automatic classification failed after retry — flagged for manual review.",
        needsReview: true,
      };
    }
  }
}

/* ------------------------------------------------------------------ *
 * Kept ONLY for seed.js. Calling Claude for 130 seeded demo items on
 * every fresh clone would be slow and burn real API credits for no
 * benefit — the brief's requirement is that real ingested feedback is
 * AI-classified (see feedback.routes.js), not that the seed script
 * must be. This is the same heuristic that used to be the only
 * classifier in the app.
 * ------------------------------------------------------------------ */
const NEG_WORDS = [
  "broken", "slow", "timeout", "confusing", "hate", "terrible", "bug",
  "fail", "never", "forever", "worst", "frustrat", "crash", "missing",
  "waiting", "blocking",
];
const POS_WORDS = [
  "love", "great", "gorgeous", "fast", "amazing", "excellent", "saved",
  "huge improvement", "thank", "helpful", "smooth",
];

export function classifyFeedbackHeuristic(content, existingThemeNames = []) {
  const lower = content.toLowerCase();
  const negHits = NEG_WORDS.filter((w) => lower.includes(w)).length;
  const posHits = POS_WORDS.filter((w) => lower.includes(w)).length;

  let sentiment = "NEU";
  let sentimentScore = 0;
  if (posHits > negHits) {
    sentiment = "POS";
    sentimentScore = Math.min(0.9, 0.3 + posHits * 0.2);
  } else if (negHits > posHits) {
    sentiment = "NEG";
    sentimentScore = -Math.min(0.9, 0.3 + negHits * 0.2);
  }

  const themeGuess =
    existingThemeNames.find((t) => lower.includes(t.split(" ")[0].toLowerCase())) ||
    (lower.includes("onboard")
      ? "Onboarding friction"
      : lower.includes("bill") || lower.includes("invoice")
        ? "Billing & invoices"
        : lower.includes("mobile") || lower.includes("app")
          ? "Mobile experience"
          : lower.includes("sso") || lower.includes("security")
            ? "SSO / security"
            : lower.includes("export") || lower.includes("report")
              ? "Export & reporting"
              : "General feedback");

  return {
    sentiment,
    sentimentScore,
    themes: [themeGuess],
    featureArea: themeGuess,
    rationale: "Rule-based classification (seed data only — not the live AI path).",
    needsReview: false,
  };
}

/* ------------------------------------------------------------------ *
 * AI4 — Voice-of-Customer narrative, now genuinely written by Claude
 * via ai-service. Stats are still pre-computed in report.routes.js
 * first (unchanged) — Claude only ever writes prose around numbers it
 * was handed, never invents one (brief §9.3).
 * ------------------------------------------------------------------ */
const narrativeSchema = z.object({
  narrative: z.string().min(1),
  recommendedActions: z.array(z.string().min(1)),
});

export async function writeReportNarrativeWithAI(stats) {
  const base = process.env.AI_SERVICE_URL || "http://localhost:8000";

  try {
    const response = await fetch(`${base}/report-narrative`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stats }),
    });
    if (!response.ok) throw new Error(`ai-service /report-narrative returned ${response.status}`);
    const body = await response.json();
    return narrativeSchema.parse(body);
  } catch (err) {
    // ai-service down or no ANTHROPIC_API_KEY configured — fall back to a
    // template narrative so report generation doesn't hard-fail, but this
    // is clearly a degraded path, not the real AI4 feature.
    return writeReportNarrativeFallback(stats);
  }
}

function writeReportNarrativeFallback(stats) {
  const top = stats.topThemes[0];
  const trendWord =
    stats.sentimentDelta > 0 ? "worsened" : stats.sentimentDelta < 0 ? "improved" : "held steady";

  const narrative = top
    ? `Over this period the workspace logged ${stats.totalItems} feedback item${stats.totalItems === 1 ? "" : "s"}, ${stats.pctNegative}% negative — sentiment has ${trendWord} versus the prior period. The leading theme was "${top.name}" with ${top.count} mention${top.count === 1 ? "" : "s"}, ahead of ${stats.topThemes.slice(1, 3).map((t) => `"${t.name}"`).join(" and ") || "other themes"}. (Fallback narrative — ai-service was unavailable.)`
    : `No feedback was logged in this period. (Fallback narrative — ai-service was unavailable.)`;

  const recommendedActions = stats.topThemes
    .slice(0, 3)
    .map((t) => `Investigate and address "${t.name}" — it's a top driver of this period's feedback (${t.count} mentions).`);

  return { narrative, recommendedActions };
}