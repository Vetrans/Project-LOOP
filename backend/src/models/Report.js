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
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    // Pre-computed real stats + the AI-written narrative around them —
    // never the other way around (see brief §9.3: numbers are computed in
    // code first, Claude only writes the prose, so figures can't drift).
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
