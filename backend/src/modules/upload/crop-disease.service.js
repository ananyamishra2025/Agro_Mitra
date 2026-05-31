const CropDisease = require("./crop-disease.model");
const { isDatabaseConnected } = require("../../utils/database");

const reports = [];

const normalizeDiseaseReport = (report) => ({
  id: report.id || report._id?.toString(),
  userId: report.userId,
  cropName: report.cropName,
  imageName: report.imageName,
  disease: report.disease,
  confidence: report.confidence,
  advice: report.advice,
  status: report.status,
  createdAt: report.createdAt,
});

const saveCropDiseaseReport = async ({ userId = "demoUser", cropName = "", imageName, prediction }) => {
  if (isDatabaseConnected()) {
    const report = await CropDisease.create({
      userId,
      cropName,
      imageName,
      disease: prediction.disease,
      confidence: prediction.confidence,
      advice: prediction.advice,
    });

    return normalizeDiseaseReport(report);
  }

  const report = {
    id: `disease_${Date.now()}`,
    userId,
    cropName,
    imageName,
    disease: prediction.disease,
    confidence: prediction.confidence,
    advice: prediction.advice,
    status: "detected",
    createdAt: new Date().toISOString(),
  };
  reports.unshift(report);
  return report;
};

module.exports = { saveCropDiseaseReport };
