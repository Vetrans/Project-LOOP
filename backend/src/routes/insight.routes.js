import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler, AppError } from "../utils/AppError.js";

const router = Router();
router.use(requireAuth);

const askSchema = z.object({
  question: z.string().min(3, "Ask a fuller question."),
});

// Ask LOOP (AI3) is the ONE place this app calls the Anthropic API, and it
// happens in the Python ai-service, not here. This route's only job is to
// resolve the caller's workspaceId from their verified session (never from
// the request body) and forward it — the tenant boundary is enforced here,
// in Node, before the question ever leaves this process.
router.post(
  "/ask",
  asyncHandler(async (req, res) => {
    const { question } = askSchema.parse(req.body);
    const base = process.env.AI_SERVICE_URL || "http://localhost:8000";

    let upstream;
    try {
      upstream = await fetch(`${base}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspace_id: req.user.workspaceId, question }),
      });
    } catch (err) {
      throw new AppError(
        `Couldn't reach the AI service at ${base}. Is ai-service running (see ai-service/README section)?`,
        503,
      );
    }

    const body = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      throw new AppError(
        body.detail || "The AI service returned an error.",
        upstream.status,
      );
    }
    res.json(body);
  }),
);

export default router;
