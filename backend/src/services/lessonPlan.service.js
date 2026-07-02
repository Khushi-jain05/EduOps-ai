const prisma = require("../config/prisma");

const getUserId = (user) =>
  user?.id || user?.userId || user?.sub;

const toStartTime = (startTime) => {
  if (!startTime) {
    throw new Error("Start time is required");
  }

  return new Date(`1970-01-01T${startTime}:00`);
};

const toTimeLabel = (date) =>
  date.toISOString().substring(11, 16);

const findLessonForFaculty = async (id, facultyId) => {
  const lesson = await prisma.lesson_plans.findFirst({
    where: {
      id,
      faculty_id: facultyId,
    },
    include: {
      Subject: true,
      User: true,
    },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  return lesson;
};

const getMatchingStudents = async (subject) => {
  const studentWhere = {
    role: "student",
  };

  if (subject.program) {
    studentWhere.program = subject.program;
  }

  if (subject.semester) {
    studentWhere.semester = subject.semester;
  }

  const students = await prisma.user.findMany({
    where: studentWhere,
    select: {
      id: true,
    },
  });

  if (students.length > 0 || subject.program || subject.semester) {
    return students;
  }

  return prisma.user.findMany({
    where: {
      role: "student",
    },
    select: {
      id: true,
    },
  });
};

const syncStudentTimetables = async (lesson, subject) => {
  const students = await getMatchingStudents(subject);

  await prisma.timetable.deleteMany({
    where: {
      lessonplanid: lesson.id,
      source: "lesson_plan",
    },
  });

  if (students.length === 0) {
    return;
  }

  await prisma.timetable.createMany({
    data: students.map((student) => ({
      subject: subject.name,
      faculty:
        subject.faculty ||
        lesson.User?.username ||
        "Faculty",
      room: lesson.room || "TBA",
      startTime: toTimeLabel(lesson.start_time),
      duration: Number(lesson.duration || 60),
      day: lesson.day || "",
      category: "Lesson Plan",
      userId: student.id,
      lessonplanid: lesson.id,
      source: "lesson_plan",
    })),
  });
};

const notifyStudentsForLesson = async (lesson, subject) => {
  const students = await getMatchingStudents(subject);

  if (students.length === 0) {
    return;
  }

  await prisma.notifications.createMany({
    data: students.map((student) => ({
      user_id: student.id,
      title: "New lesson plan added",
      message: `${subject.name}: ${lesson.title} has been scheduled for ${lesson.day || "the selected day"} at ${toTimeLabel(lesson.start_time)}.`,
      type: "lesson_plan",
      reference_id: lesson.id,
    })),
  });
};

const createLesson = async (data) => {
  const subject = await prisma.subject.findUnique({
    where: {
      id: data.subject_id,
    },
  });

  if (!subject) {
    throw new Error("Subject not found");
  }

  if (!data.title || !data.lesson_date || !data.start_time) {
    throw new Error(
      "Title, lesson date and start time are required"
    );
  }

  const facultyId = data.facultyId || data.faculty_id;

  if (!facultyId) {
    throw new Error("Faculty id is required");
  }

  const lesson = await prisma.lesson_plans.create({
    data: {
      title: data.title,
      topic: data.topic || "",
      description: data.description || "",
      objectives: Array.isArray(data.objectives)
        ? data.objectives.join("\n")
        : data.objectives || "",
      lesson_date: new Date(data.lesson_date),
      start_time: toStartTime(data.start_time),
      duration: String(data.duration || "60"),
      room: data.room || "",
      status: data.status || "active",
      faculty_id: facultyId,
      subject_id: data.subject_id,
      day: data.day || "",
      sessions: Number(data.sessions || 1),
      weeks: Number(data.weeks || 1),
      outcomes: data.outcomes || null,
      notes: data.notes || "",
    },
    include: {
      Subject: true,
      User: true,
    },
  });

  await syncStudentTimetables(lesson, subject);
  await notifyStudentsForLesson(lesson, subject);

  return lesson;
};

const getLessonPlans = async (facultyId) => {
  return prisma.lesson_plans.findMany({
    where: {
      faculty_id: facultyId,
    },
    include: {
      Subject: true,
      User: true,
    },
    orderBy: {
      lesson_date: "desc",
    },
  });
};

const getLessonById = async (id, facultyId) => {
  return findLessonForFaculty(id, facultyId);
};

const updateLesson = async (id, data, facultyId) => {
  await findLessonForFaculty(id, facultyId);

  const updateData = {
    title: data.title,
    topic: data.topic || "",
    description: data.description || "",
    objectives: Array.isArray(data.objectives)
      ? data.objectives.join("\n")
      : data.objectives || "",
    duration: String(data.duration || "60"),
    room: data.room || "",
    day: data.day || "",
    sessions: Number(data.sessions || 1),
    weeks: Number(data.weeks || 1),
    outcomes: data.outcomes || null,
    notes: data.notes || "",
    status: data.status || "active",
    updated_at: new Date(),
  };

  if (data.lesson_date) {
    updateData.lesson_date = new Date(data.lesson_date);
  }

  if (data.start_time) {
    updateData.start_time = toStartTime(data.start_time);
  }

  const lesson = await prisma.lesson_plans.update({
    where: {
      id,
    },
    data: updateData,
    include: {
      Subject: true,
      User: true,
    },
  });

  await syncStudentTimetables(lesson, lesson.Subject);

  return lesson;
};

const deleteLesson = async (id, facultyId) => {
  await findLessonForFaculty(id, facultyId);

  return prisma.lesson_plans.delete({
    where: {
      id,
    },
  });
};

module.exports = {
  createLesson,
  deleteLesson,
  getLessonById,
  getLessonPlans,
  getUserId,
  updateLesson,
};
