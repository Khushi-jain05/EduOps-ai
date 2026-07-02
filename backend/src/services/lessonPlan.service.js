const prisma = require("../config/prisma");

// ==========================
// Create Lesson
// ==========================
const createLesson = async (data) => {
  // Find Subject
  const subject = await prisma.subject.findUnique({
    where: {
      id: data.subject_id,
    },
  });

  if (!subject) {
    throw new Error("Subject not found");
  }

  // Create Lesson
  const lesson = await prisma.lesson_plans.create({
    data: {
      title: data.title,
      topic: data.topic || "",
      description: data.description || "",

      objectives: Array.isArray(data.objectives)
        ? data.objectives.join("\n")
        : data.objectives || "",

      lesson_date: new Date(data.lesson_date),

      start_time: new Date(
        `1970-01-01T${data.start_time}:00`
      ),

      duration: String(data.duration || "60"),

      room: data.room || "",

      status: data.status || "active",

      faculty_id: data.facultyId,

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

  // ==========================
  // Find matching students
  // ==========================

  const students = await prisma.user.findMany({
    where: {
      role: "student",
      semester: subject.semester,
      program: subject.program,
    },
  });

  // ==========================
  // Create Timetable Entries
  // ==========================

  for (const student of students) {
    await prisma.timetable.create({
      data: {
        subject: subject.name,

        faculty: subject.faculty,

        room: lesson.room || "TBA",

        startTime: lesson.start_time
          .toISOString()
          .substring(11, 16),

        duration: Number(lesson.duration),

        day: lesson.day,

        category: "Lesson Plan",

        userId: student.id,
      },
    });
  }

  return lesson;
};

// ==========================
// Get All Lessons
// ==========================

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

// ==========================
// Get Lesson By ID
// ==========================

const getLessonById = async (id) => {
  return prisma.lesson_plans.findUnique({
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
  return prisma.lesson_plans.update({
    where: {
      id,
    },

    data: {
      title: data.title,

      topic: data.topic || "",

      description: data.description || "",

      objectives: Array.isArray(data.objectives)
        ? data.objectives.join("\n")
        : data.objectives || "",

      lesson_date: new Date(data.lesson_date),

      start_time: new Date(
        `1970-01-01T${data.start_time}:00`
      ),

      duration: String(data.duration || "60"),

      room: data.room || "",

      day: data.day || "",

      sessions: Number(data.sessions || 1),

      weeks: Number(data.weeks || 1),

      outcomes: data.outcomes || null,

      notes: data.notes || "",

      status: data.status || "active",
    },
  });
};

// ==========================
// Delete Lesson
// ==========================

const deleteLesson = async (id) => {
  return prisma.lesson_plans.delete({
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