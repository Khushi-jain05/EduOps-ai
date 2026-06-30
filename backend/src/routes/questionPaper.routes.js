const express = require("express");
const auth = require("../middleware/auth.middleware");

const {
  generatePaper,
  getAllPapers,
  getPaperById,
  deletePaper,
} = require("../controllers/questionPaper.controller");

const router = express.Router();

router.post("/generate", auth, generatePaper);

router.get("/", auth, getAllPapers);

router.get("/:id", auth, getPaperById);

router.delete("/:id", auth, deletePaper);

module.exports = router;
