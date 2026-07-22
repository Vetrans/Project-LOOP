import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./src/config/db.js";
import {
  notFoundHandler,
  errorHandler,
} from "./src/middleware/errorHandler.js";

import authRoutes from "./src/routes/auth.routes.js";
import feedbackRoutes from "./src/routes/feedback.routes.js";
import themeRoutes from "./src/routes/theme.routes.js";
import insightRoutes from "./src/routes/insight.routes.js";
import reportRoutes from "./src/routes/report.routes.js";
import workspaceRoutes from "./src/routes/workspace.routes.js";
import settingsRoutes from "./src/routes/settings.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

// Increased because onboarding sends avatar images as base64 data
app.use(express.json({ limit: "10mb" }));

app.use(morgan("dev"));

app.get("/api/health", (req, res) =>
  res.json({ ok: true, service: "loop-backend" }),
);

app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/themes", themeRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/settings", settingsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`[server] LOOP API listening on http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.error("[server] failed to start:", err.message);
    process.exit(1);
  });