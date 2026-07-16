// Local, dependency-free classification and report-narrative helpers.
//
// Per the architecture split: the Anthropic API is called from ONE place
// only — the Python ai-service, for Ask LOOP grounded Q&A (see
// ../routes/insight.routes.js, which proxies there). Classification (AI1)
// and report narration (AI4) run entirely as deterministic local logic
// here, so ingestion and reporting never depend on an external AI call.

/* ------------------------------------------------------------------ *
 * AI1 — Auto-classification (heuristic, local, no external call)
 * ------------------------------------------------------------------ */
const NEG_WORDS = [
  "broken",
  "slow",
  "timeout",
  "confusing",
  "hate",
  "terrible",
  "bug",
  "fail",
  "never",
  "forever",
  "worst",
  "frustrat",
  "crash",
  "missing",
  "waiting",
  "blocking",
];
const POS_WORDS = [
  "love",
  "great",
  "gorgeous",
  "fast",
  "amazing",
  "excellent",
  "saved",
  "huge improvement",
  "thank",
  "helpful",
  "smooth",
];

export function classifyFeedback(content, existingThemeNames = []) {
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
    existingThemeNames.find((t) =>
      lower.includes(t.split(" ")[0].toLowerCase()),
    ) ||
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
    rationale: "Rule-based classification (keyword sentiment + theme match).",
  };
}

/* ------------------------------------------------------------------ *
 * AI4 — Voice-of-Customer report narrative (heuristic, local).
 * Stats are always pre-computed in report.routes.js from real data —
 * this only turns them into readable sentences, it never invents a
 * number that wasn't passed in.
 * ------------------------------------------------------------------ */
export function writeReportNarrative(stats) {
  const top = stats.topThemes[0];
  const trendWord =
    stats.sentimentDelta > 0
      ? "worsened"
      : stats.sentimentDelta < 0
        ? "improved"
        : "held steady";

  const narrative = top
    ? `Over this period the workspace logged ${stats.totalItems} feedback item${stats.totalItems === 1 ? "" : "s"}, ${
        stats.pctNegative
      }% negative — sentiment has ${trendWord} versus the prior period. The leading theme was "${top.name}" with ${
        top.count
      } mention${top.count === 1 ? "" : "s"}, ahead of ${
        stats.topThemes
          .slice(1, 3)
          .map((t) => `"${t.name}"`)
          .join(" and ") || "other themes"
      }.`
    : `No feedback was logged in this period.`;

  const recommendedActions = stats.topThemes
    .slice(0, 3)
    .map(
      (t) =>
        `Investigate and address "${t.name}" — it's a top driver of this period's feedback (${t.count} mentions).`,
    );

  return { narrative, recommendedActions };
}
