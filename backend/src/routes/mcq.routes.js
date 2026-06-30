const express = require("express");
const auth = require("../middleware/auth.middleware");

const {
  generateMcq,
  getAllMcqs,
  publishMcq,
  deleteMcq,
  getMcqById,
} = require("../controllers/mcq.controller");

const router = express.Router();

router.post("/generate", auth, generateMcq);

router.get("/", auth, getAllMcqs);

router.patch("/:id/publish", auth, publishMcq);

router.get("/:id", auth, getMcqById);

router.delete("/:id", auth, deleteMcq);

module.exports = router;