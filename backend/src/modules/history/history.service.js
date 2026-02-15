const History = require("./history.model");

const saveHistory = async ({ userId, type, input, output, meta = {} }) => {
  const entry = await History.create({
    userId,
    type,
    input,
    output,
    meta
  });

  return entry;
};

const getUserHistory = async (userId) => {
  return await History.find({ userId }).sort({ createdAt: -1 });
};

module.exports = { saveHistory, getUserHistory };
