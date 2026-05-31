const { askGroq } = require("./chatbot.ai.service");

// 🔹 Rule-based answers (fast, farmer-friendly, works offline)
const ruleBasedAnswers = (question) => {
  if (typeof question !== "string") return null;

  const q = question.toLowerCase();

  if (q.includes("winter")) {
    return "In winter season, wheat, mustard, potato and peas are good crops.";
  }

  if (q.includes("summer")) {
    return "In summer season, rice, maize, cotton and groundnut are good crops.";
  }

  if (q.includes("fertilizer")) {
    return "Use fertilizer as per soil need. Too much fertilizer can harm crops.";
  }

  if (q.includes("yellow")) {
    return "Yellow leaves may be due to lack of nutrients, pest attack, or excess water. Check soil and reduce irrigation if needed.";
  }

  return null;
};

// 🔥 MAIN FUNCTION (controller MUST call this)
const processQuestion = async (question) => {
  if (!question || typeof question !== "string") {
    throw new Error("Invalid question format");
  }

  // 1️⃣ Rule-based first (reliable & free)
  const ruleAnswer = ruleBasedAnswers(question);
  if (ruleAnswer) {
    return ruleAnswer;
  }

  // 2️⃣ Groq fallback (AI-powered)
  const aiAnswer = await askGroq(question);
  if (aiAnswer) {
    return aiAnswer;
  }

  // 3️⃣ Final fallback
  return "Please ask the question in simple words.";
};

module.exports = { processQuestion };
