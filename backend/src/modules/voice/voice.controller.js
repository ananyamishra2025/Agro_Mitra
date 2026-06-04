const fs = require("fs/promises");
const { handleVoiceInput } = require("./voice.service");
const { processQuestion } = require("../chatbot/chatbot.service");
const { saveHistory } = require("../history/history.service");
const { successResponse, errorResponse } = require("../../utils/response");

const limitSpeechAnswer = (answer) => {
  if (answer.length <= 900) return answer;

  const sentences = answer
    .split(/(?<=[।.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length > 1) {
    return sentences.slice(0, 7).join(" ");
  }

  return `${answer.slice(0, 900).trim()}...`;
};

const makeSpeechFriendlyAnswer = (answer = "") =>
  limitSpeechAnswer(String(answer)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/^\s{0,3}#{1,6}\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s*\|?[-:\s|]{4,}\|?\s*$/gm, "")
    .replace(/^\s*\|/gm, "")
    .replace(/\|\s*$/gm, "")
    .replace(/\s*\|\s*/g, ". ")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\s{2,}/g, " ")
    .trim());

const processVoiceQuestion = async (req, res) => {
  const audioFile = req.file;

  try {
    const { language, textQuestion } = req.body;
    const selectedLanguage = language || "bn-IN";

    if (textQuestion && typeof textQuestion === "string") {
      const textAnswer = await processQuestion(textQuestion);
      const speechAnswer = makeSpeechFriendlyAnswer(textAnswer);

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
          speechAnswer,
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
        speechAnswer: result.speechAnswer || makeSpeechFriendlyAnswer(result.textAnswer),
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
