const prisma = require("../config/prisma");

const toTimeLabel = (date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const normalizeLessonPlanTime = (item) => {
  if (!item.lesson_plans?.start_time) {
    return item;
  }

  return {
    ...item,
    startTime: toTimeLabel(item.lesson_plans.start_time),
  };
};

exports.getDashboard = async (req, res) => {
  try {

    console.log("REQ USER =>", req.user);

    const userId =
      req.user.id ||
      req.user.userId ||
      req.user.sub;

    console.log("USER ID =>", userId);

    const attendance =
      await prisma.attendance.findFirst({
        where: { userId },
      });

    const assignments =
      await prisma.assignment.findMany({
        where: { userId },
        orderBy: {
          dueDate: "asc",
        },
      });

    const timetable =
      await prisma.timetable.findMany({
        where: { userId },
        include: {
          lesson_plans: {
            include: {
              Subject: true,
            },
          },
        },
        orderBy: {
          startTime: "asc",
        },
      });

    const notifications =
      await prisma.notifications.findMany({
        where: { user_id: userId },
        orderBy: {
          created_at: "desc",
        },
        take: 5,
      });

    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10);

    const visibleTimetable = timetable.filter((item) => {
      if (!item.lesson_plans?.lesson_date) {
        return true;
      }

      return (
        item.lesson_plans.lesson_date
          .toISOString()
          .slice(0, 10) === todayKey
      );
    });

    console.log("ATTENDANCE =>", attendance);
    console.log("ASSIGNMENTS =>", assignments.length);
    console.log("TIMETABLE =>", visibleTimetable.length);

    res.status(200).json({
      attendance:
        attendance?.percentage || 0,

      upcomingClasses:
        visibleTimetable.length,

      pendingAssignments:
        assignments.length,

      timetable: visibleTimetable.map(normalizeLessonPlanTime),

      assignments,

      notifications,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
