const prisma = require("../config/prisma");
const { askGemini } = require("./gemini.service");
const {
  chunkText,
  cleanText,
  extractFileText,
  rankChunks,
  truncate,
} = require("../utils/fileText");

const MAX_CONTEXT_CHARS = 12000;
const MAX_UPLOAD_CHARS = 45000;

const getUserId = (user) => user?.id || user?.userId || user?.sub;

const isFaculty = (user) => user?.role === "faculty";
const isStudent = (user) => user?.role === "student";

const normalizeText = (value) =>
  value === undefined || value === null ? "" : value.toString().trim();

const validateAssignmentPayload = async (data, facultyId) => {
  const title = normalizeText(data.title);
  const subjectId = normalizeText(data.subject_id);
  const dueDateRaw = data.due_date || data.dueDate;

  if (!title) {
    throw new Error("Title is required");
  }

  if (!subjectId) {
    throw new Error("Subject is required");
  }

  if (!dueDateRaw) {
    throw new Error("Due date is required");
  }

  const dueDate = new Date(dueDateRaw);

  if (Number.isNaN(dueDate.getTime())) {
    throw new Error("Due date format is invalid");
  }

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
  });

  if (!subject) {
    throw new Error("Subject not found");
  }

  const totalMarks = Number(data.total_marks || data.totalMarks || 100);

  return {
    title,
    description: normalizeText(data.description),
    subject_id: subjectId,
    faculty_id: facultyId,
    due_date: dueDate,
    total_marks: Number.isFinite(totalMarks) && totalMarks > 0 ? totalMarks : 100,
    status: normalizeText(data.status) || "active",
    semester: normalizeText(data.semester || subject.semester),
    section: normalizeText(data.section),
    branch: normalizeText(data.branch || subject.program),
  };
};

const parseAiJson = (response) => {
  const clean = String(response)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("AI returned invalid JSON");
  }
};

const generateAssignmentDraft = async (data, user, file) => {
  if (!isFaculty(user)) {
    throw new Error("Only faculty can generate assignments");
  }

  const facultyId = getUserId(user);
  const subjectId = normalizeText(data.subject_id);
  const topic = normalizeText(data.topic || data.title);

  if (!subjectId) {
    throw new Error("Subject is required");
  }

  const uploadedText = await extractFileText(file);

  if (!uploadedText && !topic) {
    throw new Error("Upload a PDF/PPT/file or enter a topic to generate from.");
  }

  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });

  if (!subject) {
    throw new Error("Subject not found");
  }

  const [questionBank, studyMaterials] = await Promise.all([
    prisma.question_bank.findMany({
      where: { subject_id: subjectId, faculty_id: facultyId },
      take: 40,
      orderBy: { created_at: "desc" },
    }),
    prisma.study_materials.findMany({
      where: { subject_id: subjectId, faculty_id: facultyId },
      take: 20,
      orderBy: { created_at: "desc" },
    }),
  ]);

  const materialText = [
    uploadedText,
    ...studyMaterials.map((material) => material.extracted_text || ""),
    ...questionBank.map(
      (item) => `Question: ${item.question}\nAnswer: ${item.answer || "Not provided"}`
    ),
  ]
    .filter(Boolean)
    .join("\n\n")
    .slice(0, MAX_UPLOAD_CHARS);

  const chunks = chunkText(materialText);
  const rankedContext = chunks.length
    ? rankChunks(chunks, `${subject.name} ${topic}`)
    : "";

  const prompt = `
Generate one academic assignment brief using retrieval augmented generation.

Use the retrieved context as the source of truth when available. If uploaded content exists, prioritize it over generic subject knowledge. Do not invent facts that conflict with the context.

Subject:
${subject.code || ""} ${subject.name}

Topic or focus:
${topic || "Derive an appropriate topic from the retrieved context"}

Retrieved context:
${truncate(rankedContext || materialText, MAX_CONTEXT_CHARS) || "No context provided"}

Return ONLY valid JSON matching this schema:
{
  "title": "Concise assignment title",
  "description": "Clear instructions for students, written as 3-6 sentences or a short bulleted list, grounded in the provided context",
  "total_marks": 100
}
`;

  const response = await askGemini(prompt);
  const draft = parseAiJson(response);

  return {
    title: cleanText(draft.title || topic || "Untitled Assignment"),
    description: cleanText(draft.description || ""),
    total_marks: Number(draft.total_marks) || 100,
    subject_id: subjectId,
    used_upload: Boolean(uploadedText),
  };
};

const matchesTarget = (assignment, student) => {
  const studentBranch = normalizeText(student.branch || student.program);
  const studentSemester = normalizeText(student.semester);
  const studentSection = normalizeText(student.section);
  const subjectBranch = normalizeText(assignment.Subject?.program);
  const subjectSemester = normalizeText(assignment.Subject?.semester);

  if (assignment.semester && assignment.semester !== studentSemester) {
    return false;
  }

  if (assignment.branch && assignment.branch !== studentBranch) {
    return false;
  }

  if (assignment.section && assignment.section !== studentSection) {
    return false;
  }

  if (subjectSemester && studentSemester && subjectSemester !== studentSemester) {
    return false;
  }

  if (subjectBranch && studentBranch && subjectBranch !== studentBranch) {
    return false;
  }

  return true;
};

const getMatchingStudents = async (assignment) => {
  const students = await prisma.user.findMany({ where: { role: "student" } });
  return students.filter((student) => matchesTarget(assignment, student));
};

const syncSubmissionsForMatchingStudents = async (assignment) => {
  const students = await getMatchingStudents(assignment);

  if (students.length === 0) {
    return;
  }

  const existing = await prisma.assignment_submissions.findMany({
    where: { assignment_id: assignment.id },
    select: { student_id: true },
  });

  const existingIds = new Set(existing.map((row) => row.student_id));
  const missing = students.filter((student) => !existingIds.has(student.id));

  if (missing.length === 0) {
    return;
  }

  await prisma.assignment_submissions.createMany({
    data: missing.map((student) => ({
      assignment_id: assignment.id,
      student_id: student.id,
    })),
  });
};

const notifyStudents = async (assignment, { title, verb }) => {
  const students = await getMatchingStudents(assignment);

  if (students.length === 0) {
    return;
  }

  await prisma.notifications.createMany({
    data: students.map((student) => ({
      user_id: student.id,
      title,
      message: `${assignment.Subject?.name || "Assignment"}: ${assignment.title} has been ${verb}. Due ${assignment.due_date.toDateString()}.`,
      type: "assignment",
      reference_id: assignment.id,
    })),
  });
};

const withStats = (assignment) => {
  const submissions = assignment.assignment_submissions || [];
  const totalStudents = submissions.length;
  const submittedCount = submissions.filter((s) => s.status !== "pending").length;
  const gradedCount = submissions.filter((s) => s.status === "graded").length;
  const gradedScores = submissions
    .filter((s) => s.status === "graded" && s.score !== null && s.score !== undefined)
    .map((s) => (s.score / (assignment.total_marks || 100)) * 100);

  const avgScorePct = gradedScores.length
    ? Math.round(gradedScores.reduce((sum, v) => sum + v, 0) / gradedScores.length)
    : null;

  const { assignment_submissions, ...rest } = assignment;

  return {
    ...rest,
    total_students: totalStudents,
    submitted_count: submittedCount,
    graded_count: gradedCount,
    avg_score_pct: avgScorePct,
    submissions: assignment_submissions,
  };
};

const getAssignmentForFaculty = async (id, facultyId) => {
  const assignment = await prisma.assignment.findFirst({
    where: { id, faculty_id: facultyId },
    include: {
      Subject: true,
      assignment_submissions: { include: { User: true } },
    },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  return assignment;
};

const createAssignment = async (data, user) => {
  if (!isFaculty(user)) {
    throw new Error("Only faculty can create assignments");
  }

  const payload = await validateAssignmentPayload(data, getUserId(user));

  const assignment = await prisma.assignment.create({
    data: payload,
    include: { Subject: true, assignment_submissions: true },
  });

  await syncSubmissionsForMatchingStudents(assignment);
  await notifyStudents(assignment, {
    title: "New assignment posted",
    verb: "posted",
  });

  return withStats(await getAssignmentForFaculty(assignment.id, assignment.faculty_id));
};

const getAssignments = async (user) => {
  if (!isFaculty(user)) {
    throw new Error("Only faculty can list managed assignments");
  }

  const assignments = await prisma.assignment.findMany({
    where: { faculty_id: getUserId(user) },
    include: {
      Subject: true,
      assignment_submissions: true,
    },
    orderBy: { due_date: "desc" },
  });

  return assignments.map(withStats);
};

const getAssignmentById = async (id, user) => {
  if (!isFaculty(user)) {
    throw new Error("Only faculty can view managed assignments");
  }

  return withStats(await getAssignmentForFaculty(id, getUserId(user)));
};

const updateAssignment = async (id, data, user) => {
  if (!isFaculty(user)) {
    throw new Error("Only faculty can update assignments");
  }

  await getAssignmentForFaculty(id, getUserId(user));

  const payload = await validateAssignmentPayload(data, getUserId(user));

  const assignment = await prisma.assignment.update({
    where: { id },
    data: payload,
    include: { Subject: true, assignment_submissions: true },
  });

  await syncSubmissionsForMatchingStudents(assignment);
  await notifyStudents(assignment, {
    title: "Assignment updated",
    verb: "updated",
  });

  return withStats(await getAssignmentForFaculty(assignment.id, assignment.faculty_id));
};

const deleteAssignment = async (id, user) => {
  if (!isFaculty(user)) {
    throw new Error("Only faculty can delete assignments");
  }

  await getAssignmentForFaculty(id, getUserId(user));

  await prisma.assignment.delete({ where: { id } });
};

const getStudentAssignments = async (studentId, user) => {
  if (!isStudent(user) || getUserId(user) !== studentId) {
    throw new Error("Students can only view their own assignments");
  }

  const submissions = await prisma.assignment_submissions.findMany({
    where: { student_id: studentId },
    include: {
      Assignment: {
        include: { Subject: true },
      },
    },
    orderBy: { created_at: "desc" },
  });

  const now = new Date();

  return submissions
    .filter((row) => row.Assignment)
    .map((row) => {
      const assignment = row.Assignment;
      const overdue = row.status === "pending" && new Date(assignment.due_date) < now;

      return {
        submission_id: row.id,
        assignment_id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        subject: assignment.Subject?.name,
        subject_code: assignment.Subject?.code,
        faculty: assignment.Subject?.faculty,
        due_date: assignment.due_date,
        total_marks: assignment.total_marks,
        status: overdue ? "Overdue" : row.status[0].toUpperCase() + row.status.slice(1),
        file_url: row.file_url,
        submitted_at: row.submitted_at,
        score: row.score,
        feedback: row.feedback,
      };
    });
};

const submitAssignment = async (assignmentId, user, data) => {
  if (!isStudent(user)) {
    throw new Error("Only students can submit assignments");
  }

  const studentId = getUserId(user);

  const submission = await prisma.assignment_submissions.findUnique({
    where: {
      assignment_id_student_id: {
        assignment_id: assignmentId,
        student_id: studentId,
      },
    },
  });

  if (!submission) {
    throw new Error("Assignment not found for this student");
  }

  return prisma.assignment_submissions.update({
    where: { id: submission.id },
    data: {
      status: "submitted",
      file_url: normalizeText(data.file_url || data.link),
      submitted_at: new Date(),
    },
  });
};

const gradeSubmission = async (assignmentId, studentId, data, user) => {
  if (!isFaculty(user)) {
    throw new Error("Only faculty can grade submissions");
  }

  await getAssignmentForFaculty(assignmentId, getUserId(user));

  const score = Number(data.score);

  if (!Number.isFinite(score) || score < 0) {
    throw new Error("A valid score is required");
  }

  const submission = await prisma.assignment_submissions.findUnique({
    where: {
      assignment_id_student_id: {
        assignment_id: assignmentId,
        student_id: studentId,
      },
    },
  });

  if (!submission) {
    throw new Error("Submission not found");
  }

  const updated = await prisma.assignment_submissions.update({
    where: { id: submission.id },
    data: {
      status: "graded",
      score,
      feedback: normalizeText(data.feedback),
    },
  });

  await prisma.notifications.create({
    data: {
      user_id: studentId,
      title: "Assignment graded",
      message: `Your submission has been graded: ${score}.`,
      type: "assignment",
      reference_id: assignmentId,
    },
  });

  return updated;
};

module.exports = {
  createAssignment,
  deleteAssignment,
  generateAssignmentDraft,
  getAssignmentById,
  getAssignments,
  getStudentAssignments,
  getUserId,
  gradeSubmission,
  submitAssignment,
  updateAssignment,
};
