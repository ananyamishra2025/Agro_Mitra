const { classifyCrops } = require("./crop-classifier.service");

const nutrientPlan = {
  Wheat: { fertilizer: "Urea + DAP", perAcreKg: 70 },
  Rice: { fertilizer: "Urea + MOP", perAcreKg: 85 },
  Maize: { fertilizer: "DAP + Urea", perAcreKg: 75 },
  Mustard: { fertilizer: "DAP + Sulphur", perAcreKg: 45 },
  Potato: { fertilizer: "NPK 10:26:26", perAcreKg: 90 },
  Millet: { fertilizer: "Compost + Urea", perAcreKg: 35 },
  Pulses: { fertilizer: "Rhizobium + SSP", perAcreKg: 30 },
  Tomato: { fertilizer: "NPK + Calcium nitrate", perAcreKg: 65 },
};

const parseArea = (area = 1) => {
  const numericArea = Number.parseFloat(area);
  return Number.isFinite(numericArea) && numericArea > 0 ? numericArea : 1;
};

const buildRecommendation = ({
  location = "Unknown",
  season = "",
  soilType = "",
  soil = "",
  landSize = 1,
  area = 1,
  budget = 0,
  temperature,
  rainfall,
  irrigation = "",
} = {}) => {
  const normalizedArea = parseArea(landSize || area);
  const normalizedSoil = soilType || soil || "loamy";
  const cropScores = classifyCrops({
    season,
    soilType: normalizedSoil,
    temperature,
    rainfall,
    irrigation,
    limit: 4,
  });

  const crops = cropScores.map((item) => ({
    crop: item.crop,
    confidence: item.confidence,
    est_yield_kg: Math.round((item.confidence / 100) * 3600 * normalizedArea),
    irrigationNeed: item.irrigationNeed,
    marketDemand: item.marketDemand,
    notes: `${item.crop} is recommended because of ${item.reasons.join(", ")}.`,
  }));

  const fertilizer_plan = cropScores.slice(0, 3).map((item) => {
    const plan = nutrientPlan[item.crop] || { fertilizer: "Balanced NPK", perAcreKg: 45 };
    return {
      crop: item.crop,
      fertilizer: plan.fertilizer,
      qty_kg: Math.round(plan.perAcreKg * normalizedArea),
      timing: "Apply basal dose during sowing and split nitrogen after 20-30 days.",
    };
  });

  const action_plan = [
    "Test soil pH and organic carbon before sowing.",
    `Prioritize ${crops[0]?.crop || "the top crop"} for the highest suitability score.`,
    "Use certified seeds and maintain recommended spacing.",
    "Schedule irrigation based on soil moisture and rainfall.",
    "Inspect leaves weekly and save disease reports in the app.",
  ];

  return {
    location,
    weather: {
      temp: temperature ?? null,
      rainfall: rainfall ?? null,
      description: `Recommendation generated for ${location}`,
    },
    recommendedCrops: crops.map((item) => item.crop),
    cropClassification: cropScores,
    crops,
    fertilizerAdvice: fertilizer_plan
      .map((item) => `${item.crop}: ${item.qty_kg} kg ${item.fertilizer}`)
      .join("; "),
    fertilizer_plan,
    actionPlan: action_plan,
    action_plan,
    meta: {
      soil: normalizedSoil,
      area: normalizedArea,
      budget: Number(budget) || 0,
      engine: "agro-mitra-scoring-v1",
    },
  };
};

module.exports = { buildRecommendation };
