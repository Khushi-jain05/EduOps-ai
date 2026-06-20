const prisma = require("../config/prisma");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const attendance = await prisma.attendance.findFirst({
      where: { userId },
    });

    const assignments = await prisma.assignment.findMany({
      where: { userId },
    });

    const timetable = await prisma.timetable.findMany({
      where: { userId },
    });

    res.json({
      user,
      attendance,
      assignments,
      timetable,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};