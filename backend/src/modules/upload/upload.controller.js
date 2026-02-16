const fs = require("fs/promises");
const { detectDisease } = require("./disease.service");
const { saveHistory } = require("../history/history.service");

exports.uploadImage = async (req, res) => {
  const imageFile = req.file;

  try {
    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Image file is required"
      });
    }

    // 🛡 Basic validation
    if (!imageFile.mimetype.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed"
      });
    }
    
    // 🔎 Run disease detection
    const prediction = detectDisease(imageFile.originalname);

    // 💾 Save history
    await saveHistory({
      userId: "demoUser",
      type: "image",
      input: imageFile.originalname,
      output: prediction.disease
    });

    return res.json({
      success: true,
      image: imageFile.filename,
      prediction
    });

  } catch (error) {
    console.error("Image detection error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Image processing failed"
    });
  } finally {
    // Optional: delete uploaded file after processing
    if (imageFile?.path) {
      await fs.unlink(imageFile.path).catch(() => {});
    }
  }
};
