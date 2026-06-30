const express = require("express");
const auth = require("../middleware/auth.middleware");

const {
  generatePaper,
  getAllPapers,
  getPaperById,
  getSharedPaper,
  downloadPaper,
  updatePublishStatus,
  deletePaper,
} = require("../controllers/questionPaper.controller");

const router = express.Router();

router.post("/generate", auth, generatePaper);

router.get("/", auth, getAllPapers);

router.get("/share/:token", getSharedPaper);

router.get("/:id/download", auth, downloadPaper);

router.patch("/:id/publish", auth, updatePublishStatus);

router.get("/:id", auth, getPaperById);

router.delete("/:id", auth, deletePaper);

module.exports = router;
