const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  const isMulterError = err instanceof multer.MulterError;
  const isFileValidationError = err.message?.startsWith("Only JPEG");
  const status = isMulterError || isFileValidationError ? 400 : err.status || 500;

  console.error("🌍 Global Error Handler:", err.message);

  res.status(status).json({
    success: false,
    message: err.message || "Internal server error"
  });
};

module.exports = errorHandler;