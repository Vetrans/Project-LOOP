import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    type: { type: String, default: "Voice of Customer" },
    status: { type: String, enum: ["Completed", "Failed"], default: "Completed" },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    contentJson: {
      stats: {
        totalItems: Number,
        pctNegative: Number,
        sentimentDelta: Number,
        topThemes: [
          {
            name: String,
            count: Number,
            trendPct: Number,
          },
        ],
        sampleQuotes: [
          {
            content: String,
            channel: String,
            customerLabel: String,
          },
        ],
      },
      narrative: String,
      recommendedActions: [String],
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Report", reportSchema);