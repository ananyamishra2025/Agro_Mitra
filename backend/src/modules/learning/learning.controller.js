const {
  getGardeningTips,
  getLearningResources
} = require("./learning.service");

const fetchGardeningTips = (req, res) => {
  try {
    const tips = getGardeningTips();
    res.json({
      success: true,
      count: tips.length,
      data: tips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch gardening tips"
    });
  }
};

const fetchLearningResources = (req, res) => {
  try {
    const resources = getLearningResources();
    res.json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch learning resources"
    });
  }
};

module.exports = {
  fetchGardeningTips,
  fetchLearningResources
};
