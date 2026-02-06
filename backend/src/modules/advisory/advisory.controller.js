const { generateAdvisory } = require("./advisory.service");
const { successResponse } = require("../../utils/response");

exports.getAdvisory = async (req, res) => {
  try {
    // 1️⃣ Extract farmer-friendly input
    const { location, season, soilType, landSize } = req.body;

    // 2️⃣ Basic validation (simple & clear)
    if (!location || !season || !soilType || !landSize) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required details"
      });
    }

    // 3️⃣ Call advisory service (ASYNC)
    const advisory = await generateAdvisory({
      location,
      season,
      soilType,
      landSize
    });

    // 4️⃣ Send clean success response
    return successResponse(res, advisory);

  } catch (error) {
    console.error("Advisory Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
