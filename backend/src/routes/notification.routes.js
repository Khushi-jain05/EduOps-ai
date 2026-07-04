const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const {
  clearNotifications,
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} = require("../controllers/notification.controller");

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.patch("/read-all", authMiddleware, markAllNotificationsRead);
router.patch("/:id/read", authMiddleware, markNotificationRead);
router.delete("/", authMiddleware, clearNotifications);
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;
