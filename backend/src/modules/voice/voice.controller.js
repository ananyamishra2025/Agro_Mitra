const { handleVoiceInput } = require("./voice.service");

const processVoiceQuestion = async (req, res) => {
  try {
    const { language } = req.body;
    const audioFile = req.file;

    if (!audioFile) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required"
      });
    }

    const result = await handleVoiceInput(audioFile.path, language);

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
  }
};

module.exports = { processVoiceQuestion };
