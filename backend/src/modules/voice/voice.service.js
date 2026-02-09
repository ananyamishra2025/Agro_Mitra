const fs = require("fs");
const path = require("path");
const speech = require("@google-cloud/speech");
const textToSpeech = require("@google-cloud/text-to-speech");
const { processQuestion } = require("../chatbot/chatbot.service");

const speechClient = new speech.SpeechClient();
const ttsClient = new textToSpeech.TextToSpeechClient();

const handleVoiceInput = async (audioPath, language = "hi-IN") => {
  // 1️⃣ Speech → Text
  const audioBytes = fs.readFileSync(audioPath).toString("base64");

  const request = {
    audio: { content: audioBytes },
    config: {
      encoding: "LINEAR16",
      languageCode: language
    }
  };

  const [response] = await speechClient.recognize(request);
  const textQuestion = response.results
    .map(r => r.alternatives[0].transcript)
    .join(" ");

  // 2️⃣ Text → Chatbot
  const textAnswer = await processQuestion(textQuestion);

  // 3️⃣ Text → Speech
  const ttsRequest = {
    input: { text: textAnswer },
    voice: {
      languageCode: language,
      ssmlGender: "NEUTRAL"
    },
    audioConfig: { audioEncoding: "MP3" }
  };

  const [ttsResponse] = await ttsClient.synthesizeSpeech(ttsRequest);

  const outputFile = `uploads/audio/answer-${Date.now()}.mp3`;
  fs.writeFileSync(outputFile, ttsResponse.audioContent, "binary");

  return {
    textQuestion,
    textAnswer,
    audioAnswerUrl: `/${outputFile}`
  };
};

module.exports = { handleVoiceInput };
