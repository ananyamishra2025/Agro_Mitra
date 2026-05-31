const sendValidationError = (res, message) =>
  res.status(400).json({
    success: false,
    message,
  });

const trimString = (value) => (typeof value === "string" ? value.trim() : value);

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const sanitizeBody = (req, _res, next) => {
  const sanitize = (value) => {
    if (typeof value === "string") return value.trim();
    if (Array.isArray(value)) return value.map(sanitize);
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value)
          .filter(([key]) => !key.startsWith("$") && !key.includes("."))
          .map(([key, item]) => [key, sanitize(item)])
      );
    }
    return value;
  };

  req.body = sanitize(req.body || {});
  next();
};

const validateAdvisory = (req, res, next) => {
  const { location, season, soilType, landSize } = req.body;

  if (!location || typeof location !== "string") {
    return sendValidationError(res, "Location is required and must be a string");
  }

  if (!season || typeof season !== "string") {
    return sendValidationError(res, "Season is required and must be a string");
  }

  if (!soilType || typeof soilType !== "string") {
    return sendValidationError(res, "Soil type is required and must be a string");
  }

  const numericLandSize = Number.parseFloat(landSize);
  if (Number.isNaN(numericLandSize) || numericLandSize <= 0) {
    return sendValidationError(res, "Land size must be a valid positive number");
  }

  next();
};

const validateAuthRegister = (req, res, next) => {
  const name = trimString(req.body.name);
  const email = trimString(req.body.email);
  const phone = trimString(req.body.phone);
  const password = req.body.password;

  if (!name || typeof name !== "string" || name.length < 2) {
    return sendValidationError(res, "Full name is required");
  }

  if (!email && !phone) {
    return sendValidationError(res, "Email or phone number is required");
  }

  if (email && !isEmail(email)) {
    return sendValidationError(res, "Please provide a valid email address");
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return sendValidationError(res, "Password must be at least 6 characters");
  }

  req.body.name = name;
  req.body.email = email;
  req.body.phone = phone;
  next();
};

const validateAuthLogin = (req, res, next) => {
  const email = trimString(req.body.email);
  const phone = trimString(req.body.phone);
  const password = req.body.password;

  if (!email && !phone) {
    return sendValidationError(res, "Email or phone number is required");
  }

  if (email && !isEmail(email)) {
    return sendValidationError(res, "Please provide a valid email address");
  }

  if (!password || typeof password !== "string") {
    return sendValidationError(res, "Password is required");
  }

  req.body.email = email;
  req.body.phone = phone;
  next();
};

const validatePasswordReset = (req, res, next) => {
  const { token, newPassword } = req.body;

  if (!token || typeof token !== "string") {
    return sendValidationError(res, "Reset token is required");
  }

  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
    return sendValidationError(res, "New password must be at least 6 characters");
  }

  next();
};

const validateChatbot = (req, res, next) => {
  const { question } = req.body;

  if (!question || typeof question !== "string") {
    return sendValidationError(res, "Question must be a valid text string");
  }

  if (question.length < 3) {
    return sendValidationError(res, "Question is too short");
  }

  next();
};

const validateVoice = (req, res, next) => {
  const { language } = req.body;
  const allowedLanguages = ["hi-IN", "bn-IN", "en-IN"];

  if (language && !allowedLanguages.includes(language)) {
    return sendValidationError(res, "Unsupported language. Use hi-IN, bn-IN, or en-IN");
  }

  next();
};

const validateFertilizer = (req, res, next) => {
  const { crop, soil, area } = req.body;

  if (!crop || typeof crop !== "string") {
    return sendValidationError(res, "Crop is required");
  }

  if (!soil || typeof soil !== "string") {
    return sendValidationError(res, "Soil type is required");
  }

  const numericArea = Number(area);
  if (Number.isNaN(numericArea) || numericArea <= 0) {
    return sendValidationError(res, "Area must be a valid positive number");
  }

  next();
};

module.exports = {
  sanitizeBody,
  validateAdvisory,
  validateAuthLogin,
  validateAuthRegister,
  validateChatbot,
  validateFertilizer,
  validatePasswordReset,
  validateVoice,
};
