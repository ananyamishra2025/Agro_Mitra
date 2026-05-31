const CROP_PROFILES = [
  {
    crop: "Wheat",
    seasons: ["winter", "rabi"],
    soils: ["loamy", "clay loam", "black"],
    temperatureRange: [10, 28],
    rainfallRange: [30, 100],
    irrigation: "moderate",
    marketDemand: "high",
  },
  {
    crop: "Rice",
    seasons: ["monsoon", "kharif", "rainy"],
    soils: ["clay", "alluvial", "loamy"],
    temperatureRange: [20, 36],
    rainfallRange: [120, 300],
    irrigation: "high",
    marketDemand: "high",
  },
  {
    crop: "Maize",
    seasons: ["summer", "kharif", "monsoon"],
    soils: ["loamy", "sandy loam", "alluvial"],
    temperatureRange: [18, 35],
    rainfallRange: [50, 120],
    irrigation: "moderate",
    marketDemand: "high",
  },
  {
    crop: "Mustard",
    seasons: ["winter", "rabi"],
    soils: ["loamy", "sandy loam"],
    temperatureRange: [10, 25],
    rainfallRange: [25, 75],
    irrigation: "low",
    marketDemand: "medium",
  },
  {
    crop: "Potato",
    seasons: ["winter", "rabi"],
    soils: ["loamy", "sandy loam"],
    temperatureRange: [12, 26],
    rainfallRange: [50, 100],
    irrigation: "moderate",
    marketDemand: "high",
  },
  {
    crop: "Millet",
    seasons: ["summer", "kharif"],
    soils: ["sandy", "sandy loam", "red"],
    temperatureRange: [24, 40],
    rainfallRange: [25, 75],
    irrigation: "low",
    marketDemand: "medium",
  },
  {
    crop: "Pulses",
    seasons: ["winter", "rabi", "summer"],
    soils: ["loamy", "sandy loam", "black"],
    temperatureRange: [18, 34],
    rainfallRange: [30, 90],
    irrigation: "low",
    marketDemand: "medium",
  },
  {
    crop: "Tomato",
    seasons: ["winter", "summer"],
    soils: ["loamy", "sandy loam"],
    temperatureRange: [18, 32],
    rainfallRange: [40, 100],
    irrigation: "moderate",
    marketDemand: "high",
  },
];

const normalize = (value = "") => String(value).trim().toLowerCase();

const scoreRange = (value, [min, max]) => {
  if (!Number.isFinite(value)) return 10;
  if (value >= min && value <= max) return 25;

  const distance = value < min ? min - value : value - max;
  return Math.max(0, 20 - distance);
};

const classifyCrops = ({
  season = "",
  soilType = "",
  temperature,
  rainfall,
  irrigation = "",
  limit = 4,
} = {}) => {
  const normalizedSeason = normalize(season);
  const normalizedSoil = normalize(soilType);
  const normalizedIrrigation = normalize(irrigation);
  const numericTemperature = Number(temperature);
  const numericRainfall = Number(rainfall);

  return CROP_PROFILES.map((profile) => {
    let score = 20;
    const reasons = [];

    if (profile.seasons.some((item) => normalizedSeason.includes(item))) {
      score += 25;
      reasons.push("season match");
    }

    if (profile.soils.some((item) => normalizedSoil.includes(item))) {
      score += 20;
      reasons.push("soil match");
    }

    const temperatureScore = scoreRange(numericTemperature, profile.temperatureRange);
    score += temperatureScore;
    if (temperatureScore >= 20) reasons.push("temperature suitable");

    const rainfallScore = scoreRange(numericRainfall, profile.rainfallRange);
    score += rainfallScore;
    if (rainfallScore >= 20) reasons.push("rainfall suitable");

    if (!normalizedIrrigation || profile.irrigation === normalizedIrrigation) {
      score += 10;
      if (normalizedIrrigation) reasons.push("irrigation match");
    }

    if (profile.marketDemand === "high") score += 5;

    return {
      crop: profile.crop,
      confidence: Math.min(98, Math.round(score)),
      irrigationNeed: profile.irrigation,
      marketDemand: profile.marketDemand,
      reasons: reasons.length ? reasons : ["general seasonal fit"],
    };
  })
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit);
};

module.exports = { CROP_PROFILES, classifyCrops };
