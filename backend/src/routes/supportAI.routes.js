const express = require("express");
const router = express.Router();

const {
  createChat,
  getChats,
  getMessages,
  sendMessage
} = require("../controllers/supportAI.controller");

const auth = require("../middleware/auth.middleware");

router.post("/chat", auth, createChat);
router.get("/chat", auth, getChats);
router.get("/chat/:chatId", auth, getMessages);
router.post("/message", auth, sendMessage);

module.exports = router;