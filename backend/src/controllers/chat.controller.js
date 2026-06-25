const prisma = require("../config/prisma");
const { askGemini } = require("../services/gemini.service");

/* ---------------- SEND MESSAGE ---------------- */

exports.sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    // Ask AI
    const aiReply = await askGemini(message);

    let chat = null;

    // Existing chat
    if (chatId && chatId !== "new") {
      chat = await prisma.chat.findFirst({
        where: {
          id: chatId,
          userId,
        },
      });
    }

    // Create new chat
    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          userId,
          title: message.trim().slice(0, 30),
        },
      });
    }

    // Save user + assistant messages
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

    return res.status(200).json({
      success: true,
      chatId: chat.id,
      assistant: {
        role: "assistant",
        content: aiReply,
      },
    });

  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ---------------- GET ALL CHATS ---------------- */

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

    return res.status(200).json(chats);

  } catch (error) {
    console.error("GET CHATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
    });
  }
};

/* ---------------- GET SINGLE CHAT ---------------- */

exports.getChatMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const chat = await prisma.chat.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    return res.status(200).json(chat);

  } catch (error) {
    console.error("GET CHAT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};