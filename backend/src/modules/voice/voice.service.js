const fs = require("fs");
const path = require("path");
const speech = require("@google-cloud/speech");
const textToSpeech = require("@google-cloud/text-to-speech");
const { processQuestion } = require("../chatbot/chatbot.service");

let speechClient;
let ttsClient;

const getSpeechClient = () => {
  if (!speechClient) {
    speechClient = new speech.SpeechClient();
  }

  return speechClient;
};

const getTextToSpeechClient = () => {
  if (!ttsClient) {
    ttsClient = new textToSpeech.TextToSpeechClient();
  }

  return ttsClient;
};

// 🔹 Configure Speech Recognition
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

const resolveSpeechConfig = (mimeType, language) => {
  const config = {
    languageCode: language,
    enableAutomaticPunctuation: true
  };

  if (!mimeType) return config;

  const normalized = mimeType.toLowerCase();

  if (normalized.includes("webm")) {
    config.encoding = "WEBM_OPUS";
    config.sampleRateHertz = 48000;
  } else if (normalized.includes("ogg")) {
    config.encoding = "OGG_OPUS";
    config.sampleRateHertz = 48000;
  } else if (normalized.includes("wav")) {
    config.encoding = "LINEAR16";
  } else if (normalized.includes("mpeg") || normalized.includes("mp3")) {
    config.encoding = "MP3";
  }

  return config;
};

// 🔥 MAIN FUNCTION
const handleVoiceInput = async (
  audioPath,
  { language = "bn-IN", mimeType } = {} // ✅ Default Bengali
) => {
  try {
    // 1️⃣ Speech → Text
    const audioBytes = fs.readFileSync(audioPath).toString("base64");

    const request = {
      audio: { content: audioBytes },
      config: resolveSpeechConfig(mimeType, language)
    };

    const [response] = await getSpeechClient().recognize(request);

    const textQuestion = response.results?.length
      ? response.results.map(r => r.alternatives[0].transcript).join(" ")
      : "";

    if (!textQuestion) {
      throw new Error("Speech recognition returned no transcript.");
    }

    // 2️⃣ Text → Chatbot
    const textAnswer = await processQuestion(textQuestion);
    const speechAnswer = makeSpeechFriendlyAnswer(textAnswer);

    // 3️⃣ Text → Speech
    const ttsRequest = {
      input: { text: speechAnswer },
      voice: {
        languageCode: language,
        ssmlGender: "NEUTRAL"
      },
      audioConfig: {
        audioEncoding: "MP3"
      }
    };

    const [ttsResponse] = await getTextToSpeechClient().synthesizeSpeech(ttsRequest);

    // 4️⃣ Save MP3 Response
    const audioDir = path.resolve(process.cwd(), "uploads", "audio");
    fs.mkdirSync(audioDir, { recursive: true });

    const fileName = `answer-${Date.now()}.mp3`;
    const outputFile = path.join(audioDir, fileName);

    fs.writeFileSync(outputFile, ttsResponse.audioContent, "binary");

    return {
      textQuestion,
      textAnswer,
      speechAnswer,
      audioAnswerUrl: `/uploads/audio/${fileName}`
    };

  } catch (error) {
    console.error("Voice service error:", error.message);
    throw error;
  }
};

module.exports = { handleVoiceInput, makeSpeechFriendlyAnswer };
