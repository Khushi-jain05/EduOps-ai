const AssignmentService = require("../services/assignment.service");

const sendError = (res, error, fallback = "Assignment request failed") => {
  console.error("[assignments]", error);

  const message = error.message || fallback;
  const status =
    message.includes("Only faculty") || message.includes("Students can only")
      ? 403
      : message.includes("not found")
        ? 404
        : message.includes("required") || message.includes("format") || message.includes("valid")
          ? 400
          : 500;

  res.status(status).json({ message });
};

const createAssignment = async (req, res) => {
  try {
    const assignment = await AssignmentService.createAssignment(req.body, req.user);
    res.status(201).json(assignment);
  } catch (error) {
    sendError(res, error, "Failed to create assignment");
  }
};

const generateAssignment = async (req, res) => {
  try {
    const draft = await AssignmentService.generateAssignmentDraft(
      req.body,
      req.user,
      req.file
    );
    res.json(draft);
  } catch (error) {
    sendError(res, error, "Failed to generate assignment");
  }
};

const getAssignments = async (req, res) => {
  try {
    const assignments = await AssignmentService.getAssignments(req.user);
    res.json(assignments);
  } catch (error) {
    sendError(res, error, "Failed to fetch assignments");
  }
};

const getStudentAssignments = async (req, res) => {
  try {
    const assignments = await AssignmentService.getStudentAssignments(
      req.params.studentId,
      req.user
    );
    res.json(assignments);
  } catch (error) {
    sendError(res, error, "Failed to fetch student assignments");
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const assignment = await AssignmentService.getAssignmentById(req.params.id, req.user);
    res.json(assignment);
  } catch (error) {
    sendError(res, error, "Failed to fetch assignment");
  }
};

const updateAssignment = async (req, res) => {
  try {
    const assignment = await AssignmentService.updateAssignment(
      req.params.id,
      req.body,
      req.user
    );
    res.json(assignment);
  } catch (error) {
    sendError(res, error, "Failed to update assignment");
  }
};

const deleteAssignment = async (req, res) => {
  try {
    await AssignmentService.deleteAssignment(req.params.id, req.user);
    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    sendError(res, error, "Failed to delete assignment");
  }
};

const submitAssignment = async (req, res) => {
  try {
    const submission = await AssignmentService.submitAssignment(
      req.params.id,
      req.user,
      req.body
    );
    res.json(submission);
  } catch (error) {
    sendError(res, error, "Failed to submit assignment");
  }
};

const gradeSubmission = async (req, res) => {
  try {
    const submission = await AssignmentService.gradeSubmission(
      req.params.id,
      req.params.studentId,
      req.body,
      req.user
    );
    res.json(submission);
  } catch (error) {
    sendError(res, error, "Failed to grade submission");
  }
};

module.exports = {
  createAssignment,
  deleteAssignment,
  generateAssignment,
  getAssignmentById,
  getAssignments,
  getStudentAssignments,
  gradeSubmission,
  submitAssignment,
  updateAssignment,
};
