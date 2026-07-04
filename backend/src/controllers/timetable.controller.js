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

exports.getTimetable = async (req, res) => {
  try {
    const timetable = await prisma.timetable.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        lesson_plans: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    res.json(timetable.map(normalizeLessonPlanTime));
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch timetable",
    });
  }
}; 

exports.createTimetable = async (req, res) => {
  try {

    console.log("========== CREATE TIMETABLE ==========");
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const {
      subject,
      faculty,
      room,
      day,
      category,
      startTime,
      duration,
    } = req.body;

    const timetable = await prisma.timetable.create({
      data: {
        subject,
        faculty,
        room,
        day,
        category,
        startTime,
        duration: Number(duration),
        userId: req.user.id,
      },
    });

    console.log("CREATED:", timetable);

    res.status(201).json(timetable);

  } catch (error) {

    console.log("========== ERROR ==========");
    console.log(error);

    res.status(500).json({
      message: "Failed to create timetable",
      error: error.message,
    });
  }
};
