const Groq = require("groq-sdk");

const askGemini = async (prompt) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are EduOps AI, an academic assistant for students and faculty. Follow the requested output format exactly.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      });

    return completion.choices[0].message.content;

  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  askGemini,
};
