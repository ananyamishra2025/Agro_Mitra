const { processQuestion } = require("./chatbot.service");
const { saveHistory } = require("../history/history.service");
const { successResponse, errorResponse } = require("../../utils/response");

const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    // 🔎 Strict validation
    if (!question || typeof question !== "string") {
      return errorResponse(res, "Question must be a text string", 400);
    }

    // 🤖 Process chatbot logic
    const answer = await processQuestion(question);

    // 📝 Save history safely (non-blocking)
    try {
      await saveHistory({
        userId: "demoUser", // later replace with real authenticated user
        type: "chatbot",
        input: question,
        output: answer
      });
    } catch (historyError) {
      console.warn("History save failed:", historyError.message);
    }

    // ✅ Standardized response
    return successResponse(
      res,
      { question, answer },
      "Chatbot response generated successfully"
    );

  } catch (error) {
    console.error("Chatbot error:", error.message);
    return errorResponse(res, "Chatbot service failed");
  }
};

module.exports = { askQuestion };
