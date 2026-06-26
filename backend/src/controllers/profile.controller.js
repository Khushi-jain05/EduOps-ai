const prisma = require("../config/prisma");

exports.getProfile = async (req, res) => {

  try {

    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });

    }

    const assignments =
      await prisma.assignment.count({
        where: {
          userId,
        },
      });

    const attendance =
      await prisma.attendance.findFirst({
        where: {
          userId,
        },
      });

    const exams =
      await prisma.exam.count({
        where: {
          userId,
        },
      });

    const subjects =
      await prisma.subject.count({
        where: {
          userId,
        },
      });

    return res.json({

      user,

      stats: {

        assignments,

        attendance:
          attendance?.percentage || 0,

        exams,

        subjects,

      },

      activity: [],

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      message: "Server Error",

    });

  }

};