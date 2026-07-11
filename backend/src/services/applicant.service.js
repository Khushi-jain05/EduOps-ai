const prisma = require("../config/prisma");
const { askGemini } = require("./gemini.service");
const { generateMeetingLink } = require("./meetingLink.service");
const { createLeadFromSystem } = require("./lead.service");

const getUserId = (user) => user?.id || user?.userId || user?.sub;

const notifyUser = (userId, title, message, type, referenceId) =>
  prisma.notifications.create({
    data: { user_id: userId, title, message, type, reference_id: referenceId || null },
  });

const notifyAdmins = async (title, message, type, referenceId) => {
  const admins = await prisma.user.findMany({
    where: { role: "admin" },
    select: { id: true },
  });
  if (admins.length === 0) return;
  await prisma.notifications.createMany({
    data: admins.map((a) => ({
      user_id: a.id,
      title,
      message,
      type,
      reference_id: referenceId || null,
    })),
  });
};

const formatSlot = (slot) =>
  new Date(slot).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const JOURNEY_STEPS = [
  "Explore programs",
  "Check eligibility & fees",
  "Submit application",
  "Book counseling call",
  "Get offer letter",
];

const formatFee = (rupeesPerYear) => {
  if (!rupeesPerYear) return "—";
  const lakhs = rupeesPerYear / 100000;
  const value = Number.isInteger(lakhs) ? lakhs : lakhs.toFixed(1);
  return `₹${value}L`;
};

const mapProgram = (program) => ({
  id: program.id,
  name: program.name,
  level: program.level,
  duration: program.duration,
  fee: `${formatFee(program.fee_per_year)}/yr`,
  fee_per_year: program.fee_per_year,
  seats: program.seats,
  intake: program.intake,
  eligibility: program.eligibility,
  description: program.description,
});

const getDashboard = async (user) => {
  const userId = getUserId(user);

  const [applicant, programs, appointments] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.program.findMany({
      where: { is_open: true },
      orderBy: [{ featured: "desc" }, { created_at: "asc" }],
    }),
    prisma.appointment.count({ where: { applicant_id: userId } }),
  ]);

  const step = applicant?.applicationStep || 0;
  const totalSteps = JOURNEY_STEPS.length;

  const avgFee = programs.length
    ? Math.round(
        programs.reduce((sum, p) => sum + (p.fee_per_year || 0), 0) /
          programs.length
      )
    : 0;

  return {
    applicant: {
      id: applicant?.id,
      username: applicant?.username,
      email: applicant?.email,
    },
    stats: {
      progressPercent: Math.round((step / totalSteps) * 100),
      stepsDone: step,
      totalSteps,
      programsOpen: programs.length,
      avgFee: formatFee(avgFee),
      appointments,
    },
    journey: JOURNEY_STEPS.map((label, index) => ({
      step: index + 1,
      label,
      completed: index < step,
      current: index === step,
    })),
    featuredPrograms: programs
      .filter((p) => p.featured)
      .slice(0, 6)
      .map(mapProgram),
  };
};

const getPrograms = async () => {
  const programs = await prisma.program.findMany({
    orderBy: [{ featured: "desc" }, { created_at: "asc" }],
  });
  return programs.map(mapProgram);
};

const advanceApplication = async (user) => {
  const userId = getUserId(user);
  const applicant = await prisma.user.findUnique({ where: { id: userId } });

  const nextStep = Math.min(
    JOURNEY_STEPS.length,
    (applicant?.applicationStep || 0) + 1
  );

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { applicationStep: nextStep },
  });

  return { applicationStep: updated.applicationStep };
};

const VALID_MODES = ["video", "campus", "phone"];

const bookAppointment = async (user, data) => {
  const userId = getUserId(user);

  if (!data.slot) {
    throw new Error("A slot is required");
  }

  const slot = new Date(data.slot);
  if (Number.isNaN(slot.getTime())) {
    throw new Error("Slot format is invalid");
  }

  const applicant = await prisma.user.findUnique({ where: { id: userId } });

  let appointment = await prisma.appointment.create({
    data: {
      applicant_id: userId,
      mode: VALID_MODES.includes(data.mode) ? data.mode : "video",
      slot,
      program: (data.program || "").toString().trim() || null,
      notes: (data.notes || "").toString().trim(),
      status: "scheduled",
    },
  });

  // Auto-generate a real working video-meeting link.
  const meetingLink = generateMeetingLink(appointment.id);

  // Bring this applicant into the Leads pipeline (deduped by email).
  let lead = null;
  try {
    lead = await createLeadFromSystem({
      name: applicant?.username || "Applicant",
      phone: applicant?.phone || "0000000000",
      email: applicant?.email || null,
      course: (data.program || applicant?.program || "").toString().trim() || null,
      city: applicant?.city || null,
      source: "Applicant Portal",
      status: "contacted",
      captureNote: `Booked a ${appointment.mode} counseling call for ${formatSlot(slot)}.`,
    });
  } catch (error) {
    console.error("[applicant] lead creation failed:", error.message);
  }

  appointment = await prisma.appointment.update({
    where: { id: appointment.id },
    data: { meeting_link: meetingLink, lead_id: lead?.id || null },
  });

  // Advance the journey to at least "Book counseling call" (step 4).
  if ((applicant?.applicationStep || 0) < 4) {
    await prisma.user.update({
      where: { id: userId },
      data: { applicationStep: 4 },
    });
  }

  const applicantName = applicant?.username || "An applicant";

  await notifyAdmins(
    "New counseling booking",
    `${applicantName} booked a ${appointment.mode} counseling call for ${formatSlot(slot)}${appointment.program ? ` (${appointment.program})` : ""}. Connect via the Meetings page.`,
    "appointment",
    appointment.id
  );

  await notifyUser(
    userId,
    "Counseling call scheduled",
    `Your ${appointment.mode} counseling call is scheduled for ${formatSlot(slot)}. Join link: ${meetingLink}`,
    "appointment",
    appointment.id
  );

  return appointment;
};

const getApplication = async (user) => {
  const userId = getUserId(user);
  const applicant = await prisma.user.findUnique({ where: { id: userId } });

  return {
    applicationStep: applicant?.applicationStep || 0,
    data: applicant?.applicationData || {
      fullName: applicant?.username || "",
      email: applicant?.email || "",
      phone: applicant?.phone || "",
      city: applicant?.city || "",
    },
  };
};

// Save one step of the multi-step application. `step` is the 1-based index of
// the step being completed; `submitted` finalizes the application.
const saveApplication = async (user, { data = {}, step = 1, submitted = false }) => {
  const userId = getUserId(user);
  const applicant = await prisma.user.findUnique({ where: { id: userId } });

  const merged = { ...(applicant?.applicationData || {}), ...data };

  // Journey step: application steps 1-4 map onto the 5-step admission journey.
  // Completing/submitting the application takes them to "Submit application" (3).
  const journeyStep = submitted
    ? Math.max(applicant?.applicationStep || 0, 3)
    : Math.max(applicant?.applicationStep || 0, Math.min(2, step));

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      applicationData: merged,
      applicationStep: journeyStep,
      // Mirror the personal fields onto the profile where sensible.
      ...(data.fullName ? { username: data.fullName } : {}),
      ...(data.phone ? { phone: data.phone } : {}),
      ...(data.city ? { city: data.city } : {}),
      ...(data.program ? { program: data.program } : {}),
    },
  });

  const progressPercent = Math.round((updated.applicationStep / JOURNEY_STEPS.length) * 100);

  // Let the applicant know how far along their profile is.
  await notifyUser(
    userId,
    "Application progress updated",
    `Your application is now ${progressPercent}% complete.`,
    "application"
  );

  // On final submit, alert admins and reflect it on the linked lead (if any).
  if (submitted) {
    const name = updated.username || "An applicant";
    await notifyAdmins(
      "Application submitted",
      `${name} submitted their application${updated.program ? ` for ${updated.program}` : ""}.`,
      "application"
    );

    if (updated.email) {
      const lead = await prisma.lead.findFirst({ where: { email: updated.email } });
      if (lead) {
        await prisma.leadActivity.create({
          data: {
            lead_id: lead.id,
            type: "note",
            message: `Applicant submitted their application (${progressPercent}% complete).`,
            created_by: null,
          },
        });
      }
    }
  }

  return { applicationStep: updated.applicationStep, data: updated.applicationData };
};

const getAppointments = async (user) => {
  const userId = getUserId(user);
  return prisma.appointment.findMany({
    where: { applicant_id: userId },
    orderBy: { slot: "asc" },
  });
};

const askAdmissions = async (question) => {
  const q = (question || "").toString().trim();
  if (!q) {
    throw new Error("A question is required");
  }

  const programs = await prisma.program.findMany({
    orderBy: [{ featured: "desc" }, { created_at: "asc" }],
  });

  const catalog = programs
    .map(
      (p) =>
        `- ${p.name} (${p.level || "program"}): ${p.duration}, ₹${p.fee_per_year}/year, ${p.seats} seats, intake ${p.intake || "2026"}.`
    )
    .join("\n");

  const prompt = `You are the Admissions AI assistant for EduOps, a college admissions office.
Answer the applicant's question helpfully and concisely. Use the program catalog below as the source of truth for programs, fees, duration and seats. If the answer isn't in the catalog, give general admissions guidance and suggest booking a counseling call.

Program catalog:
${catalog || "No programs available."}

Applicant question:
${q}

Answer:`;

  const answer = await askGemini(prompt);
  return { answer: (answer || "").trim() };
};

module.exports = {
  advanceApplication,
  askAdmissions,
  bookAppointment,
  getApplication,
  getAppointments,
  getDashboard,
  getPrograms,
  getUserId,
  saveApplication,
};
