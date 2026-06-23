const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");

const {
  getTimetable,
  createTimetable,
} = require("../controllers/timetable.controller");

router.get("/", auth, getTimetable);
router.post("/", auth, createTimetable);

module.exports = router;