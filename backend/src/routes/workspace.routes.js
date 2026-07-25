import { Router } from "express";
import crypto from "crypto";
import { z } from "zod";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { asyncHandler, AppError } from "../utils/AppError.js";

const router = Router();
router.use(requireAuth);

function present(member) {
  return {
    id: member._id,
    name: member.name,
    email: member.email,
    role: member.role,
  };
}

/* GET /api/workspace/members — every real login account in the caller's
 * workspace, with their actual RBAC role. This is deliberately separate
 * from the "Team" directory (job titles, departments) which has nothing
 * to do with authentication or permissions. Admin-only, since roles and
 * emails are sensitive. */
router.get(
  "/members",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const members = await User.find({ workspaceId: req.user.workspaceId })
      .select("name email role")
      .sort({ createdAt: 1 })
      .lean();
    res.json(members.map(present));
  }),
);

const inviteSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(["ADMIN", "ANALYST", "VIEWER"]).default("VIEWER"),
});

// Real-time email delivery is explicitly out of scope for LOOP (brief
// §04.2), so invites are simulated: the account is created immediately
// with a generated throwaway password that's returned once, here, for
// the admin to relay manually.
router.post(
  "/members/invite",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const { email, name, role } = inviteSchema.parse(req.body);

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      throw new AppError("A user with that email already exists.", 409);

    const tempPassword = crypto.randomBytes(6).toString("base64url");
    const user = new User({
      name: name || email.split("@")[0],
      email: email.toLowerCase(),
      role,
      workspaceId: req.user.workspaceId,
      onboardingCompleted: true, // invited members skip onboarding — the workspace already exists
    });
    await user.setPassword(tempPassword);
    await user.save();

    res.status(201).json({ member: present(user), tempPassword });
  }),
);

const roleSchema = z.object({ role: z.enum(["ADMIN", "ANALYST", "VIEWER"]) });

/* PATCH /api/workspace/members/:id — change a member's role. Guards
 * against locking the workspace out of admin access by demoting the
 * last remaining ADMIN. */
router.patch(
  "/members/:id",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const { role } = roleSchema.parse(req.body);

    const target = await User.findOne({
      _id: req.params.id,
      workspaceId: req.user.workspaceId,
    });
    if (!target) throw new AppError("Member not found.", 404);

    if (target.role === "ADMIN" && role !== "ADMIN") {
      const adminCount = await User.countDocuments({
        workspaceId: req.user.workspaceId,
        role: "ADMIN",
      });
      if (adminCount <= 1) {
        throw new AppError(
          "Cannot demote the only remaining admin. Promote someone else first.",
          400,
        );
      }
    }

    target.role = role;
    await target.save();

    res.json(present(target));
  }),
);

/* DELETE /api/workspace/members/:id — remove a member's account
 * entirely. Guards against removing yourself and against removing the
 * last remaining ADMIN, so a workspace can never end up with zero
 * admins or an admin locking themselves out mid-session. */
router.delete(
  "/members/:id",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    if (req.params.id === req.user.id) {
      throw new AppError("You cannot remove your own account.", 400);
    }

    const target = await User.findOne({
      _id: req.params.id,
      workspaceId: req.user.workspaceId,
    });
    if (!target) throw new AppError("Member not found.", 404);

    if (target.role === "ADMIN") {
      const adminCount = await User.countDocuments({
        workspaceId: req.user.workspaceId,
        role: "ADMIN",
      });
      if (adminCount <= 1) {
        throw new AppError("Cannot remove the only remaining admin.", 400);
      }
    }

    await User.deleteOne({ _id: target._id });
    res.json({ ok: true, id: req.params.id });
  }),
);

export default router;