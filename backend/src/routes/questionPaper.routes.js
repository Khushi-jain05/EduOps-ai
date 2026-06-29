import express from "express";
import {
  generatePaper,
  getAllPapers,
  getPaperById,
  deletePaper,
} from "../controllers/questionPaper.controller.js";

const router = express.Router();

router.post("/generate", generatePaper);

router.get("/", getAllPapers);

router.get("/:id", getPaperById);

router.delete("/:id", deletePaper);

export default router;