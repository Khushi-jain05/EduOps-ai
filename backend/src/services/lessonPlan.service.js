const prisma = require("../config/prisma");

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const asArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
};

const getDayName = (date) => DAY_NAMES[new Date(date).getDay()];

const getFacultyName = async (facultyId) => {
  const user = await prisma.user.findUnique({
    where: { id: facultyId },
    select: { username: true, email: true },
  });

  return user?.username || user?.email || "Faculty";
};

const syncLessonToStudentTimetable = async (lessonPlan) => {
  if (lessonPlan.status === "draft") {
    await prisma.timetable.deleteMany({
      where: { lessonPlanId: lessonPlan.id },
    });
    return;
  }

  const students = await prisma.user.findMany({
    where: { role: "student" },
    select: { id: true },
  });

  const facultyName = await getFacultyName(lessonPlan.faculty_id);
  const subjectName = lessonPlan.Subject?.name || lessonPlan.topic;
  const subjectCode = lessonPlan.Subject?.code || "Lesson";

  await prisma.timetable.deleteMany({
    where: { lessonPlanId: lessonPlan.id },
  });

  if (students.length === 0) return;

  await prisma.timetable.createMany({
    data: students.map((student) => ({
      subject: `${subjectCode} · ${lessonPlan.topic}`,
      faculty: facultyName,
      room: lessonPlan.room || "TBA",
      day: lessonPlan.day,
      category: subjectName,
      startTime: lessonPlan.start_time,
      duration: lessonPlan.duration,
      userId: student.id,
      eventDate: lessonPlan.lesson_date,
      lessonPlanId: lessonPlan.id,
      source: "lesson_plan",
    })),
  });
};

const getLessonPlans = async (facultyId) => {
  return prisma.lessonPlan.findMany({
    where: { faculty_id: facultyId },
    include: { Subject: true },
    orderBy: [{ lesson_date: "asc" }, { start_time: "asc" }],
  });
};

const createLessonPlan = async (facultyId, payload) => {
  const {
    title,
    topic,
    subjectId,
    lessonDate,
    startTime,
    duration,
    room,
    sessions,
    weeks,
    status,
    objectives,
    outcomes,
    notes,
  } = payload;

  if (!title?.trim()) throw new Error("Title is required");
  if (!topic?.trim()) throw new Error("Topic is required");
  if (!subjectId) throw new Error("Subject is required");
  if (!lessonDate) throw new Error("Lesson date is required");
  if (!startTime) throw new Error("Start time is required");

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject) throw new Error("Subject not found");

  const planDate = new Date(lessonDate);

  const lessonPlan = await prisma.lessonPlan.create({
    data: {
      title: title.trim(),
      topic: topic.trim(),
      subject_id: subjectId,
      faculty_id: facultyId,
      lesson_date: planDate,
      day: getDayName(planDate),
      start_time: startTime,
      duration: Number(duration) || 1,
      room: room?.trim() || "TBA",
      sessions: Number(sessions) || 1,
      weeks: Number(weeks) || 1,
      status: status || "active",
      objectives: asArray(objectives),
      outcomes: asArray(outcomes),
      notes: notes?.trim() || null,
    },
    include: { Subject: true },
  });

  await syncLessonToStudentTimetable(lessonPlan);

  return lessonPlan;
};

const updateLessonPlan = async (facultyId, id, payload) => {
  const existing = await prisma.lessonPlan.findFirst({
    where: { id, faculty_id: facultyId },
  });

  if (!existing) throw new Error("Lesson plan not found");

  const planDate = payload.lessonDate
    ? new Date(payload.lessonDate)
    : existing.lesson_date;

  const lessonPlan = await prisma.lessonPlan.update({
    where: { id },
    data: {
      title: payload.title?.trim() || existing.title,
      topic: payload.topic?.trim() || existing.topic,
      subject_id: payload.subjectId || existing.subject_id,
      lesson_date: planDate,
      day: getDayName(planDate),
      start_time: payload.startTime || existing.start_time,
      duration: Number(payload.duration) || existing.duration,
      room: payload.room?.trim() || existing.room,
      sessions: Number(payload.sessions) || existing.sessions,
      weeks: Number(payload.weeks) || existing.weeks,
      status: payload.status || existing.status,
      objectives:
        payload.objectives === undefined
          ? existing.objectives
          : asArray(payload.objectives),
      outcomes:
        payload.outcomes === undefined
          ? existing.outcomes
          : asArray(payload.outcomes),
      notes:
        payload.notes === undefined
          ? existing.notes
          : payload.notes?.trim() || null,
      updated_at: new Date(),
    },
    include: { Subject: true },
  });

  await syncLessonToStudentTimetable(lessonPlan);

  return lessonPlan;
};

const deleteLessonPlan = async (facultyId, id) => {
  const existing = await prisma.lessonPlan.findFirst({
    where: { id, faculty_id: facultyId },
  });

  if (!existing) throw new Error("Lesson plan not found");

  await prisma.timetable.deleteMany({
    where: { lessonPlanId: id },
  });

  await prisma.lessonPlan.delete({
    where: { id },
  });
};

module.exports = {
  getLessonPlans,
  createLessonPlan,
  updateLessonPlan,
  deleteLessonPlan,
};
