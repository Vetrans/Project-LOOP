import { Router } from "express";
import mongoose from "mongoose";
import multer from "multer";
import { parse } from "csv-parse/sync";
import { z } from "zod";
import Feedback from "../models/Feedback.js";
import Theme from "../models/Theme.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { asyncHandler, AppError } from "../utils/AppError.js";
import { classifyFeedback } from "../utils/ai.js";
import { embedText } from "../utils/embeddings.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(requireAuth);

const CHANNELS = ["Support ticket", "App store review", "NPS survey", "Sales call note", "Community post"];

/* GET /api/feedback/stats — powers the Analytics Dashboard (C5): total
 * items, % negative, new this week, weekly volume, and sentiment split.
 * Registered before "/:id"-style routes below to avoid route collision. */
router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    const workspaceId = new mongoose.Types.ObjectId(req.user.workspaceId);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const eightWeeksAgo = new Date(now.getTime() - 8 * 7 * 24 * 60 * 60 * 1000);

    const [totalItems, negCount, newThisWeek, sentimentAgg, volumeAgg] = await Promise.all([
      Feedback.countDocuments({ workspaceId }),
      Feedback.countDocuments({ workspaceId, sentiment: "NEG" }),
      Feedback.countDocuments({ workspaceId, createdAt: { $gte: weekAgo } }),
      Feedback.aggregate([{ $match: { workspaceId } }, { $group: { _id: "$sentiment", count: { $sum: 1 } } }]),
      Feedback.aggregate([
        { $match: { workspaceId, createdAt: { $gte: eightWeeksAgo } } },
        { $group: { _id: { $isoWeek: "$createdAt" }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const pctNegative = totalItems ? Math.round((negCount / totalItems) * 100) : 0;
    const sentimentMap = { POS: 0, NEU: 0, NEG: 0 };
    for (const row of sentimentAgg) if (row._id) sentimentMap[row._id] = row.count;

    res.json({
      totalItems,
      pctNegative,
      newThisWeek,
      sentiment: [
        { name: "Positive", value: sentimentMap.POS, color: "#2DD9B9" },
        { name: "Neutral", value: sentimentMap.NEU, color: "#F5B043" },
        { name: "Negative", value: sentimentMap.NEG, color: "#FB7185" },
      ],
      volume: volumeAgg.map((v) => ({ date: `W${v._id}`, volume: v.count })),
    });
  })
);

// Resolves theme name strings to Theme docs within the caller's
// workspace, reusing existing themes instead of creating near-duplicates
// (mirrors the AI1 prompt instruction in utils/ai.js).
async function resolveThemeLinks(workspaceId, themeNames) {
  const links = [];
  for (const name of themeNames) {
    let theme = await Theme.findOne({ workspaceId, name });
    if (!theme) theme = await Theme.create({ workspaceId, name });
    links.push({ themeId: theme._id, confidence: 0.75 });
  }
  return links;
}

async function classifyAndSave(doc, workspaceId) {
  const existingThemes = await Theme.find({ workspaceId }).select("name").lean();
  const result = classifyFeedback(doc.content, existingThemes.map((t) => t.name));

  doc.sentiment = result.sentiment;
  doc.sentimentScore = result.sentimentScore;
  doc.featureArea = result.featureArea;
  doc.classificationRationale = result.rationale;
  doc.themes = await resolveThemeLinks(workspaceId, result.themes);
  doc.embedding = embedText(doc.content);
  await doc.save();
  return doc;
}

/* GET /api/feedback — paginated, searchable, filterable inbox */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { search = "", channel = "", sentiment = "", status = "", theme = "", page = 1, limit = 20 } = req.query;
    const filter = { workspaceId: req.user.workspaceId };
    if (search) filter.$text = { $search: search };
    if (channel) filter.channel = channel;
    if (sentiment) filter.sentiment = sentiment;
    if (status) filter.status = status;
    if (theme) filter["themes.themeId"] = new mongoose.Types.ObjectId(theme);

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, parseInt(limit, 10) || 20);

    const [items, total] = await Promise.all([
      Feedback.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate("themes.themeId", "name color")
        .lean(),
      Feedback.countDocuments(filter),
    ]);

    res.json({ items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
  })
);

const createSchema = z.object({
  content: z.string().min(1, "Feedback content is required."),
  channel: z.enum(CHANNELS),
  customerLabel: z.string().optional().default(""),
});

/* POST /api/feedback — single-entry ingestion, classified on ingest (AI1) */
router.post(
  "/",
  requireRole("ADMIN", "ANALYST"),
  asyncHandler(async (req, res) => {
    const data = createSchema.parse(req.body);
    let doc = await Feedback.create({ ...data, workspaceId: req.user.workspaceId, status: "NEW" });
    doc = await classifyAndSave(doc, req.user.workspaceId);
    res.status(201).json(doc);
  })
);

/* POST /api/feedback/import — CSV bulk upload (brief columns: content, channel, customer_label, created_at) */
router.post(
  "/import",
  requireRole("ADMIN", "ANALYST"),
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new AppError("No CSV file uploaded.", 400);

    const rows = parse(req.file.buffer.toString("utf-8"), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    let imported = 0;
    let failed = 0;
    const errors = [];

    for (const [i, row] of rows.entries()) {
      try {
        const parsedRow = createSchema
          .extend({ channel: z.string() }) // validate loosely, then normalize below
          .parse({
            content: row.content,
            channel: CHANNELS.includes(row.channel) ? row.channel : "Community post",
            customerLabel: row.customer_label || "",
          });

        let doc = await Feedback.create({
          ...parsedRow,
          workspaceId: req.user.workspaceId,
          status: "NEW",
          createdAt: row.created_at ? new Date(row.created_at) : undefined,
        });
        doc = await classifyAndSave(doc, req.user.workspaceId);
        imported += 1;
      } catch (err) {
        failed += 1;
        errors.push({ row: i + 1, message: err.message });
      }
    }

    res.status(201).json({ imported, failed, errors: errors.slice(0, 10) });
  })
);

const statusSchema = z.object({ status: z.enum(["NEW", "REVIEWED", "ACTIONED"]) });

/* PATCH /api/feedback/:id/status */
router.patch(
  "/:id/status",
  requireRole("ADMIN", "ANALYST"),
  asyncHandler(async (req, res) => {
    const { status } = statusSchema.parse(req.body);
    const doc = await Feedback.findOneAndUpdate(
      { _id: req.params.id, workspaceId: req.user.workspaceId },
      { status },
      { new: true }
    );
    if (!doc) throw new AppError("Feedback item not found.", 404);
    res.json(doc);
  })
);

/* POST /api/feedback/:id/reclassify — manual re-classify (AI1 acceptance criteria) */
router.post(
  "/:id/reclassify",
  requireRole("ADMIN", "ANALYST"),
  asyncHandler(async (req, res) => {
    const doc = await Feedback.findOne({ _id: req.params.id, workspaceId: req.user.workspaceId });
    if (!doc) throw new AppError("Feedback item not found.", 404);
    await classifyAndSave(doc, req.user.workspaceId);
    res.json(doc);
  })
);

export default router;
