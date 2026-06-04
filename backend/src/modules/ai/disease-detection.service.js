const DISEASE_PROFILES = [
  {
    disease: "Tomato Fruit Spot / Anthracnose",
    crop: "Tomato",
    keywords: ["tomato", "fruit", "black", "dark", "sunken", "spot", "spots", "rot", "lesion", "anthracnose"],
    symptoms: ["Dark sunken spots on tomato fruit", "Circular black or brown lesions", "Soft rotting area around the spot"],
    likelyCauses: ["Fungal infection favored by humid weather", "Water splashing soil-borne spores onto fruit", "Infected plant debris left in the field"],
    advice: "Remove affected fruits, avoid overhead watering, improve airflow, and use a locally recommended copper or mancozeb-based fungicide if infection is spreading.",
    actionPlan: [
      "Remove and destroy visibly infected fruits and fallen debris.",
      "Keep foliage and fruit dry by watering near the soil line.",
      "Prune crowded leaves to improve airflow around tomato plants.",
      "Ask a local agriculture expert about a suitable fungicide if spots continue spreading.",
    ],
    prevention: ["Stake plants to keep fruit off soil", "Mulch around plants", "Rotate tomato crops each season"],
    severity: "high",
  },
  {
    disease: "Early Blight",
    crop: "Tomato/Potato",
    keywords: ["blight", "early-blight", "tomato-blight", "ring", "rings", "target", "yellowing", "brown"],
    symptoms: ["Dark concentric rings", "Lower leaf infection", "Yellowing around lesions"],
    likelyCauses: ["Fungal spores surviving in soil or crop residue", "Warm humid weather", "Poor airflow between plants"],
    advice: "Remove infected leaves, improve spacing, and use a recommended fungicide early if lesions spread.",
    actionPlan: [
      "Cut off badly infected lower leaves.",
      "Avoid wetting leaves during irrigation.",
      "Apply copper-based fungicide only as per label and local expert advice.",
    ],
    prevention: ["Rotate with non-solanaceous crops", "Use disease-free seedlings", "Do not leave infected leaves in the bed"],
    severity: "high",
  },
  {
    disease: "Leaf Spot Disease",
    crop: "Vegetables",
    keywords: ["spot", "spots", "brown", "lesion", "patch", "patches"],
    symptoms: ["Circular leaf spots", "Brown patches", "Dry leaf edges"],
    likelyCauses: ["Fungal or bacterial leaf infection", "High humidity", "Splashing irrigation water"],
    advice: "Remove infected leaves, avoid overhead watering, and apply a recommended fungicide if the disease spreads.",
    actionPlan: [
      "Remove the most affected leaves.",
      "Water at the base of the plant.",
      "Keep plant spacing open for air movement.",
    ],
    prevention: ["Sanitize tools", "Avoid working with wet plants", "Use resistant varieties where available"],
    severity: "medium",
  },
  {
    disease: "Nitrogen Deficiency",
    crop: "General crop",
    keywords: ["yellow", "pale", "chlorosis", "nitrogen", "weak"],
    symptoms: ["Yellowing leaves", "Slow growth", "Weak stems"],
    likelyCauses: ["Low soil nitrogen", "Nutrient leaching after heavy rain", "Root stress"],
    advice: "Apply nitrogen-rich fertilizer in split doses and check irrigation consistency.",
    actionPlan: [
      "Check whether older leaves are yellowing first.",
      "Apply compost or nitrogen fertilizer in small split doses.",
      "Avoid overwatering because it can worsen nutrient loss.",
    ],
    prevention: ["Test soil before the next crop", "Add organic matter", "Use balanced fertilization"],
    severity: "medium",
  },
  {
    disease: "Powdery Mildew",
    crop: "Vegetables",
    keywords: ["mildew", "powder", "white", "dusty"],
    symptoms: ["White powdery coating", "Curling leaves", "Reduced vigor"],
    likelyCauses: ["Dense canopy", "Dry days with humid nights", "Poor airflow"],
    advice: "Improve spacing, remove infected growth, and use sulfur or neem-based spray where suitable.",
    actionPlan: [
      "Remove badly coated leaves.",
      "Improve airflow around plants.",
      "Use sulfur or neem-based spray only as recommended for the crop.",
    ],
    prevention: ["Do not overcrowd plants", "Choose resistant varieties", "Monitor early in humid weather"],
    severity: "medium",
  },
  {
    disease: "Rust Disease",
    crop: "Wheat",
    keywords: ["rust", "orange", "stripe", "pustule", "pustules"],
    symptoms: ["Orange pustules", "Striped leaves", "Reduced grain filling"],
    likelyCauses: ["Rust fungal spores", "Susceptible variety", "Cool humid conditions"],
    advice: "Use resistant varieties and apply fungicide early if rust patches spread.",
    actionPlan: [
      "Inspect nearby plants for orange pustules.",
      "Separate heavily infected plants where possible.",
      "Consult the local agriculture office for fungicide timing.",
    ],
    prevention: ["Use resistant seed", "Monitor during cool humid weather", "Avoid volunteer wheat plants"],
    severity: "high",
  },
];

const tokenizeEvidence = ({ fileName = "", cropName = "", symptoms = "" } = {}) =>
  `${fileName} ${cropName} ${symptoms}`
    .toLowerCase()
    .replace(/[_-]/g, " ");

const confidenceLabel = (score) => {
  if (score >= 78) return "High";
  if (score >= 52) return "Medium";
  return "Low";
};

const cropMatchesProfile = (cropName, profile) => {
  if (!cropName) return false;
  const crop = cropName.toLowerCase();
  return profile.crop.toLowerCase().includes(crop) || crop.includes(profile.crop.toLowerCase().split("/")[0]);
};

const buildPrediction = (profile, { cropName, score, evidence, keywordHits, needsReview = false }) => ({
  disease: profile.disease,
  crop: cropName || profile.crop,
  confidence: confidenceLabel(score),
  confidenceScore: Math.min(96, score),
  severity: profile.severity,
  symptoms: profile.symptoms,
  likelyCauses: profile.likelyCauses,
  advice: profile.advice,
  actionPlan: profile.actionPlan,
  prevention: profile.prevention,
  evidence: keywordHits.length
    ? `Matched signs: ${keywordHits.join(", ")}`
    : evidence.includes("tomato")
      ? "Tomato crop detected. Add visible symptoms for stronger confirmation."
      : "Limited symptom evidence provided.",
  needsReview,
});

const detectDisease = ({ fileName, cropName = "", symptoms = "" } = {}) => {
  if (!fileName || typeof fileName !== "string") {
    return {
      disease: "Invalid image",
      crop: cropName || "Unknown",
      confidence: "Low",
      confidenceScore: 0,
      severity: "unknown",
      symptoms: [],
      likelyCauses: [],
      actionPlan: ["Please upload a valid plant image."],
      prevention: [],
      advice: "Please upload a valid plant image.",
      evidence: "No valid image file was received.",
      needsReview: true,
    };
  }

  const evidence = tokenizeEvidence({ fileName, cropName, symptoms });
  const matches = DISEASE_PROFILES.map((profile) => {
    const keywordHits = profile.keywords.filter((keyword) => evidence.includes(keyword));
    const cropBoost = cropMatchesProfile(cropName, profile) ? 12 : 0;
    const filenameCropBoost = !cropName && evidence.includes("tomato") && profile.crop.includes("Tomato") ? 8 : 0;
    const symptomBoost = symptoms ? 12 : 0;
    const score = 24 + keywordHits.length * 12 + cropBoost + filenameCropBoost + symptomBoost;

    return {
      ...profile,
      confidenceScore: Math.min(96, score),
      keywordHits,
    };
  }).sort((a, b) => b.confidenceScore - a.confidenceScore);

  const best = matches[0];
  const hasDiseaseSignal = best.keywordHits.some((keyword) => keyword !== "tomato") || symptoms.trim();

  if (!hasDiseaseSignal && evidence.includes("tomato")) {
    const tomatoFruitRot = DISEASE_PROFILES[0];
    return buildPrediction(tomatoFruitRot, {
      cropName: cropName || "Tomato",
      score: 56,
      evidence,
      keywordHits: ["tomato"],
      needsReview: true,
    });
  }

  if (!hasDiseaseSignal) {
    return {
      disease: "No major disease detected",
      crop: cropName || "General crop",
      confidence: "Low",
      confidenceScore: 35,
      severity: "low",
      symptoms: ["No strong visible disease signal found from the provided details"],
      likelyCauses: ["The uploaded file did not include enough disease evidence"],
      actionPlan: [
        "Upload a close, well-lit photo of the affected leaf, stem, or fruit.",
        "Add crop name and visible symptoms before analyzing.",
        "Continue monitoring the plant for spreading spots, wilting, or color change.",
      ],
      prevention: ["Keep plants clean and well spaced", "Avoid overhead watering", "Inspect crops every few days"],
      advice: "Maintain regular crop monitoring and upload a clearer image with symptoms if damage appears.",
      evidence: "No disease keywords or symptoms were provided.",
      needsReview: true,
    };
  }

  return buildPrediction(best, {
    cropName,
    score: best.confidenceScore,
    evidence,
    keywordHits: best.keywordHits,
  });
};

module.exports = { DISEASE_PROFILES, detectDisease };
