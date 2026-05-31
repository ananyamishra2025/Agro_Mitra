const DISEASE_PROFILES = [
  {
    disease: "Nitrogen Deficiency",
    crop: "General crop",
    keywords: ["yellow", "pale", "chlorosis", "nitrogen"],
    symptoms: ["Yellowing leaves", "Slow growth", "Weak stems"],
    advice: "Apply nitrogen-rich fertilizer in split doses and check irrigation consistency.",
    severity: "medium",
  },
  {
    disease: "Leaf Spot Disease",
    crop: "Vegetables",
    keywords: ["spot", "spots", "brown", "lesion"],
    symptoms: ["Circular leaf spots", "Brown patches", "Dry leaf edges"],
    advice: "Remove infected leaves, avoid overhead watering, and apply a recommended fungicide.",
    severity: "medium",
  },
  {
    disease: "Early Blight",
    crop: "Tomato/Potato",
    keywords: ["blight", "early-blight", "tomato-blight"],
    symptoms: ["Dark concentric rings", "Lower leaf infection", "Yellowing around lesions"],
    advice: "Use copper-based fungicide, improve airflow, and rotate crops next season.",
    severity: "high",
  },
  {
    disease: "Powdery Mildew",
    crop: "Vegetables",
    keywords: ["mildew", "powder", "white"],
    symptoms: ["White powdery coating", "Curling leaves", "Reduced vigor"],
    advice: "Improve spacing, remove infected growth, and use sulfur or neem-based spray.",
    severity: "medium",
  },
  {
    disease: "Rust Disease",
    crop: "Wheat",
    keywords: ["rust", "orange", "stripe"],
    symptoms: ["Orange pustules", "Striped leaves", "Reduced grain filling"],
    advice: "Use resistant varieties and apply fungicide early if rust patches spread.",
    severity: "high",
  },
];

const tokenizeEvidence = ({ fileName = "", cropName = "", symptoms = "" } = {}) =>
  `${fileName} ${cropName} ${symptoms}`.toLowerCase();

const detectDisease = ({ fileName, cropName = "", symptoms = "" } = {}) => {
  if (!fileName || typeof fileName !== "string") {
    return {
      disease: "Invalid image",
      crop: cropName || "Unknown",
      confidence: "Low",
      confidenceScore: 0,
      severity: "unknown",
      symptoms: [],
      advice: "Please upload a valid plant image.",
    };
  }

  const evidence = tokenizeEvidence({ fileName, cropName, symptoms });
  const matches = DISEASE_PROFILES.map((profile) => {
    const keywordHits = profile.keywords.filter((keyword) => evidence.includes(keyword));
    const cropBoost = cropName && profile.crop.toLowerCase().includes(cropName.toLowerCase()) ? 10 : 0;
    const score = 35 + keywordHits.length * 20 + cropBoost;

    return {
      ...profile,
      confidenceScore: Math.min(96, score),
      keywordHits,
    };
  }).sort((a, b) => b.confidenceScore - a.confidenceScore);

  const best = matches[0];
  if (!best.keywordHits.length && !symptoms) {
    return {
      disease: "No major disease detected",
      crop: cropName || "General crop",
      confidence: "Low",
      confidenceScore: 35,
      severity: "low",
      symptoms: ["No strong visible disease signal found"],
      advice: "Maintain regular crop monitoring and upload a clearer leaf image if symptoms increase.",
    };
  }

  return {
    disease: best.disease,
    crop: cropName || best.crop,
    confidence: best.confidenceScore >= 75 ? "High" : "Medium",
    confidenceScore: best.confidenceScore,
    severity: best.severity,
    symptoms: best.symptoms,
    advice: best.advice,
  };
};

module.exports = { DISEASE_PROFILES, detectDisease };
