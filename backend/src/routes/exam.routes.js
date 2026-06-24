const express = require("express");
const router = express.Router();
const {getExams,
  downloadTimetable,
} = require("../controllers/exam.controller");


const authMiddleware =
  require("../middleware/auth.middleware");
router.get(
  "/download",
  authMiddleware,
  downloadTimetable
);
router.get(
  "/",
  authMiddleware,
  getExams
);

module.exports = router;