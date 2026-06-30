const express = require("express");
const auth = require("../middleware/auth.middleware");

const {
  getUnitsBySubject,
} = require("../controllers/unit.controller");

const router = express.Router();

router.get(
  "/subject/:subjectId",
  auth,
  getUnitsBySubject
);

module.exports = router;