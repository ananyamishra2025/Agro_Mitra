const fs = require("fs/promises");
const { detectDisease } = require("./disease.service");
const { saveHistory } = require("../history/history.service");
const { successResponse, errorResponse } = require("../../utils/response");

exports.uploadImage = async (req, res) => {
  const imageFile = req.file;

  try {
    if (!imageFile) {
      return errorResponse(res, "Image file is required", 400);
    }

    // 🛡 Basic validation
    if (!imageFile.mimetype.startsWith("image/")) {
      return errorResponse(res, "Only image files are allowed", 400);
    }
    
    // 🔎 Run disease detection
    const prediction = detectDisease(imageFile.originalname);

    // 💾 Save history without blocking the upload response
    try {
      await saveHistory({
        userId: "demoUser",
        type: "image",
        input: imageFile.originalname,
        output: prediction.disease
      });
    } catch (historyError) {
      console.warn("Image history save failed:", historyError.message);
    }

    return successResponse(
      res,
      {
        image: imageFile.filename,
        prediction
      },
      "Image processed successfully"
    );

  } catch (error) {
    console.error("Image detection error:", error.message);

    return errorResponse(res, "Image processing failed");
  } finally {
    // Optional: delete uploaded file after processing
    if (imageFile?.path) {
      await fs.unlink(imageFile.path).catch(() => {});
    }
  }
};
