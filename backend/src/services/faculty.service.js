const prisma = require("../config/prisma");

const getDashboard = async (facultyId) => {
  const todayKey = new Date().toISOString().slice(0, 10);

  const [
    subjects,
    assignments,
    lessonPlans,
    questionPapers,
    mcqSets,
  ] = await Promise.all([
    prisma.subject.findMany({
      where: {
        OR: [{ userId: facultyId }, { userId: null }],
      },
      orderBy: {
        code: "asc",
      },
    }),
    prisma.assignment.findMany({
      where: {
        faculty_id: facultyId,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 5,
    }),
    prisma.lesson_plans.findMany({
      where: {
        faculty_id: facultyId,
      },
      include: {
        Subject: true,
      },
      orderBy: {
        lesson_date: "desc",
      },
    }),
    prisma.question_papers.findMany({
      where: {
        faculty_id: facultyId,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 5,
    }),
    prisma.mcq_sets.findMany({
      where: {
        faculty_id: facultyId,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 5,
    }),
  ]);

  const todaysLessons = lessonPlans
    .filter(
      (lesson) =>
        lesson.lesson_date.toISOString().slice(0, 10) === todayKey
    )
    .sort((a, b) =>
      a.start_time.toISOString().localeCompare(b.start_time.toISOString())
    );

  const lessonActivities = lessonPlans.slice(0, 5).map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    type: "Lesson Plan",
    createdAt: lesson.created_at,
  }));

  const paperActivities = questionPapers.map((paper) => ({
    id: paper.id,
    title: paper.title,
    type: "Question Paper",
    createdAt: paper.created_at,
  }));

  const mcqActivities = mcqSets.map((mcq) => ({
    id: mcq.id,
    title: mcq.title,
    type: "MCQ Set",
    createdAt: mcq.created_at,
  }));

  const activities = [
    ...lessonActivities,
    ...paperActivities,
    ...mcqActivities,
  ]
    .filter((item) => item.createdAt)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 6);

  const productivity = await getProductivity(facultyId);

  return {
    stats: {
      subjectsAssigned: subjects.length,
      assignmentsGenerated: assignments.length,
      lessonPlans: lessonPlans.length,
      questionPapers: questionPapers.length,
    },
    upcomingClasses: todaysLessons.map((lesson) => ({
      id: lesson.id,
      time: lesson.start_time.toISOString().substring(11, 16),
      subject: lesson.Subject?.name || lesson.title,
      room: lesson.room || "TBA",
    })),
    recentActivity: activities,
    productivity,
  };
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getProductivity = async (facultyId) => {
  // Start of the window: 6 days ago at midnight (7-day rolling window).
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);

  const [papers, mcqs, lessons, allPapers, allMcqs, allLessons] =
    await Promise.all([
      prisma.question_papers.findMany({
        where: { faculty_id: facultyId, created_at: { gte: start } },
        select: { created_at: true },
      }),
      prisma.mcq_sets.findMany({
        where: { faculty_id: facultyId, created_at: { gte: start } },
        select: { created_at: true },
      }),
      prisma.lesson_plans.findMany({
        where: { faculty_id: facultyId, created_at: { gte: start } },
        select: { created_at: true },
      }),
      prisma.question_papers.count({ where: { faculty_id: facultyId } }),
      prisma.mcq_sets.count({ where: { faculty_id: facultyId } }),
      prisma.lesson_plans.count({ where: { faculty_id: facultyId } }),
    ]);

  // Build 7 day buckets (index 0 = 6 days ago, index 6 = today).
  const buckets = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    return { label: DAY_LABELS[day.getDay()], count: 0 };
  });

  const bucketIndex = (date) => {
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    return Math.round((day - start) / (24 * 60 * 60 * 1000));
  };

  [...papers, ...mcqs, ...lessons].forEach((item) => {
    if (!item.created_at) return;
    const index = bucketIndex(item.created_at);
    if (index >= 0 && index < 7) {
      buckets[index].count += 1;
    }
  });

  return {
    weekly: buckets,
    summary: {
      questionPapers: allPapers,
      mcqSets: allMcqs,
      lessonPlans: allLessons,
    },
  };
};

module.exports = {
  getDashboard,
};
