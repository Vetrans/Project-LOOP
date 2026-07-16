import { Router } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import Feedback from "../models/Feedback.js";
import Theme from "../models/Theme.js";
import Report from "../models/Report.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { asyncHandler, AppError } from "../utils/AppError.js";
import { writeReportNarrative } from "../utils/ai.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const reports = await Report.find({ workspaceId: req.user.workspaceId }).sort({ createdAt: -1 }).lean();
    res.json(reports);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const report = await Report.findOne({ _id: req.params.id, workspaceId: req.user.workspaceId });
    if (!report) throw new AppError("Report not found.", 404);
    res.json(report);
  })
);

const generateSchema = z.object({
  days: z.number().int().min(1).max(90).optional().default(7),
});

/* POST /api/reports/generate — AI4: pre-compute real stats in code
 * first, then ask Claude to write only the narrative around them. */
router.post(
  "/generate",
  requireRole("ADMIN", "ANALYST"),
  asyncHandler(async (req, res) => {
    const { days } = generateSchema.parse(req.body ?? {});
    const workspaceId = new mongoose.Types.ObjectId(req.user.workspaceId);

    const periodEnd = new Date();
    const periodStart = new Date(periodEnd.getTime() - days * 24 * 60 * 60 * 1000);
    const prevStart = new Date(periodStart.getTime() - days * 24 * 60 * 60 * 1000);

    const [current, previous] = await Promise.all([
      Feedback.find({ workspaceId, createdAt: { $gte: periodStart, $lte: periodEnd } })
        .populate("themes.themeId", "name")
        .lean(),
      Feedback.find({ workspaceId, createdAt: { $gte: prevStart, $lt: periodStart } }).lean(),
    ]);

    const totalItems = current.length;
    const negCount = current.filter((f) => f.sentiment === "NEG").length;
    const pctNegative = totalItems ? Math.round((negCount / totalItems) * 100) : 0;

    const prevNeg = previous.filter((f) => f.sentiment === "NEG").length;
    const prevPct = previous.length ? Math.round((prevNeg / previous.length) * 100) : 0;
    const sentimentDelta = pctNegative - prevPct;

    const themeCounts = new Map();
    for (const item of current) {
      for (const link of item.themes || []) {
        const name = link.themeId?.name;
        if (!name) continue;
        themeCounts.set(name, (themeCounts.get(name) || 0) + 1);
      }
    }
    const topThemes = [...themeCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count, trendPct: 0 }));

    const sampleQuotes = current
      .filter((f) => f.sentiment === "NEG" || f.sentiment === "POS")
      .slice(0, 5)
      .map((f) => ({ content: f.content, channel: f.channel, customerLabel: f.customerLabel }));

    const stats = { totalItems, pctNegative, sentimentDelta, topThemes, sampleQuotes };
    const { narrative, recommendedActions } = writeReportNarrative(stats);

    const report = await Report.create({
      workspaceId: req.user.workspaceId,
      title: `Voice of Customer — ${periodStart.toLocaleDateString()} to ${periodEnd.toLocaleDateString()}`,
      periodStart,
      periodEnd,
      contentJson: { stats, narrative, recommendedActions },
      generatedBy: req.user.id,
    });

    res.status(201).json(report);
  })
);

export default router;
