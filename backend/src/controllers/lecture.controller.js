const LectureService = require("../services/lecture.service");

const sendError = (res, error, fallback = "Lecture request failed") => {
  console.error("[lectures]", error);

  const message = error.message || fallback;
  const status =
    message.includes("Only faculty") ||
    message.includes("Students can only")
      ? 403
      : message.includes("not found")
        ? 404
        : message.includes("required") ||
            message.includes("format") ||
            message.includes("after")
          ? 400
          : 500;

  res.status(status).json({
    message,
  });
};

const createLecture = async (req, res) => {
  try {
    const lecture = await LectureService.createLecture(req.body, req.user);

    res.status(201).json(lecture);
  } catch (error) {
    sendError(res, error, "Failed to create lecture");
  }
};

const getLectures = async (req, res) => {
  try {
    const lectures = await LectureService.getLectures(req.user);

    res.json(lectures);
  } catch (error) {
    sendError(res, error, "Failed to fetch lectures");
  }
};

const getStudentLectures = async (req, res) => {
  try {
    const lectures = await LectureService.getStudentLectures(
      req.params.studentId,
      req.user
    );

    res.json(lectures);
  } catch (error) {
    sendError(res, error, "Failed to fetch student lectures");
  }
};

const getLectureById = async (req, res) => {
  try {
    const lecture = await LectureService.getLectureById(
      req.params.id,
      req.user
    );

    res.json(lecture);
  } catch (error) {
    sendError(res, error, "Failed to fetch lecture");
  }
};

const updateLecture = async (req, res) => {
  try {
    const lecture = await LectureService.updateLecture(
      req.params.id,
      req.body,
      req.user
    );

    res.json(lecture);
  } catch (error) {
    sendError(res, error, "Failed to update lecture");
  }
};

const deleteLecture = async (req, res) => {
  try {
    await LectureService.deleteLecture(req.params.id, req.user);

    res.json({
      message: "Lecture deleted successfully",
    });
  } catch (error) {
    sendError(res, error, "Failed to delete lecture");
  }
};

module.exports = {
  createLecture,
  deleteLecture,
  getLectureById,
  getLectures,
  getStudentLectures,
  updateLecture,
};
