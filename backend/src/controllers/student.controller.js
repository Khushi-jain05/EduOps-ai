const prisma = require("../config/prisma");

exports.getDashboard = async (req, res) => {
  try {

    const userId = req.user.id;

    const attendance = await prisma.attendance.findFirst({
      where: {
        userId
      }
    });

    const assignments = await prisma.assignment.findMany({
      where: {
        userId
      },
      orderBy: {
        dueDate: "asc"
      }
    });

    const timetable = await prisma.timetable.findMany({
      where: {
        userId
      }
    });

    res.status(200).json({
      attendance,
      assignments,
      timetable
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};