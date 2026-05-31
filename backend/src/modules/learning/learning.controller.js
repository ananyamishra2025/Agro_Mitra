const { getLearningResources } = require("./learning.service");

exports.getLearningResources = async (req, res) => {
  const learningResources = await getLearningResources();

  res.json({
    success: true,
    count: learningResources.length,
    data: learningResources
  });
};
