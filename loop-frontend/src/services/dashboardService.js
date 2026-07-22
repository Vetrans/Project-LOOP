import api from "./api";

const sentimentLabel = { POS: "Positive", NEU: "Neutral", NEG: "Negative" };
const statusLabel = { NEW: "Pending", REVIEWED: "In Review", ACTIONED: "Resolved" };

async function stats() { return (await api.get("/feedback/stats")).data; }

export async function getDashboardStats() {
  const data = await stats();
  const positive = data.sentiment.find((item) => item.name === "Positive")?.value || 0;
  return [
    { title: "Total Feedback", value: data.totalItems.toLocaleString(), change: `${data.newThisWeek} new this week` },
    { title: "Negative feedback", value: `${data.pctNegative}%`, change: "of all feedback" },
    { title: "Positive feedback", value: `${data.totalItems ? Math.round((positive / data.totalItems) * 100) : 0}%`, change: "AI classified" },
  ];
}

export async function getFeedbackTrend() {
  return (await stats()).volume.map(({ date, volume }) => ({ name: date, feedback: volume }));
}

export async function getSentimentData() { return (await stats()).sentiment; }

export async function getTopThemes() {
  const { data } = await api.get("/themes");
  return data.slice(0, 5).map((theme) => ({ title: theme.name, count: theme.count, change: "Current volume" }));
}

export async function getRecentFeedback() {
  const { data } = await api.get("/feedback", { params: { limit: 5 } });
  return data.items.map((item) => ({
    id: item._id,
    customer: item.customerLabel || "Anonymous",
    message: item.content,
    sentiment: sentimentLabel[item.sentiment] || item.sentiment,
    category: item.featureArea || "General",
    status: statusLabel[item.status] || item.status,
  }));
}
