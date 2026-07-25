import mongoose from "mongoose";

const themeLinkSchema = new mongoose.Schema(
  {
    themeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theme",
      required: true,
    },
    confidence: { type: Number, min: 0, max: 1, default: 0.5 },
  },
  { _id: false },
);

const feedbackSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    content: { type: String, required: true, trim: true },
    channel: {
      type: String,
      enum: [
        "Support ticket",
        "App store review",
        "NPS survey",
        "Sales call note",
        "Community post",
      ],
      required: true,
    },
    sourceRef: { type: String, default: null },
    customerLabel: { type: String, default: "" },

    sentiment: { type: String, enum: ["POS", "NEU", "NEG"], default: null },
    sentimentScore: { type: Number, min: -1, max: 1, default: null },
    featureArea: { type: String, default: null },
    classificationRationale: { type: String, default: null },

    // AI1: set true when Claude classification failed after a retry —
    // surfaced in the inbox so an analyst knows to manually reclassify.
    needsReview: { type: Boolean, default: false },

    themes: { type: [themeLinkSchema], default: [] },

    embedding: { type: [Number], default: undefined, select: false },

    status: {
      type: String,
      enum: ["NEW", "REVIEWED", "ACTIONED"],
      default: "NEW",
      index: true,
    },
  },
  { timestamps: true },
);

feedbackSchema.index({ workspaceId: 1, createdAt: -1 });
feedbackSchema.index({ workspaceId: 1, content: "text" });

export default mongoose.model("Feedback", feedbackSchema);