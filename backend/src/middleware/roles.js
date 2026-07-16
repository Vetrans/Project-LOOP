import { AppError } from "../utils/AppError.js";

// requireRole("ADMIN", "ANALYST") — a forbidden action always returns a
// clean 403, never a crash or silent no-op, per the brief's RBAC
// acceptance criteria.
export function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.user) return next(new AppError("Not authenticated.", 401));
    if (!allowed.includes(req.user.role)) {
      return next(new AppError(`This action requires one of these roles: ${allowed.join(", ")}.`, 403));
    }
    next();
  };
}
