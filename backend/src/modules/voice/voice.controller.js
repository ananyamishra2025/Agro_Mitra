const fs = require("fs/promises");
const { handleVoiceInput } = require("./voice.service");

const processVoiceQuestion = async (req, res) => {
  const audioFile = req.file;

  try {
    // 🌍 Default language = Bengali
    const { language } = req.body;
    const selectedLanguage = language || "bn-IN";

    if (!audioFile) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required"
      });
    }

    const result = await handleVoiceInput(audioFile.path, {
      language: selectedLanguage,
      mimeType: audioFile.mimetype
    });

    res.json({
      success: true,
      textQuestion: result.textQuestion,
      textAnswer: result.textAnswer,
      audioAnswerUrl: result.audioAnswerUrl
    });

  } catch (error) {
    console.error("Voice chatbot error:", error.message);
    res.status(500).json({
      success: false,
      message: "Voice chatbot failed"
    });
  } finally {
    // 🧹 Clean temporary uploaded file
    if (audioFile?.path) {
      await fs.unlink(audioFile.path).catch(() => {});
    }
  }
};

module.exports = { processVoiceQuestion };
