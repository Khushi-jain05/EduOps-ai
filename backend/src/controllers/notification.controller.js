const prisma = require("../config/prisma");

const getUserId = (user) =>
  user?.id || user?.userId || user?.sub;

exports.getNotifications = async (req, res) => {
  try {
    const userId = getUserId(req.user);

    const notifications = await prisma.notifications.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.json(notifications);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const userId = getUserId(req.user);

    const notification = await prisma.notifications.updateMany({
      where: {
        id: req.params.id,
        user_id: userId,
      },
      data: {
        is_read: true,
      },
    });

    res.json(notification);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update notification",
    });
  }
};

exports.markAllNotificationsRead = async (req, res) => {
  try {
    const userId = getUserId(req.user);

    await prisma.notifications.updateMany({
      where: {
        user_id: userId,
      },
      data: {
        is_read: true,
      },
    });

    res.json({
      message: "Notifications marked as read",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update notifications",
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const userId = getUserId(req.user);

    await prisma.notifications.deleteMany({
      where: {
        id: req.params.id,
        user_id: userId,
      },
    });

    res.json({
      message: "Notification dismissed",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to dismiss notification",
    });
  }
};

exports.clearNotifications = async (req, res) => {
  try {
    const userId = getUserId(req.user);

    await prisma.notifications.deleteMany({
      where: {
        user_id: userId,
      },
    });

    res.json({
      message: "Notifications cleared",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to clear notifications",
    });
  }
};
