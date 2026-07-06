const prisma = require("../config/prisma");
const { askGemini } = require("./gemini.service");

const getUserId = (user) => user?.id || user?.userId || user?.sub;

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

const bookAppointment = async (user, data) => {
  const userId = getUserId(user);

  if (!data.slot) {
    throw new Error("A slot is required");
  }

  const slot = new Date(data.slot);
  if (Number.isNaN(slot.getTime())) {
    throw new Error("Slot format is invalid");
  }

  const appointment = await prisma.appointment.create({
    data: {
      applicant_id: userId,
      mode: data.mode === "campus" ? "campus" : "video",
      slot,
      notes: (data.notes || "").toString().trim(),
    },
  });

  // Advance the journey to at least "Book counseling call" (step 4).
  const applicant = await prisma.user.findUnique({ where: { id: userId } });
  if ((applicant?.applicationStep || 0) < 4) {
    await prisma.user.update({
      where: { id: userId },
      data: { applicationStep: 4 },
    });
  }

  return appointment;
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
  getAppointments,
  getDashboard,
  getPrograms,
  getUserId,
};
