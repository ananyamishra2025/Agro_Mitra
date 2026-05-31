const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      sparse: true,
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
      sparse: true,
      trim: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      default: null,
      select: false,
    },
    provider: {
      type: String,
      enum: ["email", "google", "demo"],
      default: "email",
    },
    role: {
      type: String,
      enum: ["farmer", "student", "admin"],
      default: "farmer",
    },
    status: {
      type: String,
      enum: ["active", "blocked", "pending"],
      default: "active",
    },
    profile: {
      location: { type: String, default: "" },
      farmType: { type: String, default: "" },
      preferredLanguage: { type: String, default: "English" },
      avatarUrl: { type: String, default: "" },
      interests: { type: [String], default: [] },
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });
userSchema.index({ role: 1, status: 1 });

module.exports = mongoose.model("User", userSchema);
