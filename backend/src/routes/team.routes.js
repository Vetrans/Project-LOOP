import { Router } from "express";
import { z } from "zod";
import TeamMember from "../models/TeamMember.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/roles.js";
import { asyncHandler, AppError } from "../utils/AppError.js";

const router = Router();
router.use(requireAuth);

function formatJoined(date) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatLastActive(date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} mins ago`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

function present(member) {
  return {
    id: member._id,
    name: member.name,
    email: member.email,
    phone: member.phone,
    role: member.role,
    department: member.department,
    status: member.status,
    avatar: member.avatarUrl,
    projects: member.projects,
    performance: member.performance,
    joined: formatJoined(member.createdAt),
    lastActive: formatLastActive(member.lastActiveAt || member.updatedAt),
  };
}

/* GET /api/team/summary — real counts from this workspace's roster.
 * "change" reflects members added in the last 7 days for that bucket —
 * there's no historical snapshot to diff against, so this is the
 * honest figure available, not a guessed percentage. */
router.get(
  "/summary",
  asyncHandler(async (req, res) => {
    const workspaceId = req.user.workspaceId;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [total, engineering, design, management, newTotal] =
      await Promise.all([
        TeamMember.countDocuments({ workspaceId }),
        TeamMember.countDocuments({ workspaceId, department: "Engineering" }),
        TeamMember.countDocuments({ workspaceId, department: "Design" }),
        TeamMember.countDocuments({ workspaceId, department: "Management" }),
        TeamMember.countDocuments({
          workspaceId,
          createdAt: { $gte: weekAgo },
        }),
      ]);

    res.json([
      {
        id: 1,
        title: "Total Members",
        value: total,
        change: `+${newTotal} this week`,
        icon: "users",
      },
      {
        id: 2,
        title: "Developers",
        value: engineering,
        change: "Engineering dept.",
        icon: "code",
      },
      {
        id: 3,
        title: "Designers",
        value: design,
        change: "Design dept.",
        icon: "palette",
      },
      {
        id: 4,
        title: "Managers",
        value: management,
        change: "Management dept.",
        icon: "briefcase",
      },
    ]);
  }),
);

/* GET /api/team — full roster for the caller's workspace */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const members = await TeamMember.find({
      workspaceId: req.user.workspaceId,
    }).sort({ createdAt: -1 });
    res.json(members.map(present));
  }),
);

const memberSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Enter a valid email."),
  phone: z.string().optional().default(""),
  role: z.string().min(1, "Role is required."),
  department: z.string().min(1, "Department is required."),
  status: z.enum(["Active", "Away", "Offline"]).default("Active"),
});

router.post(
  "/",
  requireRole("ADMIN", "ANALYST"),
  asyncHandler(async (req, res) => {
    const data = memberSchema.parse(req.body);

    const existing = await TeamMember.findOne({
      workspaceId: req.user.workspaceId,
      email: data.email.toLowerCase(),
    });
    if (existing)
      throw new AppError("A team member with that email already exists.", 409);

    const member = await TeamMember.create({
      ...data,
      email: data.email.toLowerCase(),
      workspaceId: req.user.workspaceId,
    });

    res.status(201).json(present(member));
  }),
);

router.patch(
  "/:id",
  requireRole("ADMIN", "ANALYST"),
  asyncHandler(async (req, res) => {
    const data = memberSchema.partial().parse(req.body);

    const member = await TeamMember.findOneAndUpdate(
      { _id: req.params.id, workspaceId: req.user.workspaceId },
      { ...data, lastActiveAt: new Date() },
      { new: true },
    );
    if (!member) throw new AppError("Team member not found.", 404);

    res.json(present(member));
  }),
);

router.delete(
  "/:id",
  requireRole("ADMIN"),
  asyncHandler(async (req, res) => {
    const member = await TeamMember.findOneAndDelete({
      _id: req.params.id,
      workspaceId: req.user.workspaceId,
    });
    if (!member) throw new AppError("Team member not found.", 404);

    res.json({ ok: true, id: req.params.id });
  }),
);

export default router;