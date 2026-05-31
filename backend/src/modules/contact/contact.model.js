const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "General enquiry",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "in_progress", "resolved"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true }
);

contactSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Contact", contactSchema);
