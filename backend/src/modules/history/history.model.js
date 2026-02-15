const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["advisory", "chatbot", "voice"],
      required: true
    },

    input: {
      type: String,
      required: true
    },

    output: {
      type: String,
      required: true
    },

    meta: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("History", historySchema);
