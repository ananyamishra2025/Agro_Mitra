const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const path = require("path");

const client = new textToSpeech.TextToSpeechClient();

const textToVoice = async (text, languageCode = "hi-IN") => {
  const request = {
    input: { text },
    voice: {
      languageCode,
      ssmlGender: "NEUTRAL",
    },
    audioConfig: {
      audioEncoding: "MP3",
    },
  };

  const [response] = await client.synthesizeSpeech(request);

  const outputPath = path.join("uploads/audio", `reply-${Date.now()}.mp3`);
  fs.writeFileSync(outputPath, response.audioContent, "binary");

  return outputPath;
};

module.exports = { textToVoice };
