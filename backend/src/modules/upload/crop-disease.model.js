const mongoose = require("mongoose");

const cropDiseaseSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "demoUser",
      index: true,
    },
    cropName: {
      type: String,
      default: "",
      trim: true,
    },
    imageName: {
      type: String,
      required: true,
      trim: true,
    },
    disease: {
      type: String,
      required: true,
      trim: true,
    },
    confidence: {
      type: String,
      default: "Low",
    },
    advice: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["detected", "reviewed", "resolved"],
      default: "detected",
    },
  },
  { timestamps: true }
);

cropDiseaseSchema.index({ disease: 1, createdAt: -1 });

module.exports = mongoose.model("CropDisease", cropDiseaseSchema);
