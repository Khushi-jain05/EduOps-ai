const express = require("express");
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const {
  generateMcq,
  getAllMcqs,
  publishMcq,
  deleteMcq,
  getMcqById,
  getSharedMcq,
  downloadMcq,
} = require("../controllers/mcq.controller");

const router = express.Router();

router.get("/shared/:token", getSharedMcq);

router.post("/generate", auth, upload.single("contentFile"), generateMcq);

router.get("/", auth, getAllMcqs);

router.patch("/:id/publish", auth, publishMcq);

router.get("/:id/download", auth, downloadMcq);

router.get("/:id", auth, getMcqById);

router.delete("/:id", auth, deleteMcq);

module.exports = router;
