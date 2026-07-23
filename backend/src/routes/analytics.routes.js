import { Router } from "express";
import mongoose from "mongoose";
import Feedback from "../models/Feedback.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/AppError.js";

const router = Router();
router.use(requireAuth);

async function periodCounts(workspaceId, start, end) {
  const items = await Feedback.find({
    workspaceId,
    createdAt: { $gte: start, $lte: end },
  }).lean();
  const positive = items.filter((f) => f.sentiment === "POS").length;
  const negative = items.filter((f) => f.sentiment === "NEG").length;
  return { total: items.length, positive, negative };
}

/* GET /api/analytics/overview — real counts + real week-over-week
 * deltas, not hardcoded percentages. */
router.get(
  "/overview",
  asyncHandler(async (req, res) => {
    const workspaceId = new mongoose.Types.ObjectId(req.user.workspaceId);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [current, previous, avgAgg, totalItems, totalPositive, totalNegative] =
      await Promise.all([
        periodCounts(workspaceId, weekAgo, now),
        periodCounts(workspaceId, twoWeeksAgo, weekAgo),
        Feedback.aggregate([
          { $match: { workspaceId, sentimentScore: { $ne: null } } },
          { $group: { _id: null, avg: { $avg: "$sentimentScore" } } },
        ]),
        Feedback.countDocuments({ workspaceId }),
        Feedback.countDocuments({ workspaceId, sentiment: "POS" }),
        Feedback.countDocuments({ workspaceId, sentiment: "NEG" }),
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

/* GET /api/analytics/trend?months=7 — real monthly feedback volume */
router.get(
  "/trend",
  asyncHandler(async (req, res) => {
    const workspaceId = new mongoose.Types.ObjectId(req.user.workspaceId);
    const months = Math.min(12, parseInt(req.query.months, 10) || 7);
    const since = new Date();
    since.setMonth(since.getMonth() - months);

    const rows = await Feedback.aggregate([
      { $match: { workspaceId, createdAt: { $gte: since } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    res.json(
      rows.map((r) => ({
        month: monthNames[r._id.month - 1],
        feedback: r.count,
      })),
    );
  }),
);

/* GET /api/analytics/sentiment */
router.get(
  "/sentiment",
  asyncHandler(async (req, res) => {
    const workspaceId = new mongoose.Types.ObjectId(req.user.workspaceId);
    const agg = await Feedback.aggregate([
      { $match: { workspaceId } },
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

/* GET /api/analytics/categories — real featureArea counts */
router.get(
  "/categories",
  asyncHandler(async (req, res) => {
    const workspaceId = new mongoose.Types.ObjectId(req.user.workspaceId);
    const agg = await Feedback.aggregate([
      { $match: { workspaceId, featureArea: { $ne: null } } },
      { $group: { _id: "$featureArea", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json(agg.map((r) => ({ category: r._id, complaints: r.count })));
  }),
);

/* GET /api/analytics/ratings — sentimentScore (-1..1) bucketed onto a
 * 1-5 star scale from real per-item scores. There's no literal star
 * rating in the schema, so this is a documented derivation, not
 * invented numbers. */
router.get(
  "/ratings",
  asyncHandler(async (req, res) => {
    const workspaceId = new mongoose.Types.ObjectId(req.user.workspaceId);
    const items = await Feedback.find({
      workspaceId,
      sentimentScore: { $ne: null },
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

/* GET /api/analytics/insights — generated from the real aggregates
 * computed above, not canned copy. */
router.get(
  "/insights",
  asyncHandler(async (req, res) => {
    const workspaceId = new mongoose.Types.ObjectId(req.user.workspaceId);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [current, previous, topCategory] = await Promise.all([
      periodCounts(workspaceId, weekAgo, now),
      periodCounts(workspaceId, twoWeeksAgo, weekAgo),
      Feedback.aggregate([
        { $match: { workspaceId, featureArea: { $ne: null } } },
        { $group: { _id: "$featureArea", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]),
    ]);

    if (current.total === 0 && previous.total === 0) {
      return res.json([
        "No feedback has been logged yet — insights will appear here once feedback starts coming in.",
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
        ? `Positive feedback is up ${posDelta}% compared to the previous week.`
        : `Positive feedback is down ${Math.abs(posDelta)}% compared to the previous week.`,
    );

    if (topCategory[0]) {
      insights.push(
        `"${topCategory[0]._id}" is the most frequently reported area, with ${topCategory[0].count} mentions.`,
      );
    }

    const negDelta = previous.negative
      ? Math.round(((current.negative - previous.negative) / previous.negative) * 100)
      : current.negative > 0
        ? 100
        : 0;
    insights.push(
      negDelta <= 0
        ? `Negative feedback has decreased ${Math.abs(negDelta)}% week-over-week.`
        : `Negative feedback has increased ${negDelta}% week-over-week — worth a closer look.`,
    );

    res.json(insights);
  }),
);

export default router;