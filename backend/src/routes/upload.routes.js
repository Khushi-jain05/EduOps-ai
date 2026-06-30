const express = require("express");

const upload = require("../middleware/upload.middleware");

const {
  uploadNotes,
} = require("../controllers/upload.controller");

const router = express.Router();

router.post(
  "/notes",
  upload.single("file"),
  uploadNotes
);

module.exports = router;