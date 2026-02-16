const { gardeningTips } = require("./gardening.data");

exports.getGardeningTips = (req, res) => {
  res.json({
    success: true,
    count: gardeningTips.length,
    data: gardeningTips
  });
};
