const prisma = require("../config/prisma");

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
      });

    console.log("ATTENDANCE =>", attendance);
    console.log("ASSIGNMENTS =>", assignments.length);
    console.log("TIMETABLE =>", timetable.length);

    res.status(200).json({
      attendance:
        attendance?.percentage || 0,

      upcomingClasses:
        timetable.length,

      pendingAssignments:
        assignments.length,

      timetable,

      assignments,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};