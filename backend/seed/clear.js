import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import Workspace from "../src/models/Workspace.js";
import User from "../src/models/User.js";
import Theme from "../src/models/Theme.js";
import Feedback from "../src/models/Feedback.js";
import Report from "../src/models/Report.js";

async function run() {
  await connectDB();
  console.log("[clear] deleting all data…");
  await Promise.all([
    Feedback.deleteMany({}),
    Theme.deleteMany({}),
    Report.deleteMany({}),
    User.deleteMany({}),
    Workspace.deleteMany({}),
  ]);
  console.log("[clear] done — database is now empty.");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("[clear] failed:", err);
  process.exit(1);
});