const express = require("express");
const auth = require("../middleware/auth.middleware");

const {
  advanceApplication,
  askAdmissions,
  bookAppointment,
  getAppointments,
  getDashboard,
  getPrograms,
} = require("../controllers/applicant.controller");

const router = express.Router();

router.get("/dashboard", auth, getDashboard);
router.get("/programs", auth, getPrograms);
router.post("/application/advance", auth, advanceApplication);
router.get("/appointments", auth, getAppointments);
router.post("/appointments", auth, bookAppointment);
router.post("/ask", auth, askAdmissions);

module.exports = router;
