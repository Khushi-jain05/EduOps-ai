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
        userId: facultyId,
      },
      orderBy: {
        createdAt: "desc",
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
  };
};

module.exports = {
  getDashboard,
};
