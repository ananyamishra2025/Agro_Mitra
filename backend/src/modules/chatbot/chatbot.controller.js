const { processQuestion } = require("./chatbot.service");

const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    // ✅ STRICT validation at controller level
    if (!question || typeof question !== "string") {
      return res.status(400).json({
        success: false,
        message: "Question must be a text string"
      });
    }

    const answer = await processQuestion(question);

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
