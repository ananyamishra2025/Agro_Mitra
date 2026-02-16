const { successResponse, errorResponse } = require("../../utils/response");

// 🔹 Internal Builders (Keep As-Is)
const buildRecommendation = ({ soil = "loamy", area = 1, budget = 0, location = "Unknown" } = {}) => {
  const normalizedArea = Number.isFinite(Number(area)) && Number(area) > 0 ? Number(area) : 1;
  const normalizedBudget = Number.isFinite(Number(budget)) ? Number(budget) : 0;
  const normalizedSoil = soil || "loamy";
  const normalizedLocation = location || "Unknown";

  return {
    weather: {
      temp: 26,
      humidity: 62,
      description: `Stable conditions expected near ${normalizedLocation}`,
    },
    crops: [
      {
        crop: "Wheat",
        est_yield_kg: Math.round(3200 * normalizedArea),
        notes: `Performs well in ${normalizedSoil} soil with moderate irrigation.`,
      },
      {
        crop: "Maize",
        est_yield_kg: Math.round(4100 * normalizedArea),
        notes: "Choose hybrids for higher yield potential.",
      },
      {
        crop: "Pulses",
        est_yield_kg: Math.round(1400 * normalizedArea),
        notes: "Improves soil health and fits tighter budgets.",
      },
    ],
    fertilizer_plan: [
      {
        crop: "Wheat",
        fertilizer: "Urea",
        qty_kg: Math.round(110 * normalizedArea),
        timing: "Basal + 30 DAS",
      },
      {
        crop: "Maize",
        fertilizer: "DAP",
        qty_kg: Math.round(85 * normalizedArea),
        timing: "Basal application",
      },
    ],
    action_plan: [
      {
        crop: "Wheat",
        plan: [
          "Test soil pH and organic carbon",
          "Prepare seedbed with light irrigation",
          "Apply basal fertilizer before sowing",
        ],
      },
      {
        crop: "Maize",
        plan: [
          "Ensure proper seed spacing",
          "Weed control at 15 DAS",
          "Top-dress nitrogen at 30 DAS",
        ],
      },
    ],
    meta: {
      soil: normalizedSoil,
      area: normalizedArea,
      budget: normalizedBudget,
      location: normalizedLocation,
    },
  };
};

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

// 🔹 Demo Controller
exports.getDemo = (req, res) => {
  try {
    const demoData = buildRecommendation({
      soil: "loamy",
      area: 2,
      budget: 8000,
      location: "Patna, IN",
    });

    return successResponse(res, demoData, "Demo generated successfully");
  } catch (error) {
    return errorResponse(res, "Demo generation failed");
  }
};

// 🔹 Recommend Controller
exports.postRecommend = (req, res) => {
  try {
    const result = buildRecommendation(req.body);
    return successResponse(res, result, "Recommendation generated successfully");
  } catch (error) {
    return errorResponse(res, "Recommendation failed");
  }
};

// 🔹 Fertilizer Controller
exports.postFertilizer = (req, res) => {
  try {
    const result = buildFertilizerPlan(req.body);
    return successResponse(res, result, "Fertilizer calculated successfully");
  } catch (error) {
    return errorResponse(res, "Fertilizer calculation failed");
  }
};
