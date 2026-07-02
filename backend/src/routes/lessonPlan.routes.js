const express = require("express");
const auth = require("../middleware/auth.middleware");

const {
  createLessonPlan,
  getLessonPlans,
  getLessonPlanById,
  updateLessonPlan,
  deleteLessonPlan,
} = require("../controllers/lessonPlan.controller");

const router = express.Router();

router.post("/", auth, createLessonPlan);

router.get("/", auth, getLessonPlans);

router.get("/:id", auth, getLessonPlanById);

router.put("/:id", auth, updateLessonPlan);

router.delete("/:id", auth, deleteLessonPlan);

module.exports = router;