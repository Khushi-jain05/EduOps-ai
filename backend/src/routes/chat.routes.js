const router =
  require("express").Router();

const authMiddleware =
  require("../middleware/auth.middleware");

const {
  sendMessage,
} = require(
  "../controllers/chat.controller"
);

router.post(
  "/send",
  authMiddleware,
  sendMessage
);

module.exports = router;