const LessonPlanService = require("../services/lessonPlan.service");

const createLessonPlan = async (req, res) => {
  try {
    const lesson = await LessonPlanService.createLesson({
      ...req.body,
      facultyId: req.user.id,
    });

    res.status(201).json(lesson);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

const getLessonPlans = async (req, res) => {
  try {

    const lessons =
      await LessonPlanService.getLessonPlans(req.user.id);

    res.json(lessons);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
};

const getLessonPlanById = async (req, res) => {
  try {

    const lesson =
      await LessonPlanService.getLessonById(req.params.id);

    res.json(lesson);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
};

const updateLessonPlan = async (req, res) => {
  try {

    const lesson =
      await LessonPlanService.updateLesson(
        req.params.id,
        req.body
      );

    res.json(lesson);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteLessonPlan = async (req, res) => {
  try {

    await LessonPlanService.deleteLesson(req.params.id);

    res.json({
      message: "Lesson deleted",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createLessonPlan,
  getLessonPlans,
  getLessonPlanById,
  updateLessonPlan,
  deleteLessonPlan,
};