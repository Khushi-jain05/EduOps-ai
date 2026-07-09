const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");

const {
  getChats,
  getChatMessages,
  sendMessage,
} = require("../controllers/adminChat.controller");

router.get("/", auth, getChats);
router.get("/:id", auth, getChatMessages);
router.post("/message", auth, sendMessage);

module.exports = router;
