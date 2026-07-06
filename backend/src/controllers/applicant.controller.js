const ApplicantService = require("../services/applicant.service");

const sendError = (res, error, fallback) => {
  console.error("[applicant]", error);
  const message = error.message || fallback;
  const status = message.includes("required") || message.includes("invalid") ? 400 : 500;
  res.status(status).json({ message });
};

exports.getDashboard = async (req, res) => {
  try {
    const data = await ApplicantService.getDashboard(req.user);
    res.json(data);
  } catch (error) {
    sendError(res, error, "Failed to load applicant dashboard");
  }
};

exports.getPrograms = async (req, res) => {
  try {
    const programs = await ApplicantService.getPrograms();
    res.json(programs);
  } catch (error) {
    sendError(res, error, "Failed to load programs");
  }
};

exports.advanceApplication = async (req, res) => {
  try {
    const result = await ApplicantService.advanceApplication(req.user);
    res.json(result);
  } catch (error) {
    sendError(res, error, "Failed to update application");
  }
};

exports.bookAppointment = async (req, res) => {
  try {
    const appointment = await ApplicantService.bookAppointment(req.user, req.body);
    res.status(201).json(appointment);
  } catch (error) {
    sendError(res, error, "Failed to book appointment");
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await ApplicantService.getAppointments(req.user);
    res.json(appointments);
  } catch (error) {
    sendError(res, error, "Failed to load appointments");
  }
};

exports.askAdmissions = async (req, res) => {
  try {
    const result = await ApplicantService.askAdmissions(req.body.question);
    res.json(result);
  } catch (error) {
    sendError(res, error, "Failed to get an answer");
  }
};

exports.getApplication = async (req, res) => {
  try {
    const result = await ApplicantService.getApplication(req.user);
    res.json(result);
  } catch (error) {
    sendError(res, error, "Failed to load application");
  }
};

exports.saveApplication = async (req, res) => {
  try {
    const result = await ApplicantService.saveApplication(req.user, req.body);
    res.json(result);
  } catch (error) {
    sendError(res, error, "Failed to save application");
  }
};
