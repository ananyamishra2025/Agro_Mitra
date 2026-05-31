const { classifyCrops } = require("../ai/crop-classifier.service");
const { buildRecommendation } = require("../ai/recommendation-engine.service");
const { successResponse, errorResponse } = require("../../utils/response");

const buildFertilizerPlan = ({ crop = "Maize", soil = "loamy", area = 1 } = {}) => {
  const normalizedArea = Number.isFinite(Number(area)) && Number(area) > 0 ? Number(area) : 1;
  const normalizedCrop = crop || "Maize";
  const normalizedSoil = soil || "loamy";

  return {
    crop: normalizedCrop,
    soil: normalizedSoil,
    area_ha: normalizedArea,
    nutrients: [
      { nutrient: "N", qty_kg: Math.round(90 * normalizedArea) },
      { nutrient: "P", qty_kg: Math.round(45 * normalizedArea) },
      { nutrient: "K", qty_kg: Math.round(40 * normalizedArea) },
    ],
    notes: `Adjust split doses based on moisture for ${normalizedSoil} soil.`,
  };
};

exports.getDemo = (req, res) => {
  try {
    const demoData = buildRecommendation({
      season: "rabi",
      soilType: "loamy",
      landSize: 2,
      budget: 8000,
      location: "Patna, IN",
      temperature: 24,
      rainfall: 55,
      irrigation: "moderate",
    });

    return successResponse(res, demoData, "Demo generated successfully");
  } catch (error) {
    return errorResponse(res, "Demo generation failed");
  }
};

exports.postRecommend = (req, res) => {
  try {
    const result = buildRecommendation(req.body);
    return successResponse(res, result, "Recommendation generated successfully");
  } catch (error) {
    return errorResponse(res, "Recommendation failed");
  }
};

exports.postClassifyCrop = (req, res) => {
  try {
    const result = classifyCrops(req.body);
    return successResponse(res, { crops: result }, "Crop classification completed successfully");
  } catch (error) {
    return errorResponse(res, "Crop classification failed");
  }
};

exports.postFertilizer = (req, res) => {
  try {
    const result = buildFertilizerPlan(req.body);
    return successResponse(res, result, "Fertilizer calculated successfully");
  } catch (error) {
    return errorResponse(res, "Fertilizer calculation failed");
  }
};
