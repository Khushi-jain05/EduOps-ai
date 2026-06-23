const express = require("express");

const router = express.Router();

const {
  getAssignments,
  createAssignment,
  getAssignmentById,
  deleteAssignment,
} = require("../controllers/assignment.controller");

const authMiddleware =
  require("../middleware/auth.middleware");

router.get(
  "/",
  authMiddleware,
  getAssignments
);

router.get(
  "/:id",
  authMiddleware,
  getAssignmentById
);

router.post(
  "/",
  authMiddleware,
  createAssignment
);

router.delete(
  "/:id",
  authMiddleware,
  deleteAssignment
);

module.exports = router;