const { generateAdvisory } = require("./advisory.service");
const { successResponse, errorResponse } = require("../../utils/response");
const { saveHistory } = require("../history/history.service");

exports.getAdvisory = async (req, res) => {
  try {
    const { location, season, soilType, landSize } = req.body;

    // 🔎 Input Validation
    if (!location || !season || !soilType || !landSize) {
      return errorResponse(res, "Please provide all required details", 400);
    }

    // 📊 Generate Advisory
    const advisory = await generateAdvisory({
      location,
      season,
      soilType,
      landSize
    });

    // 📝 Save History (non-blocking logic)
    try {
      await saveHistory({
        userId: "demoUser", // later replace with real auth user
        type: "advisory",
        input: JSON.stringify({ location, season, soilType, landSize }),
        output: JSON.stringify(advisory)
      });
    } catch (historyError) {
      console.warn("History save failed:", historyError.message);
    }

    // ✅ Standardized Success Response
    return successResponse(
      res,
      advisory,
      "Advisory generated successfully"
    );

  } catch (error) {
    console.error("Advisory Error:", error);
    return errorResponse(res, "Internal server error");
  }
};
