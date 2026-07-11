// Auto-generates a real, working video-meeting link for an appointment.
//
// Uses Jitsi Meet — every URL is a live video room, no account/credentials/cost.
// Kept as a single function so it can later be swapped for Google Meet (which
// would require Google Workspace admin OAuth / domain-wide delegation).
const generateMeetingLink = (appointmentId) =>
  `https://meet.jit.si/EduOps-Counseling-${appointmentId}`;

module.exports = { generateMeetingLink };
