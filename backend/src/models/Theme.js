import mongoose from "mongoose";

const themeSchema = new mongoose.Schema(
  {
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    color: { type: String, default: "#7C6FF0" },
  },
  { timestamps: true }
);

themeSchema.index({ workspaceId: 1, name: 1 }, { unique: true });

export default mongoose.model("Theme", themeSchema);
