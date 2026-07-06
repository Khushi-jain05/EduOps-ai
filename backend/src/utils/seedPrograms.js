// One-off seed for admission programs. Safe to re-run (skips if any exist).
const prisma = require("../config/prisma");

const PROGRAMS = [
  {
    name: "B.Tech — CSE (AI/ML)",
    level: "Undergraduate",
    duration: "4 yrs",
    fee_per_year: 180000,
    seats: 120,
    intake: "2026",
    description: "Core computer science with a specialization in AI and ML.",
    featured: true,
    is_open: true,
  },
  {
    name: "MBA",
    level: "Postgraduate",
    duration: "2 yrs",
    fee_per_year: 240000,
    seats: 60,
    intake: "2026",
    description: "Management program with finance, marketing and analytics tracks.",
    featured: true,
    is_open: true,
  },
  {
    name: "B.Sc Data Science",
    level: "Undergraduate",
    duration: "3 yrs",
    fee_per_year: 120000,
    seats: 80,
    intake: "2026",
    description: "Statistics, programming and applied data science.",
    featured: true,
    is_open: true,
  },
  {
    name: "BBA",
    level: "Undergraduate",
    duration: "3 yrs",
    fee_per_year: 110000,
    seats: 90,
    intake: "2026",
    description: "Foundations of business administration and entrepreneurship.",
    featured: true,
    is_open: true,
  },
  {
    name: "B.Com (Hons)",
    level: "Undergraduate",
    duration: "3 yrs",
    fee_per_year: 90000,
    seats: 100,
    intake: "2026",
    description: "Accounting, finance and commerce.",
    featured: false,
    is_open: true,
  },
  {
    name: "M.Tech — Data Engineering",
    level: "Postgraduate",
    duration: "2 yrs",
    fee_per_year: 160000,
    seats: 40,
    intake: "2026",
    description: "Advanced data systems, pipelines and cloud engineering.",
    featured: false,
    is_open: true,
  },
];

const run = async () => {
  const existing = await prisma.program.count();
  if (existing > 0) {
    console.log(`Programs already seeded (${existing}). Skipping.`);
    return;
  }

  await prisma.program.createMany({ data: PROGRAMS });
  console.log(`Seeded ${PROGRAMS.length} programs.`);
};

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
