const prisma = require("../config/prisma");

const getUserId = (user) =>
  user?.id || user?.userId || user?.sub;

const isFaculty = (user) => user?.role === "faculty";
const isStudent = (user) => user?.role === "student";

const normalizeText = (value) =>
  value === undefined || value === null
    ? ""
    : value.toString().trim();

const normalizeTime = (value, fieldName) => {
  const time = normalizeText(value);

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    throw new Error(`${fieldName} must be in HH:mm format`);
  }

  return time;
};

const normalizeDate = (value) => {
  const date = normalizeText(value);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Date must be in YYYY-MM-DD format");
  }

  return new Date(`${date}T00:00:00.000Z`);
};

const dateKey = (value) =>
  value instanceof Date
    ? value.toISOString().slice(0, 10)
    : normalizeText(value).slice(0, 10);

const mapLecture = (lecture) => ({
  id: lecture.id,
  subject_id: lecture.subject_id,
  faculty_id: lecture.faculty_id,
  title: lecture.title,
  description: lecture.description || "",
  date: dateKey(lecture.date),
  start_time: lecture.start_time,
  end_time: lecture.end_time,
  classroom: lecture.classroom || "",
  meeting_link: lecture.meeting_link || "",
  semester: lecture.semester || "",
  section: lecture.section || "",
  branch: lecture.branch || "",
  created_at: lecture.created_at,
  updated_at: lecture.updated_at,
  Subject: lecture.Subject,
  User: lecture.User
    ? {
        id: lecture.User.id,
        username: lecture.User.username,
        email: lecture.User.email,
      }
    : undefined,
});

const validateLecturePayload = async (data, facultyId) => {
  const title = normalizeText(data.title);
  const subjectId = normalizeText(data.subject_id);
  const date = normalizeDate(data.date || data.lesson_date);
  const startTime = normalizeTime(
    data.start_time || data.startTime,
    "Start time"
  );
  const endTime = normalizeTime(
    data.end_time || data.endTime,
    "End time"
  );

  if (!title) {
    throw new Error("Title is required");
  }

  if (!subjectId) {
    throw new Error("Subject is required");
  }

  if (endTime <= startTime) {
    throw new Error("End time must be after start time");
  }

  const subject = await prisma.subject.findUnique({
    where: {
      id: subjectId,
    },
  });

  if (!subject) {
    throw new Error("Subject not found");
  }

  return {
    title,
    description: normalizeText(data.description),
    subject_id: subjectId,
    faculty_id: facultyId,
    date,
    start_time: startTime,
    end_time: endTime,
    classroom: normalizeText(data.classroom || data.room),
    meeting_link: normalizeText(data.meeting_link || data.meetingLink),
    semester: normalizeText(data.semester || subject.semester),
    section: normalizeText(data.section),
    branch: normalizeText(data.branch || subject.program),
  };
};

const getLectureForFaculty = async (id, facultyId) => {
  const lecture = await prisma.lecture.findFirst({
    where: {
      id,
      faculty_id: facultyId,
    },
    include: {
      Subject: true,
      User: true,
    },
  });

  if (!lecture) {
    throw new Error("Lecture not found");
  }

  return lecture;
};

const createLecture = async (data, user) => {
  if (!isFaculty(user)) {
    throw new Error("Only faculty can create lectures");
  }

  const payload = await validateLecturePayload(data, getUserId(user));

  const lecture = await prisma.lecture.create({
    data: payload,
    include: {
      Subject: true,
      User: true,
    },
  });

  return mapLecture(lecture);
};

const getLectures = async (user) => {
  if (!isFaculty(user)) {
    throw new Error("Only faculty can list managed lectures");
  }

  const lectures = await prisma.lecture.findMany({
    where: {
      faculty_id: getUserId(user),
    },
    include: {
      Subject: true,
      User: true,
    },
    orderBy: [{ date: "desc" }, { start_time: "asc" }],
  });

  return lectures.map(mapLecture);
};

const getLectureById = async (id, user) => {
  if (!isFaculty(user)) {
    throw new Error("Only faculty can view managed lectures");
  }

  return mapLecture(await getLectureForFaculty(id, getUserId(user)));
};

const updateLecture = async (id, data, user) => {
  if (!isFaculty(user)) {
    throw new Error("Only faculty can update lectures");
  }

  await getLectureForFaculty(id, getUserId(user));

  const payload = await validateLecturePayload(data, getUserId(user));

  const lecture = await prisma.lecture.update({
    where: {
      id,
    },
    data: payload,
    include: {
      Subject: true,
      User: true,
    },
  });

  return mapLecture(lecture);
};

const deleteLecture = async (id, user) => {
  if (!isFaculty(user)) {
    throw new Error("Only faculty can delete lectures");
  }

  await getLectureForFaculty(id, getUserId(user));

  await prisma.lecture.delete({
    where: {
      id,
    },
  });
};

const matchesTarget = (lecture, student) => {
  const studentBranch = normalizeText(student.branch || student.program);
  const studentSemester = normalizeText(student.semester);
  const studentSection = normalizeText(student.section);
  const subjectBranch = normalizeText(lecture.Subject?.program);
  const subjectSemester = normalizeText(lecture.Subject?.semester);

  if (lecture.semester && lecture.semester !== studentSemester) {
    return false;
  }

  if (lecture.branch && lecture.branch !== studentBranch) {
    return false;
  }

  if (lecture.section && lecture.section !== studentSection) {
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

const getStudentLectures = async (studentId, user) => {
  if (!isStudent(user) || getUserId(user) !== studentId) {
    throw new Error("Students can only view their own lectures");
  }

  const student = await prisma.user.findUnique({
    where: {
      id: studentId,
    },
  });

  if (!student || student.role !== "student") {
    throw new Error("Student not found");
  }

  const lectures = await prisma.lecture.findMany({
    include: {
      Subject: true,
      User: true,
    },
    orderBy: [{ date: "asc" }, { start_time: "asc" }],
  });

  return lectures.filter((lecture) => matchesTarget(lecture, student)).map(mapLecture);
};

module.exports = {
  createLecture,
  deleteLecture,
  getLectureById,
  getLectures,
  getStudentLectures,
  getUserId,
  updateLecture,
};
