const { processQuestion } = require("./chatbot.service");
const { logActivity } = require("../activity/activity.service");
const { saveHistory } = require("../history/history.service");
const { saveQuery } = require("../saved/saved.service");
const { successResponse, errorResponse } = require("../../utils/response");

const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return errorResponse(res, "Question must be a text string", 400);
    }

    const answer = await processQuestion(question);
    const userId = req.user?.id || "demoUser";

    try {
      await saveHistory({
        userId,
        type: "chatbot",
        input: question,
        output: answer,
      });
      await saveQuery({
        userId,
        feature: "chatbot",
        title: question.slice(0, 60),
        query: { question },
        result: { answer },
      });
      await logActivity({
        userId,
        action: "chatbot_question_answered",
        entityType: "Chatbot",
        message: "AI chatbot answered a farming question",
        meta: { question },
      });
    } catch (databaseError) {
      console.warn("Chatbot database save failed:", databaseError.message);
    }

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
