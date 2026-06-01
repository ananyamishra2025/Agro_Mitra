const fs = require("fs/promises");
const { handleVoiceInput } = require("./voice.service");
const { processQuestion } = require("../chatbot/chatbot.service");
const { saveHistory } = require("../history/history.service");
const { successResponse, errorResponse } = require("../../utils/response");

const processVoiceQuestion = async (req, res) => {
  const audioFile = req.file;

  try {
    const { language, textQuestion } = req.body;
    const selectedLanguage = language || "bn-IN";

    if (textQuestion && typeof textQuestion === "string") {
      const textAnswer = await processQuestion(textQuestion);

      try {
        await saveHistory({
          userId: req.user?.id || "demoUser",
          type: "voice",
          input: textQuestion,
          output: textAnswer,
          meta: { language: selectedLanguage, mode: "browser-transcript" },
        });
      } catch (historyError) {
        console.warn("History save failed:", historyError.message);
      }

      return successResponse(
        res,
        {
          textQuestion,
          textAnswer,
          audioAnswerUrl: null,
        },
        "Voice transcript response generated successfully"
      );
    }

    if (!audioFile) {
      return errorResponse(res, "Audio file is required", 400);
    }

    const result = await handleVoiceInput(audioFile.path, {
      language: selectedLanguage,
      mimeType: audioFile.mimetype,
    });

    try {
      await saveHistory({
        userId: req.user?.id || "demoUser",
        type: "voice",
        input: result.textQuestion,
        output: result.textAnswer,
        meta: { language: selectedLanguage },
      });
    } catch (historyError) {
      console.warn("History save failed:", historyError.message);
    }

    return successResponse(
      res,
      {
        textQuestion: result.textQuestion,
        textAnswer: result.textAnswer,
        audioAnswerUrl: result.audioAnswerUrl,
      },
      "Voice response generated successfully"
    );
  } catch (error) {
    console.error("Voice chatbot error:", error.message);
    return errorResponse(res, "Voice chatbot failed");
  } finally {
    if (audioFile?.path) {
      await fs.unlink(audioFile.path).catch(() => {});
    }
  }
};

module.exports = { processVoiceQuestion };
