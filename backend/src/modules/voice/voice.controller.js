const { speechToText } = require("./voice.service");
const { textToVoice } = require("./tts.service");
const { processQuestion } = require("../chatbot/chatbot.service");

exports.voiceChat = async (req, res) => {
  try {
    const audioPath = req.file.path;

    const text = await speechToText(audioPath, "hi-IN");
    const answer = await processQuestion(text);
    const audioReply = await textToVoice(answer, "hi-IN");

    res.json({
      success: true,
      text,
      answer,
      audioReply,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Voice processing failed" });
  }
};
