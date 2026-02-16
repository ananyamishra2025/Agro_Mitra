const detectDisease = (fileName) => {
  if (!fileName || typeof fileName !== "string") {
    return {
      disease: "Invalid image",
      confidence: "Low",
      advice: "Please upload a valid plant image."
    };
  }

  const name = fileName.toLowerCase();

  // 🔎 Rule-based prototype detection

  if (name.includes("yellow")) {
    return {
      disease: "Nitrogen Deficiency",
      confidence: "High",
      advice: "Apply nitrogen-rich fertilizer and check irrigation levels."
    };
  }

  if (name.includes("spot")) {
    return {
      disease: "Leaf Spot Disease",
      confidence: "Medium",
      advice: "Apply fungicide and remove infected leaves."
    };
  }

  if (name.includes("blight")) {
    return {
      disease: "Early Blight",
      confidence: "Medium",
      advice: "Use copper-based fungicide and improve drainage."
    };
  }

  // Default fallback
  return {
    disease: "No major disease detected",
    confidence: "Low",
    advice: "Maintain regular crop monitoring."
  };
};

module.exports = { detectDisease };
