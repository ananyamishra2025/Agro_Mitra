const { detectDisease: runDiseaseDetection } = require("../ai/disease-detection.service");

const detectDisease = (fileName, options = {}) =>
  runDiseaseDetection({
    fileName,
    cropName: options.cropName,
    symptoms: options.symptoms,
  });

module.exports = { detectDisease };
