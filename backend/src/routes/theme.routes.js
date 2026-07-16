import { Router } from "express";
import mongoose from "mongoose";
import Theme from "../models/Theme.js";
import Feedback from "../models/Feedback.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/AppError.js";

const router = Router();
router.use(requireAuth);

/* GET /api/themes — named themes with counts and drill-down-ready ids (AI2) */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const workspaceId = new mongoose.Types.ObjectId(req.user.workspaceId);

    const counts = await Feedback.aggregate([
      { $match: { workspaceId } },
      { $unwind: "$themes" },
      { $group: { _id: "$themes.themeId", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]));

    const themes = await Theme.find({ workspaceId }).lean();
    res.json(
      themes
        .map((t) => ({ ...t, count: countMap.get(t._id.toString()) || 0 }))
        .sort((a, b) => b.count - a.count)
    );
  })
);

/* GET /api/themes/trends — weekly volume per theme + spike vs previous period */
router.get(
  "/trends",
  asyncHandler(async (req, res) => {
    const workspaceId = new mongoose.Types.ObjectId(req.user.workspaceId);
    const weeks = Math.min(12, parseInt(req.query.weeks, 10) || 6);
    const since = new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000);

    const rows = await Feedback.aggregate([
      { $match: { workspaceId, createdAt: { $gte: since } } },
      { $unwind: "$themes" },
      {
        $group: {
          _id: {
            themeId: "$themes.themeId",
            week: { $dateTrunc: { date: "$createdAt", unit: "week" } },
          },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: { from: "themes", localField: "_id.themeId", foreignField: "_id", as: "theme" },
      },
      { $unwind: "$theme" },
      { $sort: { "_id.week": 1 } },
      {
        $project: {
          _id: 0,
          themeName: "$theme.theme.name",
          themeColor: "$theme.color",
          week: "$_id.week",
          count: 1,
        },
      },
    ]).catch(async () => {
      // $dateTrunc requires MongoDB 5+; fall back to a simpler grouping
      // by ISO week string for older server versions.
      return Feedback.aggregate([
        { $match: { workspaceId, createdAt: { $gte: since } } },
        { $unwind: "$themes" },
        {
          $group: {
            _id: {
              themeId: "$themes.themeId",
              week: { $isoWeek: "$createdAt" },
              year: { $isoWeekYear: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $lookup: { from: "themes", localField: "_id.themeId", foreignField: "_id", as: "theme" } },
        { $unwind: "$theme" },
        {
          $project: {
            _id: 0,
            themeName: "$theme.name",
            themeColor: "$theme.color",
            week: { $concat: [{ $toString: "$_id.year" }, "-W", { $toString: "$_id.week" }] },
            count: 1,
          },
        },
      ]);
    });

    // Spike detection: compare this week's count to the previous week's
    // for each theme (simple week-over-week % change).
    const byTheme = new Map();
    for (const row of rows) {
      const key = row.themeName;
      if (!byTheme.has(key)) byTheme.set(key, []);
      byTheme.get(key).push(row.count);
    }
    const spikes = [...byTheme.entries()].map(([name, counts]) => {
      const last = counts[counts.length - 1] || 0;
      const prev = counts[counts.length - 2] || 0;
      const trendPct = prev === 0 ? (last > 0 ? 100 : 0) : Math.round(((last - prev) / prev) * 100);
      return { name, trendPct, latestCount: last };
    });

    res.json({ series: rows, spikes });
  })
);

export default router;
