const prisma = require("../config/prisma");
const { askGemini } = require("./gemini.service");

const generateMcqSet = async (data) => {
  const selectedUnits = data.selectedUnits || [];

  const subject = await prisma.subject.findUnique({
    where: {
      id: data.subjectId,
    },
  });

  if (!subject) {
    throw new Error("Subject not found");
  }

  const units = await prisma.units.findMany({
    where: {
      subject_id: data.subjectId,
      unit_number: {
        in: selectedUnits,
      },
    },
    orderBy: {
      unit_number: "asc",
    },
  });

  const questionBank = await prisma.question_bank.findMany({
    where: {
      subject_id: data.subjectId,
    },
  });

  const studyMaterials = await prisma.study_materials.findMany({
    where: {
      subject_id: data.subjectId,
    },
  });

  const prompt = `
Generate ${data.questionCount} Multiple Choice Questions.

Subject:
${subject.name}

Units:
${units
  .map((u) => `Unit ${u.unit_number}: ${u.title}`)
  .join("\n")}

Difficulty:
${data.difficulty}

Bloom Level:
${data.bloomLevel}

Question Bank:
${questionBank
  .map((q) => q.question)
  .join("\n")}

Study Material:
${studyMaterials
  .map((m) => m.extracted_text || "")
  .join("\n")}

Return ONLY JSON.

[
{
"question":"",
"options":[
"A",
"B",
"C",
"D"
],
"correct_answer":"A",
"explanation":""
}
]
`;

  const response = await askGemini(prompt);

let questions;

try {
  questions = JSON.parse(
    response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()
  );
} catch (err) {
  console.log(response);
  throw new Error("Invalid AI response");
}

  const mcqSet = await prisma.mcq_sets.create({
    data: {
      title: data.title,
      subject_id: data.subjectId,
      faculty_id: data.facultyId,
      difficulty: data.difficulty,
      bloom_level: data.bloomLevel,
      question_count: questions.length,
      generated_content: questions,
      status: "draft",
    },
  });

  for (const q of questions) {
    await prisma.mcq_questions.create({
      data: {
        mcq_set_id: mcqSet.id,
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        difficulty: data.difficulty,
        bloom_level: data.bloomLevel,
        marks: 1,
      },
    });
  }

  return mcqSet;
};

const getAllMcqSets = async (facultyId) => {
  return prisma.mcq_sets.findMany({
    where: {
      faculty_id: facultyId,
    },
    include: {
      Subject: true,
      mcq_questions: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
};
const { randomUUID } = require("crypto");

const publishMcq = async (id, facultyId) => {
  return prisma.mcq_sets.updateMany({
    where: {
      id,
      faculty_id: facultyId,
    },
    data: {
      status: "published",
      is_published: true,
      share_token: randomUUID(),
      updated_at: new Date(),
    },
  });
};

const deleteMcq = async (id) => {
  return prisma.mcq_sets.delete({
    where: {
      id,
    },
  });
};

const getMcqById = async (id) => {
  return prisma.mcq_sets.findUnique({
    where: {
      id,
    },
    include: {
      Subject: true,
      mcq_questions: true,
    },
  });
};
module.exports = {
  generateMcqSet,
  getAllMcqSets,
  publishMcq,
  deleteMcq,
  getMcqById,
};