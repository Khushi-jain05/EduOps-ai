const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");

const {
  getStatus,
  syncNow,
  updateSheetUrl,
} = require("../controllers/googleSheet.controller");

router.get("/", auth, getStatus);
router.post("/sync", auth, syncNow);
router.put("/", auth, updateSheetUrl);

module.exports = router;
