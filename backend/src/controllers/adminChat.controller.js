const AdminChatService = require("../services/adminChat.service");

const isAdmin = (user) => user?.role === "admin";

const sendError = (res, error, fallback = "Admin chat request failed") => {
  console.error("[admin-chat]", error);

  const message = error.message || fallback;
  const status =
    message.includes("Only admin")
      ? 403
      : message.includes("not found")
        ? 404
        : message.includes("required")
          ? 400
          : 500;

  res.status(status).json({ message });
};

const getChats = async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      throw new Error("Only admin can access Admission Assist chats");
    }
    const chats = await AdminChatService.getChats(req.user);
    res.json(chats);
  } catch (error) {
    sendError(res, error, "Failed to fetch chats");
  }
};

const getChatMessages = async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      throw new Error("Only admin can access Admission Assist chats");
    }
    const chat = await AdminChatService.getChatMessages(req.params.id, req.user);
    res.json(chat);
  } catch (error) {
    sendError(res, error, "Failed to fetch chat");
  }
};

const sendMessage = async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      throw new Error("Only admin can use Admission Assist");
    }
    const { chatId, message } = req.body;
    const result = await AdminChatService.sendMessage(chatId, message, req.user);
    res.json({ success: true, ...result });
  } catch (error) {
    sendError(res, error, "Failed to send message");
  }
};

module.exports = {
  getChats,
  getChatMessages,
  sendMessage,
};
