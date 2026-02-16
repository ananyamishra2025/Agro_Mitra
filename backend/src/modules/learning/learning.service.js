const { gardeningTips, learningResources } = require("./learning.data");

const getGardeningTips = () => {
  return gardeningTips;
};

const getLearningResources = () => {
  return learningResources;
};

module.exports = {
  getGardeningTips,
  getLearningResources
};
