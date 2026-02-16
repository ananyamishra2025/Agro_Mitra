const { learningResources } = require("./learning.data");

exports.getLearningResources = (req, res) => {
  res.json({
    success: true,
    count: learningResources.length,
    data: learningResources
  });
};
