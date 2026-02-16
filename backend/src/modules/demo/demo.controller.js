const { runDemo } = require("./demo.service");
const { saveHistory } = require("../history/history.service");
const { successResponse, errorResponse } = require("../../utils/response");

const runDemoController = async (req, res) => {
  try {
    const result = await runDemo();

    // 📝 Save history safely
    try {
      await saveHistory({
        userId: "demoUser",
        type: "demo",
        input: "One-click demo executed",
        output: JSON.stringify(result)
      });
    } catch (historyError) {
      console.warn("Demo history save failed:", historyError.message);
    }

    return successResponse(
      res,
      result,
      "Demo executed successfully"
    );

  } catch (error) {
    console.error("Demo error:", error.message);
    return errorResponse(res, "Demo failed");
  }
};

module.exports = { runDemoController };
