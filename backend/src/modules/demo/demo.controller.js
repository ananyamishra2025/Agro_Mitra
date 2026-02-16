const { runDemo } = require("./demo.service");
const { saveHistory } = require("../history/history.service");

const runDemoController = async (req, res) => {
  try {
    const result = await runDemo();

    // Save demo history
    await saveHistory({
      userId: "demoUser",
      type: "demo",
      input: "One-click demo executed",
      output: JSON.stringify(result)
    });

    res.json({
      success: true,
      message: "Demo executed successfully",
      data: result
    });

  } catch (error) {
    console.error("Demo error:", error.message);
    res.status(500).json({
      success: false,
      message: "Demo failed"
    });
  }
};

module.exports = { runDemoController };
