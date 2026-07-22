import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";
import Workspace from "../models/Workspace.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler, AppError } from "../utils/AppError.js";

const router = Router();

function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const signupSchema = z.object({
  name: z.string().min(1, "Name is required."),
  workspace: z.string().min(1, "Workspace name is required."),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

// Sign-up creates a Workspace and a User (ADMIN) but does NOT mark
// onboarding complete — the frontend routes them to /onboarding next,
// and ProtectedRoute enforces that they can't reach the dashboard
// until PATCH /auth/onboarding below has run.
router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { name, workspace, email, password } = signupSchema.parse(req.body);

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      throw new AppError("An account with that email already exists.", 409);

    let slug = slugify(workspace);
    if (await Workspace.findOne({ slug }))
      slug = `${slug}-${Date.now().toString(36)}`;

    const ws = await Workspace.create({ name: workspace, slug });

    const user = new User({
      name,
      email: email.toLowerCase(),
      role: "ADMIN",
      workspaceId: ws._id,
    });
    await user.setPassword(password);
    await user.save();

    const token = signToken(user);
    res.status(201).json({
      token,
      user: {
        ...user.toSafeJSON(),
        workspace: { id: ws._id, name: ws.name },
      },
    });
  }),
);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.checkPassword(password))) {
      throw new AppError("Invalid email or password.", 401);
    }

    const ws = await Workspace.findById(user.workspaceId);
    const token = signToken(user);
    res.json({
      token,
      user: { ...user.toSafeJSON(), workspace: { id: ws._id, name: ws.name } },
    });
  }),
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    const ws = await Workspace.findById(req.user.workspaceId);
    res.json({
      ...user.toSafeJSON(),
      workspace: { id: ws._id, name: ws.name },
    });
  }),
);

const onboardingSchema = z.object({
  profile: z.object({
    name: z.string().min(1, "Name is required."),
    phone: z.string().optional().default(""),
    designation: z.string().optional().default(""),
    department: z.string().optional().default(""),
    avatarUrl: z.string().optional().default(""),
  }),
  organization: z.object({
    company: z.string().min(1, "Organization name is required."),
    timezone: z.string().optional().default("Asia/Kolkata"),
    currency: z.string().optional().default("INR"),
    dateFormat: z.string().optional().default("DD/MM/YYYY"),
    language: z.string().optional().default("English"),
    fiscalYear: z.string().optional().default("January - December"),
  }),
});

/* PATCH /api/auth/onboarding — completes the mandatory post-signup
 * onboarding flow. Saves profile + organization details and flips
 * onboardingCompleted so ProtectedRoute stops redirecting this user
 * here on every dashboard visit. */
router.patch(
  "/onboarding",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { profile, organization } = onboardingSchema.parse(req.body);

    const user = await User.findById(req.user.id);
    if (!user) throw new AppError("User not found.", 404);

    user.name = profile.name;
    user.phone = profile.phone;
    user.designation = profile.designation;
    user.department = profile.department;
    user.avatarUrl = profile.avatarUrl;
    user.onboardingCompleted = true;
    await user.save();

    const ws = await Workspace.findByIdAndUpdate(
      req.user.workspaceId,
      {
        name: organization.company,
        timezone: organization.timezone,
        currency: organization.currency,
        dateFormat: organization.dateFormat,
        language: organization.language,
        fiscalYear: organization.fiscalYear,
      },
      { new: true },
    );

    res.json({
      ...user.toSafeJSON(),
      workspace: { id: ws._id, name: ws.name },
    });
  }),
);

router.post("/logout", (req, res) => res.json({ ok: true }));

export default router;