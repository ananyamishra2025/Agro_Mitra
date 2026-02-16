const History = require("./history.model");

// 🔥 Save history (with optional meta support)
const saveHistory = async ({ userId, type, input, output, meta = {} }) => {
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
