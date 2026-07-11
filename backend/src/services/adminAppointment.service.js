const prisma = require("../config/prisma");
const { generateMeetingLink } = require("./meetingLink.service");

const isAdmin = (user) => user?.role === "admin";

const STATUSES = ["requested", "scheduled", "confirmed", "completed", "cancelled"];

const formatSlot = (slot) =>
  new Date(slot).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

const notifyApplicant = (userId, title, message, referenceId) =>
  prisma.notifications.create({
    data: { user_id: userId, title, message, type: "appointment", reference_id: referenceId || null },
  });

const getAppointments = async (user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can view appointments");
  }

  return prisma.appointment.findMany({
    include: { User: true, Lead: true },
    orderBy: { slot: "asc" },
  });
};

const updateAppointment = async (id, data, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can update appointments");
  }

  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Appointment not found");
  }

  const updateData = {};
  if (data.status !== undefined) {
    if (!STATUSES.includes(data.status)) {
      throw new Error("Invalid status value");
    }
    updateData.status = data.status;
  }
  if (data.meeting_link !== undefined) updateData.meeting_link = data.meeting_link;
  if (data.notes !== undefined) updateData.notes = data.notes;

  const appointment = await prisma.appointment.update({ where: { id }, data: updateData });

  // Keep the applicant informed of meaningful transitions.
  if (data.status === "confirmed") {
    await notifyApplicant(
      appointment.applicant_id,
      "Counseling call confirmed",
      `Your counseling call on ${formatSlot(appointment.slot)} is confirmed. Join: ${appointment.meeting_link || "link to follow"}`,
      appointment.id
    );
  } else if (data.status === "cancelled") {
    await notifyApplicant(
      appointment.applicant_id,
      "Counseling call cancelled",
      `Your counseling call on ${formatSlot(appointment.slot)} was cancelled. Please rebook a slot.`,
      appointment.id
    );
  }

  return appointment;
};

const regenerateLink = async (id, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can regenerate a meeting link");
  }

  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) {
    throw new Error("Appointment not found");
  }

  const meetingLink = generateMeetingLink(existing.id);
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { meeting_link: meetingLink },
  });

  await notifyApplicant(
    appointment.applicant_id,
    "New meeting link",
    `Your counseling call link was updated. Join: ${meetingLink}`,
    appointment.id
  );

  return appointment;
};

module.exports = {
  getAppointments,
  updateAppointment,
  regenerateLink,
};
