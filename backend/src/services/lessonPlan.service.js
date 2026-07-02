const prisma = require("../config/prisma");

const createLesson = async (data) => {
  // Check subject exists
  const subject = await prisma.subject.findUnique({
    where: {
      id: data.subject_id,
    },
  });

  if (!subject) {
    throw new Error("Subject not found");
  }

  // Create lesson plan
  const lesson = await prisma.lessonPlan.create({
    data: {
      title: data.title,
      topic: data.topic,
      subject_id: data.subject_id,
      faculty_id: data.facultyId,

      lesson_date: new Date(data.lesson_date),

      day: data.day,
      start_time: data.start_time,
      duration: Number(data.duration),

      room: data.room,

      weeks: Number(data.weeks || 1),
      sessions: Number(data.sessions || 1),

      objectives: data.objectives || [],
      outcomes: data.outcomes || [],

      notes: data.notes || "",

      status: data.status || "active",
    },
  });

  // Automatically create timetable entry
  await prisma.timetable.create({
    data: {
      title: lesson.title,

      subjectId: lesson.subject_id,

      facultyId: lesson.faculty_id,

      day: lesson.day,

      startTime: lesson.start_time,

      duration: lesson.duration,

      room: lesson.room,

      lessonPlanId: lesson.id,

      type: "lesson",
    },
  });

  return lesson;
};

const getLessonPlans = async (facultyId) => {
  return prisma.lessonPlan.findMany({
    where: {
      faculty_id: facultyId,
    },
    include: {
      Subject: true,
    },
    orderBy: {
      lesson_date: "asc",
    },
  });
};

const getLessonById = async (id) => {
  return prisma.lessonPlan.findUnique({
    where: {
      id,
    },
    include: {
      Subject: true,
    },
  });
};

const updateLesson = async (id, data) => {
  const lesson = await prisma.lessonPlan.update({
    where: {
      id,
    },
    data: {
      title: data.title,
      topic: data.topic,

      lesson_date: new Date(data.lesson_date),

      day: data.day,

      start_time: data.start_time,

      duration: Number(data.duration),

      room: data.room,

      objectives: data.objectives,

      outcomes: data.outcomes,

      notes: data.notes,

      status: data.status,
    },
  });

  // Keep timetable in sync
  await prisma.timetable.updateMany({
    where: {
      lessonPlanId: id,
    },
    data: {
      title: lesson.title,

      day: lesson.day,

      startTime: lesson.start_time,

      duration: lesson.duration,

      room: lesson.room,
    },
  });

  return lesson;
};

const deleteLesson = async (id) => {
  // Remove timetable entry first
  await prisma.timetable.deleteMany({
    where: {
      lessonPlanId: id,
    },
  });

  // Delete lesson
  return prisma.lessonPlan.delete({
    where: {
      id,
    },
  });
};

module.exports = {
  createLesson,
  getLessonPlans,
  getLessonById,
  updateLesson,
  deleteLesson,
};