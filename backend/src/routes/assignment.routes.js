const express = require("express");
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const {
  createAssignment,
  deleteAssignment,
  generateAssignment,
  getAssignmentById,
  getAssignments,
  getStudentAssignments,
  gradeSubmission,
  submitAssignment,
  updateAssignment,
} = require("../controllers/assignment.controller");

const router = express.Router();

router.post("/generate", auth, upload.single("contentFile"), generateAssignment);
router.post("/", auth, createAssignment);
router.get("/", auth, getAssignments);
router.get("/student/:studentId", auth, getStudentAssignments);
router.get("/:id", auth, getAssignmentById);
router.put("/:id", auth, updateAssignment);
router.delete("/:id", auth, deleteAssignment);
router.post("/:id/submit", auth, submitAssignment);
router.put("/:id/grade/:studentId", auth, gradeSubmission);

module.exports = router;
