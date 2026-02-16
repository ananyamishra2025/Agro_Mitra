const fs = require("fs/promises");
const { handleVoiceInput } = require("./voice.service");
const { saveHistory } = require("../history/history.service");
const { successResponse, errorResponse } = require("../../utils/response");

const processVoiceQuestion = async (req, res) => {
  const audioFile = req.file;

  try {
    // 🌍 Default language = Bengali
    const { language } = req.body;
    const selectedLanguage = language || "bn-IN";

    if (!audioFile) {
      return errorResponse(res, "Audio file is required", 400);
    }

    // 🎙️ Process voice input
    const result = await handleVoiceInput(audioFile.path, {
      language: selectedLanguage,
      mimeType: audioFile.mimetype
    });

    // 📝 Save history safely
    try {
      await saveHistory({
        userId: "demoUser",
        type: "voice",
        input: result.textQuestion,
        output: result.textAnswer,
        meta: { language: selectedLanguage }
      });
    } catch (historyError) {
      console.warn("History save failed:", historyError.message);
    }

    // ✅ Standardized success response
    return successResponse(
      res,
      {
        textQuestion: result.textQuestion,
        textAnswer: result.textAnswer,
        audioAnswerUrl: result.audioAnswerUrl
      },
      "Voice response generated successfully"
    );

  } catch (error) {
    console.error("Voice chatbot error:", error.message);
    return errorResponse(res, "Voice chatbot failed");
  } finally {
    // 🧹 Clean temporary uploaded file
    if (audioFile?.path) {
      await fs.unlink(audioFile.path).catch(() => {});
    }
  }
};

module.exports = { processVoiceQuestion };
