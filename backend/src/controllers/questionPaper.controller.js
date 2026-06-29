import * as QuestionPaperService from "../services/questionPaper.service.js";

export const generatePaper = async (req, res) => {
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

export const getAllPapers = async (req, res) => {
  try {
    const papers = await QuestionPaperService.getAllPapers();

    res.json(papers);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getPaperById = async (req, res) => {
  try {
    const paper =
      await QuestionPaperService.getPaperById(
        req.params.id
      );

    res.json(paper);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const deletePaper = async (req, res) => {
  try {
    await QuestionPaperService.deletePaper(
      req.params.id
    );

    res.json({
      message: "Deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};