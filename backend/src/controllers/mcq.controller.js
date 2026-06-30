const McqService = require("../services/mcq.service");

const generateMcq = async (req, res) => {
  try {
    const mcq = await McqService.generateMcqSet({
      ...req.body,
      facultyId: req.user.id,
    });

    res.status(201).json(mcq);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

const getAllMcqs = async (req, res) => {
  try {
    const mcqs = await McqService.getAllMcqSets(req.user.id);

    res.json(mcqs);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const publishMcq = async (req, res) => {
  try {
    const mcq = await McqService.publishMcq(
      req.params.id,
      req.user.id
    );

    res.json(mcq);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deleteMcq = async (req, res) => {
  try {
    await McqService.deleteMcq(req.params.id);

    res.json({
      message: "Deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getMcqById = async (req, res) => {
  try {
    const mcq = await McqService.getMcqById(req.params.id);

    res.json(mcq);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  generateMcq,
  getAllMcqs,
  publishMcq,
  deleteMcq,
  getMcqById,
};