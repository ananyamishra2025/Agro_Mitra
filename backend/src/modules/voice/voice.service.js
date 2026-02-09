const speech = require("@google-cloud/speech");
const fs = require("fs");

const client = new speech.SpeechClient();

const speechToText = async (audioFilePath, languageCode = "hi-IN") => {
  const file = fs.readFileSync(audioFilePath);
  const audioBytes = file.toString("base64");

  const request = {
    audio: { content: audioBytes },
    config: {
      encoding: "WEBM_OPUS",
      sampleRateHertz: 48000,
      languageCode, // hi-IN / bn-IN
    },
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(r => r.alternatives[0].transcript)
    .join(" ");

  return transcription;
};

module.exports = { speechToText };
