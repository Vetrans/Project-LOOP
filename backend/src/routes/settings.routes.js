import { Router } from "express";
import { z } from "zod";
import User from "../models/User.js";
import Workspace from "../models/Workspace.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler, AppError } from "../utils/AppError.js";

const router = Router();
router.use(requireAuth);

function shapeSettings(user, workspace) {
  return {
    profile: {
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      designation: user.designation || "",
      department: user.department || "",
      avatarUrl: user.avatarUrl || "",
    },
    security: {
      twoFactor: user.security?.twoFactor ?? false,
      loginAlerts: user.security?.loginAlerts ?? true,
    },
    notifications: {
      email: user.notifications?.email ?? true,
      push: user.notifications?.push ?? true,
      weeklyReport: user.notifications?.weeklyReport ?? true,
      aiAlerts: user.notifications?.aiAlerts ?? true,
      securityAlerts: user.notifications?.securityAlerts ?? true,
    },
    ai: {
      model: user.ai?.model || "Claude 4",
      responseStyle: user.ai?.responseStyle || "Professional",
      language: user.ai?.language || "English",
      autoSummary: user.ai?.autoSummary ?? true,
      smartSuggestions: user.ai?.smartSuggestions ?? true,
      sentimentAnalysis: user.ai?.sentimentAnalysis ?? true,
      autoCategorization: user.ai?.autoCategorization ?? true,
    },
    appearance: {
      theme: user.appearance?.theme || "Dark",
      accent: user.appearance?.accent || "#32E6A4",
      compactMode: user.appearance?.compactMode ?? false,
    },
    organization: {
      company: workspace?.name || "",
      timezone: workspace?.timezone || "Asia/Kolkata",
      currency: workspace?.currency || "INR",
      dateFormat: workspace?.dateFormat || "DD/MM/YYYY",
      language: workspace?.language || "English",
      fiscalYear: workspace?.fiscalYear || "January - December",
    },
  };
}

/* GET /api/settings — single source of truth for the Settings page and
 * the onboarding flow. No localStorage anywhere; this always reflects
 * exactly what's in Mongo. */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    const workspace = await Workspace.findById(req.user.workspaceId);
    if (!user) throw new AppError("User not found.", 404);
    res.json(shapeSettings(user, workspace));
  }),
);

const settingsSchema = z.object({
  profile: z.object({
    name: z.string().min(1),
    phone: z.string().optional().default(""),
    designation: z.string().optional().default(""),
    department: z.string().optional().default(""),
    avatarUrl: z.string().optional().default(""),
  }),
  security: z.object({
    twoFactor: z.boolean().optional(),
    loginAlerts: z.boolean().optional(),
  }),
  notifications: z.object({
    email: z.boolean().optional(),
    push: z.boolean().optional(),
    weeklyReport: z.boolean().optional(),
    aiAlerts: z.boolean().optional(),
    securityAlerts: z.boolean().optional(),
  }),
  ai: z.object({
    model: z.string().optional(),
    responseStyle: z.string().optional(),
    language: z.string().optional(),
    autoSummary: z.boolean().optional(),
    smartSuggestions: z.boolean().optional(),
    sentimentAnalysis: z.boolean().optional(),
    autoCategorization: z.boolean().optional(),
  }),
  appearance: z.object({
    theme: z.string().optional(),
    accent: z.string().optional(),
    compactMode: z.boolean().optional(),
  }),
  organization: z.object({
    company: z.string().min(1),
    timezone: z.string().optional(),
    currency: z.string().optional(),
    dateFormat: z.string().optional(),
    language: z.string().optional(),
    fiscalYear: z.string().optional(),
  }),
});

router.put(
  "/",
  asyncHandler(async (req, res) => {
    const body = settingsSchema.parse(req.body);

    const user = await User.findById(req.user.id);
    if (!user) throw new AppError("User not found.", 404);

    user.name = body.profile.name;
    user.phone = body.profile.phone;
    user.designation = body.profile.designation;
    user.department = body.profile.department;
    user.avatarUrl = body.profile.avatarUrl;
    user.security = { ...user.security, ...body.security };
    user.notifications = { ...user.notifications, ...body.notifications };
    user.ai = { ...user.ai, ...body.ai };
    user.appearance = { ...user.appearance, ...body.appearance };
    await user.save();

    const workspace = await Workspace.findByIdAndUpdate(
      req.user.workspaceId,
      {
        name: body.organization.company,
        timezone: body.organization.timezone,
        currency: body.organization.currency,
        dateFormat: body.organization.dateFormat,
        language: body.organization.language,
        fiscalYear: body.organization.fiscalYear,
      },
      { new: true },
    );

    res.json(shapeSettings(user, workspace));
  }),
);

router.post(
  "/reset",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) throw new AppError("User not found.", 404);

    user.security = { twoFactor: false, loginAlerts: true };
    user.notifications = {
      email: true,
      push: true,
      weeklyReport: true,
      aiAlerts: true,
      securityAlerts: true,
    };
    user.ai = {
      model: "Claude 4",
      responseStyle: "Professional",
      language: "English",
      autoSummary: true,
      smartSuggestions: true,
      sentimentAnalysis: true,
      autoCategorization: true,
    };
    user.appearance = { theme: "Dark", accent: "#32E6A4", compactMode: false };
    await user.save();

    const workspace = await Workspace.findByIdAndUpdate(
      req.user.workspaceId,
      {
        timezone: "Asia/Kolkata",
        currency: "INR",
        dateFormat: "DD/MM/YYYY",
        language: "English",
        fiscalYear: "January - December",
      },
      { new: true },
    );

    res.json(shapeSettings(user, workspace));
  }),
);

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

router.post(
  "/change-password",
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = passwordSchema.parse(req.body);

    const user = await User.findById(req.user.id);
    if (!user) throw new AppError("User not found.", 404);

    const valid = await user.checkPassword(currentPassword);
    if (!valid) throw new AppError("Current password is incorrect.", 401);

    await user.setPassword(newPassword);
    await user.save();

    res.json({ ok: true });
  }),
);

export default router;