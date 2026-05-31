const { generateAdvisory } = require("./advisory.service");
const { successResponse, errorResponse } = require("../../utils/response");
const { logActivity } = require("../activity/activity.service");
const { saveHistory } = require("../history/history.service");
const { saveQuery, saveReport } = require("../saved/saved.service");

exports.getAdvisory = async (req, res) => {
  try {
    const { location, season, soilType, landSize } = req.body;

    if (!location || !season || !soilType || !landSize) {
      return errorResponse(res, "Please provide all required details", 400);
    }

    const advisory = await generateAdvisory({
      location,
      season,
      soilType,
      landSize,
    });

    const userId = req.user?.id || "demoUser";

    try {
      await saveHistory({
        userId,
        type: "advisory",
        input: JSON.stringify({ location, season, soilType, landSize }),
        output: JSON.stringify(advisory),
      });
      await saveQuery({
        userId,
        feature: "advisory",
        title: `Crop advisory for ${location}`,
        query: { location, season, soilType, landSize },
        result: advisory,
      });
      await saveReport({
        userId,
        reportType: "crop_advisory",
        title: `Crop advisory report - ${location}`,
        summary: advisory.recommendedCrops?.join(", ") || "Crop advisory report",
        data: advisory,
      });
      await logActivity({
        userId,
        action: "crop_advisory_generated",
        entityType: "Advisory",
        message: `Crop advisory generated for ${location}`,
        meta: { season, soilType, landSize },
      });
    } catch (databaseError) {
      console.warn("Advisory database save failed:", databaseError.message);
    }

    return successResponse(res, advisory, "Advisory generated successfully");
  } catch (error) {
    console.error("Advisory Error:", error);
    return errorResponse(res, "Internal server error");
  }
};
