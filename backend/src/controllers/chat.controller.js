const prisma = require("../config/prisma");

const {
  askGemini,
} = require("../services/gemini.service");

exports.sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;

    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const aiReply = await askGemini(message);

    const chat = await prisma.chat.create({
      data: {
        userId,
        title: message.trim().slice(0, 30),
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

    return res.json({
      reply: aiReply,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
}
exports.getChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await prisma.chat.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(chats);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch chats",
    });
  }
};