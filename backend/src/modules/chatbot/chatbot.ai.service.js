const OpenAI = require("openai");

let openaiClient;

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return openaiClient;
};

const askOpenAI = async (question) => {
  const openai = getOpenAIClient();

  if (!openai) {
    console.warn("⚠️ OPENAI_API_KEY is missing. Using chatbot fallback response.");
    return null;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an agriculture assistant for Indian farmers. Answer in simple words.",
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0.4,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("❌ OpenAI Error:", error.message);
    return null;
  }
};

module.exports = { askOpenAI };
