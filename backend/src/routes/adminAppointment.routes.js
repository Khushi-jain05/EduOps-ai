const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");

const {
  getAppointments,
  updateAppointment,
  regenerateLink,
} = require("../controllers/adminAppointment.controller");

router.get("/", auth, getAppointments);
router.put("/:id", auth, updateAppointment);
router.post("/:id/regenerate-link", auth, regenerateLink);

module.exports = router;
