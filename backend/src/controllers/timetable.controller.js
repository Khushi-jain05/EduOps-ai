const prisma = require("../config/prisma");

const toTimeLabel = (date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const getUserId = (user) =>
  user?.id || user?.userId || user?.sub;

const lessonMatchesStudent = (lesson, student) => {
  const subject = lesson.Subject;

  if (!subject) return false;

  if (subject.program && subject.program !== student.program) {
    return false;
  }

  if (subject.semester && subject.semester !== student.semester) {
    return false;
  }

  return true;
};

const syncMissingLessonPlansForStudent = async (userId) => {
  const student = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!student || student.role !== "student") {
    return;
  }

  const [lessons, existingEntries] = await Promise.all([
    prisma.lesson_plans.findMany({
      where: {
        status: "active",
      },
      include: {
        Subject: true,
        User: true,
      },
    }),
    prisma.timetable.findMany({
      where: {
        userId,
        source: "lesson_plan",
        lessonplanid: {
          not: null,
        },
      },
      select: {
        lessonplanid: true,
      },
    }),
  ]);

  const existingLessonIds = new Set(
    existingEntries.map((entry) => entry.lessonplanid)
  );

  const missingLessons = lessons.filter(
    (lesson) =>
      !existingLessonIds.has(lesson.id) &&
      lessonMatchesStudent(lesson, student)
  );

  if (missingLessons.length === 0) {
    return;
  }

  await prisma.timetable.createMany({
    data: missingLessons.map((lesson) => ({
      subject: lesson.Subject.name,
      faculty:
        lesson.Subject.faculty ||
        lesson.User?.username ||
        "Faculty",
      room: lesson.room || "TBA",
      startTime: toTimeLabel(lesson.start_time),
      duration: Number(lesson.duration || 60),
      day: lesson.day || "",
      category: "Lesson Plan",
      userId,
      lessonplanid: lesson.id,
      source: "lesson_plan",
    })),
  });
};

const normalizeLessonPlanTime = (item) => {
  if (!item.lesson_plans?.start_time) {
    return item;
  }

  return {
    ...item,
    code: item.lesson_plans.Subject?.code || item.code,
    lessonDate: item.lesson_plans.lesson_date,
    startTime: toTimeLabel(item.lesson_plans.start_time),
  };
};

exports.getTimetable = async (req, res) => {
  try {
    const userId = getUserId(req.user);

    await syncMissingLessonPlansForStudent(userId);

    const timetable = await prisma.timetable.findMany({
      where: {
        userId,
      },
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
        userId: getUserId(req.user),
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
