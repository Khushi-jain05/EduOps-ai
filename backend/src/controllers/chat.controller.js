const prisma = require("../config/prisma");

const {
  askGemini,
} = require("../services/gemini.service");

exports.sendMessage = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const { message } = req.body;

    const aiReply =
      await askGemini(message);

    const chat =
      await prisma.chat.create({
        data: {
          userId,
          title:
            message.slice(0, 30),
        },
      });

    await prisma.message.createMany({
      data: [
        {
          chatId: chat.id,
          role: "user",
          content: message,
        },
        {
          chatId: chat.id,
          role: "assistant",
          content: aiReply,
        },
      ],
    });

    res.json({
      reply: aiReply,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};