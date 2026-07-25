// Real third-party integrations (live Zendesk/App Store/Twitter pulls)
// are explicitly out of scope for LOOP (brief §04.2) — this is the
// sanctioned stand-in: realistic canned content per channel that a
// "Simulate Channel" button can drop into the workspace, so the app can
// demo what an incoming integration would feel like.

const NAMES = [
  "Aarav Mehta", "Priya Nair", "Liam Chen", "Sofia Garcia", "Noah Patel",
  "Emma Rodriguez", "Kabir Singh", "Olivia Brown", "Diego Alvarez", "Hana Kim",
  "Marcus Lee", "Ananya Rao", "Ethan Wright", "Zara Ahmed", "Lucas Silva",
];

const CHANNEL_POOLS = {
  "Support ticket": [
    "Onboarding took forever — I couldn't figure out how to invite my team.",
    "Billing page keeps timing out when I try to download an invoice.",
    "Support responded within minutes and fixed my issue instantly, thanks!",
    "I keep getting logged out every few minutes on the dashboard.",
    "The CSV import failed silently with no error message — very confusing.",
    "Can you add bulk actions to the inbox? Doing things one by one is slow.",
    "Password reset email never arrived, had to contact support directly.",
    "Loving how fast the new dashboard loads compared to last month.",
  ],
  "App store review": [
    "The new dashboard is gorgeous and finally fast. Huge improvement.",
    "Crashes every time I try to open the analytics tab on my phone.",
    "Clean design, does exactly what we need. Five stars.",
    "Wish there was a dark mode — everything else about the app is great.",
    "App froze mid-upload and I lost my CSV, please add auto-save.",
    "Great value for the price, our whole team switched over from a competitor.",
    "Notifications are way too frequent, please add a way to mute them.",
    "Smooth experience overall, though search could be a bit faster.",
  ],
  "NPS survey": [
    "It does the job, but the mobile experience needs work.",
    "Solid product. Would like more customization on the reports.",
    "Really happy with the AI insights, they've saved us hours every week.",
    "Neutral — works fine, nothing amazing, nothing broken either.",
    "The learning curve was steep at first but it's fine now.",
    "Would recommend to a colleague, though pricing is a bit steep for our team size.",
    "Support has been helpful whenever we've needed it.",
    "Dashboard is great, but exporting to Excel loses some formatting.",
  ],
  "Sales call note": [
    "Prospect wants SSO before they'll sign — third time this month.",
    "Client asked whether we support custom roles beyond Admin/Analyst/Viewer.",
    "They loved the live demo of Ask LOOP, want a follow-up next week.",
    "Budget holder wants a discount for an annual commitment.",
    "Prospect's main blocker is our lack of a native mobile app.",
    "They specifically want better integration with their existing helpdesk tool.",
    "Very positive call, they're comparing us against two competitors.",
    "Asked about data residency options for their EU-based customers.",
  ],
  "Community post": [
    "Love the new export feature, saved me an hour today.",
    "Anyone else notice sentiment scores swing a lot for short feedback?",
    "Would be great to have a public API for pulling theme data.",
    "The onboarding wizard is so much smoother than it used to be.",
    "Posting this here since support hasn't replied in 2 days — billing bug still open.",
    "Just hit 1,000 feedback items in our workspace, dashboard still feels snappy!",
    "Feature request: let us tag feedback with custom labels, not just themes.",
    "Really appreciate how transparent the AI classification rationale is.",
  ],
};

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randomName() {
  return NAMES[Math.floor(Math.random() * NAMES.length)];
}

/**
 * Returns `count` { content, customerLabel } picks for a channel, to
 * simulate a live integration delivering new feedback. Sampling is
 * without replacement up to the pool size, then wraps around
 * (duplicates allowed) if more items are requested than the pool
 * holds — real channels do occasionally deliver repeat complaints too.
 */
export function simulateFeedbackItems(channel, count = 5) {
  const pool = CHANNEL_POOLS[channel] || CHANNEL_POOLS["Community post"];
  const shuffled = shuffle(pool);
  const picks = [];

  for (let i = 0; i < count; i++) {
    const content = shuffled[i % shuffled.length];
    picks.push({
      content,
      customerLabel: Math.random() < 0.85 ? randomName() : "Anonymous",
    });
  }

  return picks;
}