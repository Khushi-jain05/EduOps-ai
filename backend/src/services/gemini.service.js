const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const askGemini = async (prompt) => {
  try {
    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are EduOps AI, a helpful study companion for students. Explain concepts clearly, step by step.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
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