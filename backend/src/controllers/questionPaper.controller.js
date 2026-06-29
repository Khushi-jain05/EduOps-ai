import {
  generatePaper,
  fetchPapers,
} from "../services/questionPaper.service.js";

export const generateQuestionPaper = async (req, res) => {
  try {
    const paper = await generatePaper(req.body);

    res.status(201).json(paper);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

export const getQuestionPapers = async (req, res) => {
  try {
    const papers = await fetchPapers();

    res.json(papers);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};