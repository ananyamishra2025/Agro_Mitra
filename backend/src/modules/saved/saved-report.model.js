const mongoose = require("mongoose");

const savedReportSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    reportType: {
      type: String,
      enum: ["crop_advisory", "disease_detection", "learning_progress", "weather"],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      default: "",
      trim: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "saved", "archived"],
      default: "saved",
    },
  },
  { timestamps: true }
);

savedReportSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("SavedReport", savedReportSchema);
