const express = require("express");
const auth = require("../middleware/auth.middleware");

const {
  createLecture,
  deleteLecture,
  getLectureById,
  getLectures,
  getStudentLectures,
  updateLecture,
} = require("../controllers/lecture.controller");

const router = express.Router();

router.post("/", auth, createLecture);
router.get("/", auth, getLectures);
router.get("/student/:studentId", auth, getStudentLectures);
router.get("/:id", auth, getLectureById);
router.put("/:id", auth, updateLecture);
router.delete("/:id", auth, deleteLecture);

module.exports = router;
