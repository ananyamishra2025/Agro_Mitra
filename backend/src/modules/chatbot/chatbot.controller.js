const { processQuestion } = require("./chatbot.service");
const { saveHistory } = require("../history/history.service");

const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    // ✅ Strict validation
    if (!question || typeof question !== "string") {
      return res.status(400).json({
        success: false,
        message: "Question must be a text string"
      });
    }

    // 🔹 Process chatbot logic
    const answer = await processQuestion(question);

    // 🔹 Save to History (Static user for now)
    await saveHistory({
      userId: "demoUser",   // Later this will come from auth
      type: "chatbot",
      input: question,
      output: answer
    });

    res.json({
      success: true,
      question,
      answer
    });

  } catch (error) {
    console.error("❌ Chatbot error:", error.message);

    res.status(500).json({
      success: false,
      message: "Chatbot service failed"
    });
  }
};

module.exports = { askQuestion };
