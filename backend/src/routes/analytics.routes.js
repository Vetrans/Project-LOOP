import { Router } from "express";
import mongoose from "mongoose";
import Feedback from "../models/Feedback.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/AppError.js";

const router = Router();
router.use(requireAuth);

const DAY_MS = 24 * 60 * 60 * 1000;

/* Resolves a { start, end, prevStart, prevEnd } window from optional
 * startDate/endDate query params (YYYY-MM-DD). Defaults to the last 30
 * days when neither is given, so the dashboard is never silently
 * scoped to "all time" by omission. prevStart/prevEnd is an
 * equal-length preceding window, used for period-over-period deltas —
 * this replaces the old hardcoded "last 7 days vs previous 7 days". */
function resolveRange(query) {
  const now = new Date();

  let end = query.endDate ? new Date(query.endDate) : new Date(now);
  if (Number.isNaN(end.getTime())) end = new Date(now);
  end.setHours(23, 59, 59, 999);

  let start;
  if (query.startDate) {
    start = new Date(query.startDate);
    if (Number.isNaN(start.getTime())) start = new Date(end.getTime() - 30 * DAY_MS);
  } else {
    start = new Date(end.getTime() - 30 * DAY_MS);
  }
  start.setHours(0, 0, 0, 0);

  const spanMs = Math.max(end.getTime() - start.getTime(), DAY_MS);
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - spanMs);

  return { start, end, prevStart, prevEnd };
}

async function periodCounts(workspaceId, start, end) {
  const items = await Feedback.find({
    workspaceId,
    createdAt: { $gte: start, $lte: end },
  }).lean();
  const positive = items.filter((f) => f.sentiment === "POS").length;
  const negative = items.filter((f) => f.sentiment === "NEG").length;
  return { total: items.length, positive, negative };
}

/* GET /api/analytics/overview?startDate&endDate — real counts + real
 * period-over-period deltas, scoped to the requested range. */
router.get(
  "/overview",
  asyncHandler(async (req, res) => {
    const workspaceId = new mongoose.Types.ObjectId(req.user.workspaceId);
    const { start, end, prevStart, prevEnd } = resolveRange(req.query);

    const [current, previous, avgAgg, totalItems, totalPositive, totalNegative] =
      await Promise.all([
        periodCounts(workspaceId, start, end),
        periodCounts(workspaceId, prevStart, prevEnd),
        Feedback.aggregate([
          {
            $match: {
              workspaceId,
              createdAt: { $gte: start, $lte: end },
              sentimentScore: { $ne: null },
            },
          },
          { $group: { _id: null, avg: { $avg: "$sentimentScore" } } },
        ]),
        Feedback.countDocuments({ workspaceId, createdAt: { $gte: start, $lte: end } }),
        Feedback.countDocuments({
          workspaceId,
          createdAt: { $gte: start, $lte: end },
          sentiment: "POS",
        }),
        Feedback.countDocuments({
          workspaceId,
          createdAt: { $gte: start, $lte: end },
          sentiment: "NEG",
        }),
      ]);

    const pctChange = (curr, prev) =>
      prev === 0 ? (curr > 0 ? 100 : 0) : Math.round(((curr - prev) / prev) * 100);

    // sentimentScore is -1..1; rescaled onto a familiar 1-5 "rating" —
    // this is a real average of real per-item scores, just re-scaled,
    // not an invented number.
    const avgScore = avgAgg[0]?.avg ?? 0;
    const avgRating = (((avgScore + 1) / 2) * 4 + 1).toFixed(1);

    res.json([
      {
        id: 1,
        title: "Total Feedback",
        value: totalItems.toLocaleString(),
        change: `${pctChange(current.total, previous.total)}%`,
        trend: current.total >= previous.total ? "up" : "down",
      },
      {
        id: 2,
        title: "Positive Reviews",
        value: totalPositive.toLocaleString(),
        change: `${pctChange(current.positive, previous.positive)}%`,
        trend: current.positive >= previous.positive ? "up" : "down",
      },
      {
        id: 3,
        title: "Negative Reviews",
        value: totalNegative.toLocaleString(),
        change: `${pctChange(current.negative, previous.negative)}%`,
        trend: current.negative <= previous.negative ? "up" : "down",
      },
      {
        id: 4,
        title: "Average Rating",
        value: avgRating,
        change: "",
        trend: avgScore >= 0 ? "up" : "down",
      },
    ]);
  }),
);

/* GET /api/analytics/trend?startDate&endDate — real daily feedback
 * volume across the requested range. Field names (`month`, `feedback`)
 * are kept identical to before so FeedbackTrendChart.jsx (not touched
 * here) keeps working unchanged — only the underlying scoping and
 * grouping granularity changed, from a fixed "last N months" to the
 * actual selected range, bucketed by day. */
router.get(
  "/trend",
  asyncHandler(async (req, res) => {
    const workspaceId = new mongoose.Types.ObjectId(req.user.workspaceId);
    const { start, end } = resolveRange(req.query);

    const rows = await Feedback.aggregate([
      { $match: { workspaceId, createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(
      rows.map((r) => ({
        month: new Date(r._id).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        feedback: r.count,
      })),
    );
  }),
);

/* GET /api/analytics/sentiment?startDate&endDate */
router.get(
  "/sentiment",
  asyncHandler(async (req, res) => {
    const workspaceId = new mongoose.Types.ObjectId(req.user.workspaceId);
    const { start, end } = resolveRange(req.query);

    const agg = await Feedback.aggregate([
      { $match: { workspaceId, createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: "$sentiment", count: { $sum: 1 } } },
    ]);
    const map = { POS: 0, NEU: 0, NEG: 0 };
    for (const row of agg) if (row._id) map[row._id] = row.count;

    res.json([
      { name: "Positive", value: map.POS },
      { name: "Neutral", value: map.NEU },
      { name: "Negative", value: map.NEG },
    ]);
  }),
);

/* GET /api/analytics/categories?startDate&endDate — real featureArea
 * counts, now scoped to the requested range instead of all-time. */
router.get(
  "/categories",
  asyncHandler(async (req, res) => {
    const workspaceId = new mongoose.Types.ObjectId(req.user.workspaceId);
    const { start, end } = resolveRange(req.query);

    const agg = await Feedback.aggregate([
      {
        $match: {
          workspaceId,
          featureArea: { $ne: null },
          createdAt: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: "$featureArea", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json(agg.map((r) => ({ category: r._id, complaints: r.count })));
  }),
);

/* GET /api/analytics/ratings?startDate&endDate — sentimentScore (-1..1)
 * bucketed onto a 1-5 star scale from real per-item scores, scoped to
 * the requested range. There's no literal star rating in the schema,
 * so this is a documented derivation, not invented numbers. */
router.get(
  "/ratings",
  asyncHandler(async (req, res) => {
    const workspaceId = new mongoose.Types.ObjectId(req.user.workspaceId);
    const { start, end } = resolveRange(req.query);

    const items = await Feedback.find({
      workspaceId,
      sentimentScore: { $ne: null },
      createdAt: { $gte: start, $lte: end },
    })
      .select("sentimentScore")
      .lean();

    const buckets = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const item of items) {
      const star = Math.min(
        5,
        Math.max(1, Math.round(((item.sentimentScore + 1) / 2) * 4 + 1)),
      );
      buckets[star] += 1;
    }

    res.json(
      [5, 4, 3, 2, 1].map((star) => ({
        rating: `${star}★`,
        count: buckets[star],
      })),
    );
  }),
);

/* GET /api/analytics/insights?startDate&endDate — generated from the
 * real aggregates computed above for the requested range, not canned
 * copy. Wording says "this period" / "the prior period" rather than
 * "this week" since the range is now user-selectable. */
router.get(
  "/insights",
  asyncHandler(async (req, res) => {
    const workspaceId = new mongoose.Types.ObjectId(req.user.workspaceId);
    const { start, end, prevStart, prevEnd } = resolveRange(req.query);

    const [current, previous, topCategory] = await Promise.all([
      periodCounts(workspaceId, start, end),
      periodCounts(workspaceId, prevStart, prevEnd),
      Feedback.aggregate([
        {
          $match: {
            workspaceId,
            featureArea: { $ne: null },
            createdAt: { $gte: start, $lte: end },
          },
        },
        { $group: { _id: "$featureArea", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]),
    ]);

    if (current.total === 0 && previous.total === 0) {
      return res.json([
        "No feedback has been logged in this range yet — insights will appear once feedback starts coming in.",
      ]);
    }

    const insights = [];

    const posDelta = previous.positive
      ? Math.round(((current.positive - previous.positive) / previous.positive) * 100)
      : current.positive > 0
        ? 100
        : 0;
    insights.push(
      posDelta >= 0
        ? `Positive feedback is up ${posDelta}% compared to the prior period.`
        : `Positive feedback is down ${Math.abs(posDelta)}% compared to the prior period.`,
    );

    if (topCategory[0]) {
      insights.push(
        `"${topCategory[0]._id}" is the most frequently reported area in this range, with ${topCategory[0].count} mentions.`,
      );
    }

    const negDelta = previous.negative
      ? Math.round(((current.negative - previous.negative) / previous.negative) * 100)
      : current.negative > 0
        ? 100
        : 0;
    insights.push(
      negDelta <= 0
        ? `Negative feedback has decreased ${Math.abs(negDelta)}% versus the prior period.`
        : `Negative feedback has increased ${negDelta}% versus the prior period — worth a closer look.`,
    );

    res.json(insights);
  }),
);

export default router;