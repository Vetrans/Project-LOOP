import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["ADMIN", "ANALYST", "VIEWER"],
      default: "VIEWER",
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },

    phone: { type: String, default: "" },
    designation: { type: String, default: "" },
    department: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },

    onboardingCompleted: { type: Boolean, default: false },

    security: {
      twoFactor: { type: Boolean, default: false },
      loginAlerts: { type: Boolean, default: true },
    },

    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      weeklyReport: { type: Boolean, default: true },
      aiAlerts: { type: Boolean, default: true },
      securityAlerts: { type: Boolean, default: true },
    },

    ai: {
      model: { type: String, default: "Claude 4" },
      responseStyle: { type: String, default: "Professional" },
      language: { type: String, default: "English" },
      autoSummary: { type: Boolean, default: true },
      smartSuggestions: { type: Boolean, default: true },
      sentimentAnalysis: { type: Boolean, default: true },
      autoCategorization: { type: Boolean, default: true },
    },

    appearance: {
      theme: { type: String, default: "Dark" },
      accent: { type: String, default: "#32E6A4" },
      compactMode: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

userSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 10);
};

userSchema.methods.checkPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.methods.toSafeJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    workspaceId: this.workspaceId,
    phone: this.phone,
    designation: this.designation,
    department: this.department,
    avatarUrl: this.avatarUrl,
    onboardingCompleted: this.onboardingCompleted,
  };
};

export default mongoose.model("User", userSchema);