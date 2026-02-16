const { generateAdvisory } = require("../advisory/advisory.service");
const { processQuestion } = require("../chatbot/chatbot.service");

const runDemo = async () => {
  // 🔹 Predefined Demo Inputs
  const advisoryInput = {
    location: "Kolkata",
    season: "winter",
    soilType: "loamy",
    landSize: "2 acres"
  };

  // 1️⃣ Generate Advisory
  const advisoryResult = await generateAdvisory(advisoryInput);

  // 2️⃣ Ask Chatbot Demo Question
  const chatbotQuestion = "My crop leaves are turning yellow. What should I do?";
  const chatbotAnswer = await processQuestion(chatbotQuestion);

  return {
    advisoryInput,
    advisoryResult,
    chatbotQuestion,
    chatbotAnswer
  };
};

module.exports = { runDemo };
