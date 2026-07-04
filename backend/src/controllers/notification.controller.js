const prisma = require("../config/prisma");

const getUserId = (user) =>
  user?.id || user?.userId || user?.sub;

const toTimeLabel = (date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const ensureLessonNotifications = async (user) => {
  const userId = getUserId(user);

  if (user.role === "faculty") {
    const lessons = await prisma.lesson_plans.findMany({
      where: {
        faculty_id: userId,
      },
      include: {
        Subject: true,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 20,
    });

    for (const lesson of lessons) {
      const exists = await prisma.notifications.findFirst({
        where: {
          user_id: userId,
          reference_id: lesson.id,
          type: "lesson_plan",
        },
      });

      if (!exists) {
        await prisma.notifications.create({
          data: {
            user_id: userId,
            title: "Lesson plan published",
            message: `${lesson.title} is scheduled for ${lesson.Subject?.name || "your subject"} on ${lesson.day || "the selected day"} at ${toTimeLabel(lesson.start_time)}.`,
            type: "lesson_plan",
            reference_id: lesson.id,
          },
        });
      }
    }

    return;
  }

  const lessonEntries = await prisma.timetable.findMany({
    where: {
      userId,
      source: "lesson_plan",
      lessonplanid: {
        not: null,
      },
    },
    include: {
      lesson_plans: {
        include: {
          Subject: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  for (const entry of lessonEntries) {
    const lesson = entry.lesson_plans;

    if (!lesson) continue;

    const exists = await prisma.notifications.findFirst({
      where: {
        user_id: userId,
        reference_id: lesson.id,
        type: "lesson_plan",
      },
    });

    if (!exists) {
      await prisma.notifications.create({
        data: {
          user_id: userId,
          title: "New lesson plan added",
          message: `${lesson.Subject?.name || entry.subject}: ${lesson.title} has been scheduled for ${lesson.day || "the selected day"} at ${toTimeLabel(lesson.start_time)}.`,
          type: "lesson_plan",
          reference_id: lesson.id,
        },
      });
    }
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const userId = getUserId(req.user);

    await ensureLessonNotifications(req.user);

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
