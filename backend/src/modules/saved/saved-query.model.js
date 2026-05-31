const mongoose = require("mongoose");

const savedQuerySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    feature: {
      type: String,
      enum: ["advisory", "chatbot", "voice", "image"],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    query: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

savedQuerySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("SavedQuery", savedQuerySchema);
