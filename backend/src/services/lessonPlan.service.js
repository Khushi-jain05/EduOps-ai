const prisma = require("../config/prisma");

// ==========================
// Create Lesson
// ==========================
const createLesson = async (data) => {
  const subject = await prisma.subject.findUnique({
    where: {
      id: data.subject_id,
    },
  });

  if (!subject) {
    throw new Error("Subject not found");
  }

  const lesson = await prisma.lessonPlan.create({
    data: {
      title: data.title,
      topic: data.topic,

      subject_id: data.subject_id,
      faculty_id: data.facultyId,

      lesson_date: new Date(data.lesson_date),

      day: data.day,
start_time: data.start_time,

      duration: data.duration,

      room: data.room || null,

      sessions: Number(data.sessions || 1),

      weeks: Number(data.weeks || 1),

      objectives: data.objectives || "",

      outcomes: data.outcomes || null,

      notes: data.notes || null,

     

      status: data.status || "active",
    },

    include: {
      Subject: true,
      User: true,
    },
  });

  return lesson;
};

// ==========================
// Get All Lessons
// ==========================
const getLessonPlans = async (facultyId) => {
  return prisma.lessonPlan.findMany({
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

// ==========================
// Get Lesson By ID
// ==========================
const getLessonById = async (id) => {
  return prisma.lessonPlan.findUnique({
    where: {
      id,
    },

    include: {
      Subject: true,
      User: true,
    },
  });
};

// ==========================
// Update Lesson
// ==========================
const updateLesson = async (id, data) => {
  return prisma.lessonPlan.update({
    where: {
      id,
    },

    data: {
      title: data.title,
      topic: data.topic,

      

      lesson_date: new Date(data.lesson_date),

      day: data.day,

      start_time: new Date(
        `1970-01-01T${data.start_time}:00`
      ),

      duration: data.duration,

      room: data.room,

      sessions: Number(data.sessions || 1),

      weeks: Number(data.weeks || 1),

      objectives: data.objectives,

      outcomes: data.outcomes,

      notes: data.notes,

      status: data.status,
    },
  });
};

// ==========================
// Delete Lesson
// ==========================
const deleteLesson = async (id) => {
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