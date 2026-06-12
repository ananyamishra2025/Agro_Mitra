const mongoose = require("mongoose");

const learningResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["article", "document", "video", "guide", "journal", "repository"],
      default: "article",
    },
    category: {
      type: String,
      default: "General",
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    publisher: {
      type: String,
      default: "",
      trim: true,
    },
    year: {
      type: Number,
    },
    format: {
      type: String,
      default: "",
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

learningResourceSchema.index({ title: "text", description: "text", tags: "text" });

module.exports = mongoose.model("LearningResource", learningResourceSchema);
