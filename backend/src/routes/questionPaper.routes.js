const express = require("express");

const {
  generatePaper,
  getAllPapers,
  getPaperById,
  deletePaper,
} = require("../controllers/questionPaper.controller");

const router = express.Router();

router.post("/generate", generatePaper);

router.get("/", getAllPapers);

router.get("/:id", getPaperById);

router.delete("/:id", deletePaper);

module.exports = router;