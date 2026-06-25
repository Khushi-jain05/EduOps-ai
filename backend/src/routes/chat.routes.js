const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  sendMessage,
  getChats,
  getChatMessages,
} = require("../controllers/chat.controller");

router.get(
  "/",
  authMiddleware,
  getChats
);
router.get(
  "/:id",
  authMiddleware,
  getChatMessages
);

router.post(
  "/message",
  authMiddleware,
  sendMessage
);

module.exports = router;