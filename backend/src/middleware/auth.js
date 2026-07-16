import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/AppError.js";

// Every protected route runs this first. It resolves the caller's
// workspaceId from their verified session — never from a request body,
// query string, or URL param — so a user can never impersonate a
// different tenant just by changing an ID. Every downstream query MUST
// filter by req.user.workspaceId.
export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) throw new AppError("Not authenticated.", 401);

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError("Your session has expired. Please sign in again.", 401);
  }

  const user = await User.findById(payload.sub);
  if (!user) throw new AppError("Not authenticated.", 401);

  req.user = {
    id: user._id.toString(),
    role: user.role,
    workspaceId: user.workspaceId.toString(),
  };
  next();
});
