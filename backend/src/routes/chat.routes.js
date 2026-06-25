const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  sendMessage,
  getChats,
} = require("../controllers/chat.controller");

router.get(
  "/",
  authMiddleware,
  getChats
);

router.post(
  "/message",
  authMiddleware,
  sendMessage
);

module.exports = router;