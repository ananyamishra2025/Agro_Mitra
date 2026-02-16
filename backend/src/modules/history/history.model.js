const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: ["chatbot", "advisory", "voice", "demo", "image"], // ✅ added demo
      required: true
    },

    input: {
      type: String,
      required: true
    },

    output: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("History", historySchema);
