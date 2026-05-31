const fs = require("fs/promises");

const { detectDisease } = require("./disease.service");
const { saveCropDiseaseReport } = require("./crop-disease.service");
const { logActivity } = require("../activity/activity.service");
const { saveHistory } = require("../history/history.service");
const { successResponse, errorResponse } = require("../../utils/response");

exports.uploadImage = async (req, res) => {
  const imageFile = req.file;

  try {
    if (!imageFile) {
      return errorResponse(res, "Image file is required", 400);
    }

    if (!imageFile.mimetype.startsWith("image/")) {
      return errorResponse(res, "Only image files are allowed", 400);
    }

    const userId = req.user?.id || "demoUser";
    const prediction = detectDisease(imageFile.originalname, {
      cropName: req.body.cropName || "",
      symptoms: req.body.symptoms || "",
    });
    const report = await saveCropDiseaseReport({
      userId,
      cropName: req.body.cropName || "",
      imageName: imageFile.originalname,
      prediction,
    });

    try {
      await saveHistory({
        userId,
        type: "image",
        input: imageFile.originalname,
        output: prediction.disease,
      });
      await logActivity({
        userId,
        action: "crop_disease_detected",
        entityType: "CropDisease",
        entityId: report.id,
        message: `${prediction.disease} detected from uploaded crop image`,
        meta: { confidence: prediction.confidence },
      });
    } catch (historyError) {
      console.warn("Image history/activity save failed:", historyError.message);
    }

    return successResponse(
      res,
      {
        image: imageFile.filename,
        prediction,
        report,
      },
      "Image processed successfully"
    );
  } catch (error) {
    console.error("Image detection error:", error.message);
    return errorResponse(res, "Image processing failed");
  } finally {
    if (imageFile?.path) {
      await fs.unlink(imageFile.path).catch(() => {});
    }
  }
};
