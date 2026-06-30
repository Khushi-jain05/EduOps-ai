const QuestionPaperService = require("../services/questionPaper.service");

const generatePaper = async (req, res) => {
  try {
    const paper = await QuestionPaperService.generatePaper(req.body);

    res.status(201).json(paper);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

const getAllPapers = async (req, res) => {
  try {
    const papers = await QuestionPaperService.getAllPapers();

    res.json(papers);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getPaperById = async (req, res) => {
  try {
    const paper = await QuestionPaperService.getPaperById(
      req.params.id
    );

    res.json(paper);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deletePaper = async (req, res) => {
  try {
    await QuestionPaperService.deletePaper(req.params.id);

    res.json({
      message: "Deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  generatePaper,
  getAllPapers,
  getPaperById,
  deletePaper,
};