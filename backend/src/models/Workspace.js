import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    timezone: { type: String, default: "Asia/Kolkata" },
    currency: { type: String, default: "INR" },
    dateFormat: { type: String, default: "DD/MM/YYYY" },
    language: { type: String, default: "English" },
    fiscalYear: { type: String, default: "January - December" },
  },
  { timestamps: true },
);

export default mongoose.model("Workspace", workspaceSchema);