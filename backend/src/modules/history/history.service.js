const mongoose = require("mongoose");
const History = require("./history.model");

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

// 🔥 Save history (with optional meta support)
const saveHistory = async ({ userId, type, input, output, meta = {} }) => {
  if (!isDatabaseConnected()) {
    console.warn("History save skipped: MongoDB is not connected");
    return null;
  }

  try {
    const entry = await History.create({
      userId,
      type,
      input,
      output,
      meta
    });

    return entry;
  } catch (error) {
    console.error("History save error:", error.message);
    throw error;
  }
};

// 🔥 Get history (latest first)
const getUserHistory = async (userId) => {
  if (!isDatabaseConnected()) {
    console.warn("History fetch skipped: MongoDB is not connected");
    return [];
  }

  try {
    return await History
      .find({ userId })
      .sort({ createdAt: -1 });
  } catch (error) {
    console.error("History fetch error:", error.message);
    throw error;
  }
};

module.exports = { saveHistory, getUserHistory };