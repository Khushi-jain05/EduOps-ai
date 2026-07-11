const AdminAppointmentService = require("../services/adminAppointment.service");

const sendError = (res, error, fallback = "Appointment request failed") => {
  console.error("[admin-appointments]", error);

  const message = error.message || fallback;
  const status =
    message.includes("Only admin")
      ? 403
      : message.includes("not found")
        ? 404
        : message.includes("Invalid")
          ? 400
          : 500;

  res.status(status).json({ message });
};

const getAppointments = async (req, res) => {
  try {
    const appointments = await AdminAppointmentService.getAppointments(req.user);
    res.json(appointments);
  } catch (error) {
    sendError(res, error, "Failed to fetch appointments");
  }
};

const updateAppointment = async (req, res) => {
  try {
    const appointment = await AdminAppointmentService.updateAppointment(
      req.params.id,
      req.body,
      req.user
    );
    res.json(appointment);
  } catch (error) {
    sendError(res, error, "Failed to update appointment");
  }
};

const regenerateLink = async (req, res) => {
  try {
    const appointment = await AdminAppointmentService.regenerateLink(req.params.id, req.user);
    res.json(appointment);
  } catch (error) {
    sendError(res, error, "Failed to regenerate meeting link");
  }
};

module.exports = {
  getAppointments,
  updateAppointment,
  regenerateLink,
};
