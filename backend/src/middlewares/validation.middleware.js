// 🔎 Validate Advisory Input
const validateAdvisory = (req, res, next) => {
  const { location, season, soilType, landSize } = req.body;

  if (!location || typeof location !== "string") {
    return res.status(400).json({
      success: false,
      message: "Location is required and must be a string"
    });
  }

  if (!season || typeof season !== "string") {
    return res.status(400).json({
      success: false,
      message: "Season is required and must be a string"
    });
  }

  if (!soilType || typeof soilType !== "string") {
    return res.status(400).json({
      success: false,
      message: "Soil type is required and must be a string"
    });
  }

  const numericLandSize = parseFloat(landSize);
  if (isNaN(numericLandSize) || numericLandSize <= 0) {
    return res.status(400).json({
      success: false,
      message: "Land size must be a valid positive number"
    });
  }

  next();
};

// 🔎 Validate Chatbot Question
const validateChatbot = (req, res, next) => {
  const { question } = req.body;

  if (!question || typeof question !== "string") {
    return res.status(400).json({
      success: false,
      message: "Question must be a valid text string"
    });
  }

  if (question.length < 3) {
    return res.status(400).json({
      success: false,
      message: "Question is too short"
    });
  }

  next();
};

// 🔎 Validate Voice Language
const validateVoice = (req, res, next) => {
  const { language } = req.body;

  const allowedLanguages = ["hi-IN", "bn-IN"];

  if (language && !allowedLanguages.includes(language)) {
    return res.status(400).json({
      success: false,
      message: "Unsupported language. Use hi-IN or bn-IN"
    });
  }

  next();
};

// 🔎 Validate Fertilizer Input
const validateFertilizer = (req, res, next) => {
  const { crop, soil, area } = req.body;

  if (!crop || typeof crop !== "string") {
    return res.status(400).json({
      success: false,
      message: "Crop is required"
    });
  }

  if (!soil || typeof soil !== "string") {
    return res.status(400).json({
      success: false,
      message: "Soil type is required"
    });
  }

  const numericArea = Number(area);
  if (isNaN(numericArea) || numericArea <= 0) {
    return res.status(400).json({
      success: false,
      message: "Area must be a valid positive number"
    });
  }

  next();
};

module.exports = {
  validateAdvisory,
  validateChatbot,
  validateVoice,
  validateFertilizer
};
