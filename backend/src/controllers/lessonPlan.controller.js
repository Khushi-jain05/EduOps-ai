const LessonPlanService = require("../services/lessonPlan.service");

const getLessonPlans = async (req, res) => {
  try {
    const plans = await LessonPlanService.getLessonPlans(req.user.id);
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLessonPlan = async (req, res) => {
  try {
    const plan = await LessonPlanService.createLessonPlan(req.user.id, req.body);
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLessonPlan = async (req, res) => {
  try {
    const plan = await LessonPlanService.updateLessonPlan(
      req.user.id,
      req.params.id,
      req.body
    );
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLessonPlan = async (req, res) => {
  try {
    await LessonPlanService.deleteLessonPlan(req.user.id, req.params.id);
    res.json({ message: "Lesson plan deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLessonPlans,
  createLessonPlan,
  updateLessonPlan,
  deleteLessonPlan,
};
