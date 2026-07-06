const prisma = require("../config/prisma");

const getUserId = (user) => user?.id || user?.userId || user?.sub;

const timeAgo = (date) => {
  if (!date) return "";
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
};

const getFacultyProfile = async (userId) => {
  const [subjects, lessonPlans, questionPapers, mcqSets, assignments] =
    await Promise.all([
      prisma.subject.count({
        where: { OR: [{ userId }, { userId: null }] },
      }),
      prisma.lesson_plans.count({ where: { faculty_id: userId } }),
      prisma.question_papers.count({ where: { faculty_id: userId } }),
      prisma.mcq_sets.count({ where: { faculty_id: userId } }),
      prisma.assignment.count({ where: { faculty_id: userId } }),
    ]);

  const [recentLessons, recentPapers, recentMcqs, recentAssignments] =
    await Promise.all([
      prisma.lesson_plans.findMany({
        where: { faculty_id: userId },
        orderBy: { created_at: "desc" },
        take: 5,
        include: { Subject: true },
      }),
      prisma.question_papers.findMany({
        where: { faculty_id: userId },
        orderBy: { created_at: "desc" },
        take: 5,
      }),
      prisma.mcq_sets.findMany({
        where: { faculty_id: userId },
        orderBy: { created_at: "desc" },
        take: 5,
      }),
      prisma.assignment.findMany({
        where: { faculty_id: userId },
        orderBy: { created_at: "desc" },
        take: 5,
        include: { Subject: true },
      }),
    ]);

  const activity = [
    ...recentLessons.map((l) => ({
      id: `lesson-${l.id}`,
      title: `Created lesson plan: ${l.title}`,
      description: l.Subject?.name || "",
      createdAt: l.created_at,
    })),
    ...recentPapers.map((p) => ({
      id: `paper-${p.id}`,
      title: `Generated question paper: ${p.title}`,
      description: "",
      createdAt: p.created_at,
    })),
    ...recentMcqs.map((m) => ({
      id: `mcq-${m.id}`,
      title: `Generated MCQ set: ${m.title}`,
      description: "",
      createdAt: m.created_at,
    })),
    ...recentAssignments.map((a) => ({
      id: `assignment-${a.id}`,
      title: `Posted assignment: ${a.title}`,
      description: a.Subject?.name || "",
      createdAt: a.created_at,
    })),
  ]
    .filter((item) => item.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)
    .map((item) => ({ ...item, time: timeAgo(item.createdAt) }));

  return {
    stats: { subjects, lessonPlans, questionPapers, mcqSets, assignments },
    activity,
  };
};

const getApplicantProfile = async (userId) => {
  const [applicant, programsOpen, appointments] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.program.count({ where: { is_open: true } }),
    prisma.appointment.findMany({
      where: { applicant_id: userId },
      orderBy: { slot: "desc" },
      take: 6,
    }),
  ]);

  const step = applicant?.applicationStep || 0;

  const activity = appointments.map((a) => ({
    id: a.id,
    title: `Counseling ${a.mode === "campus" ? "campus visit" : "video call"} ${a.status}`,
    description: new Date(a.slot).toLocaleString(),
    time: timeAgo(a.created_at),
  }));

  return {
    stats: {
      applicationStep: step,
      progressPercent: Math.round((step / 5) * 100),
      programsOpen,
      appointments: appointments.length,
    },
    activity,
  };
};

const getStudentProfile = async (userId) => {
  const [assignments, attendance, exams, subjects, submissions] =
    await Promise.all([
      prisma.assignment_submissions.count({ where: { student_id: userId } }),
      prisma.attendance.findFirst({ where: { userId } }),
      prisma.exam.count({ where: { userId } }),
      prisma.subject.count({ where: { userId } }),
      prisma.assignment_submissions.findMany({
        where: { student_id: userId },
        orderBy: { updated_at: "desc" },
        take: 6,
        include: { Assignment: { include: { Subject: true } } },
      }),
    ]);

  const activity = submissions
    .filter((s) => s.Assignment)
    .map((s) => ({
      id: s.id,
      title:
        s.status === "graded"
          ? `Graded: ${s.Assignment.title} (${s.score}/${s.Assignment.total_marks})`
          : s.status === "submitted"
            ? `Submitted: ${s.Assignment.title}`
            : `Assigned: ${s.Assignment.title}`,
      description: s.Assignment.Subject?.name || "",
      time: timeAgo(s.updated_at),
    }));

  return {
    stats: {
      assignments,
      attendance: attendance?.percentage || 0,
      exams,
      subjects,
    },
    activity,
  };
};

exports.getProfile = async (req, res) => {
  try {
    const userId = getUserId(req.user);

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const details =
      user.role === "faculty"
        ? await getFacultyProfile(userId)
        : user.role === "applicant"
          ? await getApplicantProfile(userId)
          : await getStudentProfile(userId);

    res.json({
      user,
      stats: details.stats,
      activity: details.activity,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = getUserId(req.user);

    const {
      username,
      phone,
      dob,
      city,
      program,
      semester,
      studentId,
      address,
      about,
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        phone,
        dob,
        city,
        program,
        semester,
        studentId,
        address,
        about,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
