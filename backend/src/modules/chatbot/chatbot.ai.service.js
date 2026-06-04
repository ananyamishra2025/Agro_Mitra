const Groq = require("groq-sdk");

const DEFAULT_MODEL = "openai/gpt-oss-120b";

let groqClient;

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    return null;
  }

  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  return groqClient;
};

const askGroq = async (question) => {
  const groq = getGroqClient();

  if (!groq) {
    console.warn("GROQ_API_KEY is missing. Using chatbot fallback response.");
    return null;
  }

  try {
    const response = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are Agro-Mitra, an agriculture assistant for Indian farmers, gardeners, and students. Give practical, safe, simple guidance. Format answers in clean Markdown with short paragraphs, bullet points, and clear section headings when helpful. Do not use HTML tags such as <br>. Avoid overly wide tables unless a table is clearly the best format. Mention that local agriculture experts should be consulted for high-risk decisions.",
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0.4,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    return response.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error("Groq API Error:", error.response?.data || error.message);
    return null;
  }
};

module.exports = { askGroq };
