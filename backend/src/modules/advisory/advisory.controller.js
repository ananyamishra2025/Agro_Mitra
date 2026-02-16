const { generateAdvisory } = require("./advisory.service");
const { successResponse } = require("../../utils/response");
const { saveHistory } = require("../history/history.service");

exports.getAdvisory = async (req, res) => {
  try {
    // 1️⃣ Extract farmer-friendly input
    const { location, season, soilType, landSize } = req.body;

    // 2️⃣ Basic validation
    if (!location || !season || !soilType || !landSize) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required details"
      });
    }

    // 3️⃣ Generate advisory (ASYNC)
    const advisory = await generateAdvisory({
      location,
      season,
      soilType,
      landSize
    });

    // 🔹 4️⃣ Save history
    await saveHistory({
      userId: "demoUser",   // static for now
      type: "advisory",
      input: JSON.stringify({
        location,
        season,
        soilType,
        landSize
      }),
      output: JSON.stringify(advisory)
    });

    // 5️⃣ Send clean response
    return successResponse(res, advisory);

  } catch (error) {
    console.error("Advisory Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
