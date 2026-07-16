import { AppError } from "../utils/AppError.js";

export function notFoundHandler(req, res) {
  res
    .status(404)
    .json({ message: `No route for ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err.name === "ZodError") {
    return res.status(422).json({
      message: "Validation failed.",
      issues: err.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    });
  }

  if (err.name === "ValidationError") {
    // Mongoose validation error
    return res.status(422).json({ message: err.message });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "That record already exists." });
  }

  console.error(err);
  res.status(500).json({ message: "Something went wrong on our end." });
}
