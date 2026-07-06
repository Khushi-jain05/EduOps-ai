// Seed / reseed admission programs. Replaces existing rows so the catalog
// always matches the intended 2026 intake.
const prisma = require("../config/prisma");

const PROGRAMS = [
  {
    name: "B.Tech — Computer Science (AI/ML)",
    level: "UG",
    duration: "4 years",
    fee_per_year: 180000,
    seats: 120,
    intake: "2026",
    eligibility: "10+2 PCM, 60%+",
    description: "Core computer science with a specialization in AI and ML.",
    featured: true,
  },
  {
    name: "B.Tech — Electronics & Comm.",
    level: "UG",
    duration: "4 years",
    fee_per_year: 165000,
    seats: 90,
    intake: "2026",
    eligibility: "10+2 PCM, 60%+",
    description: "Electronics, communication systems and embedded design.",
    featured: false,
  },
  {
    name: "B.Tech — Mechanical Engineering",
    level: "UG",
    duration: "4 years",
    fee_per_year: 150000,
    seats: 80,
    intake: "2026",
    eligibility: "10+2 PCM, 55%+",
    description: "Design, thermodynamics, manufacturing and robotics.",
    featured: false,
  },
  {
    name: "B.Sc — Data Science",
    level: "UG",
    duration: "3 years",
    fee_per_year: 120000,
    seats: 80,
    intake: "2026",
    eligibility: "10+2 with Maths, 55%+",
    description: "Statistics, programming and applied data science.",
    featured: true,
  },
  {
    name: "BBA — Business Administration",
    level: "UG",
    duration: "3 years",
    fee_per_year: 110000,
    seats: 90,
    intake: "2026",
    eligibility: "10+2 any stream, 50%+",
    description: "Foundations of business administration and entrepreneurship.",
    featured: true,
  },
  {
    name: "B.Com (Hons.)",
    level: "UG",
    duration: "3 years",
    fee_per_year: 95000,
    seats: 120,
    intake: "2026",
    eligibility: "10+2 with Commerce, 50%+",
    description: "Accounting, finance and commerce.",
    featured: false,
  },
  {
    name: "MBA — Full-time",
    level: "PG",
    duration: "2 years",
    fee_per_year: 240000,
    seats: 60,
    intake: "2026",
    eligibility: "Bachelor's + CAT/MAT",
    description: "Management program with finance, marketing and analytics tracks.",
    featured: true,
  },
  {
    name: "M.Tech — AI & Machine Learning",
    level: "PG",
    duration: "2 years",
    fee_per_year: 200000,
    seats: 40,
    intake: "2026",
    eligibility: "B.Tech CSE/IT + GATE",
    description: "Advanced AI, deep learning and ML systems engineering.",
    featured: false,
  },
];

const run = async () => {
  await prisma.program.deleteMany({});
  await prisma.program.createMany({ data: PROGRAMS });
  console.log(`Seeded ${PROGRAMS.length} programs (replaced existing).`);
};

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
