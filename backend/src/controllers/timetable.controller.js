const prisma = require("../config/prisma");

exports.getTimetable = async (req, res) => {
  try {
    const timetable = await prisma.timetable.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    res.json(timetable);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch timetable",
    });
  }
}; 

exports.createTimetable = async (req, res) => {

  try {

    const {
      subject,
      faculty,
      room,
      day,
      category,
      startTime,
      duration,
    } = req.body;

    const timetable =
      await prisma.timetable.create({
        data: {
          subject,
          faculty,
          room,
          day,
          category,
          startTime,
          duration,
          userId: req.user.id,
        },
      });

    res.status(201).json(timetable);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to create timetable",
    });
  }
};