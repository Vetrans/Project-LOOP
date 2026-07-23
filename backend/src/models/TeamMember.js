import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "" },
    role: { type: String, required: true },
    department: { type: String, required: true },
    status: {
      type: String,
      enum: ["Active", "Away", "Offline"],
      default: "Active",
    },
    avatarUrl: { type: String, default: "" },
    projects: { type: Number, default: 0 },
    performance: { type: Number, default: 100, min: 0, max: 100 },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

teamMemberSchema.index({ workspaceId: 1, email: 1 }, { unique: true });

export default mongoose.model("TeamMember", teamMemberSchema);