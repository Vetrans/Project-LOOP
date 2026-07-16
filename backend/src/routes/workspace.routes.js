import { Router } from "express";
import crypto from "crypto";
import { z } from "zod";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { asyncHandler, AppError } from "../utils/AppError.js";

const router = Router();
router.use(requireAuth);

router.get(
  "/members",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const members = await User.find({ workspaceId: req.user.workspaceId }).select("name email role").lean();
    res.json(members);
  })
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
    if (existing) throw new AppError("A user with that email already exists.", 409);

    const tempPassword = crypto.randomBytes(6).toString("base64url");
    const user = new User({
      name: name || email.split("@")[0],
      email: email.toLowerCase(),
      role,
      workspaceId: req.user.workspaceId,
    });
    await user.setPassword(tempPassword);
    await user.save();

    res.status(201).json({ member: user.toSafeJSON(), tempPassword });
  })
);

const roleSchema = z.object({ role: z.enum(["ADMIN", "ANALYST", "VIEWER"]) });

router.patch(
  "/members/:id",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const { role } = roleSchema.parse(req.body);
    const member = await User.findOneAndUpdate(
      { _id: req.params.id, workspaceId: req.user.workspaceId },
      { role },
      { new: true }
    ).select("name email role");
    if (!member) throw new AppError("Member not found.", 404);
    res.json(member);
  })
);

export default router;
