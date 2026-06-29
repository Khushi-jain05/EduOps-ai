import express from "express";
import {
  generateQuestionPaper,
  getQuestionPapers,
} from "../controllers/questionPaper.controller.js";

const router = express.Router();

router.post("/generate", generateQuestionPaper);
router.get("/", getQuestionPapers);

export default router;