const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const {
  getDashboard,
} = require("../controllers/faculty.controller");

const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboard);

module.exports = router;
