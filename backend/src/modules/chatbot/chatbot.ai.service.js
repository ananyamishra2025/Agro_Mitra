const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const askOpenAI = async (question) => {
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
