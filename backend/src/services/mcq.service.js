const { randomUUID } = require("crypto");

const prisma = require("../config/prisma");
const { askGemini } = require("./gemini.service");
const {
  chunkText,
  cleanText,
  extractFileText,
  rankChunks,
  truncate,
} = require("../utils/fileText");

const MAX_CONTEXT_CHARS = 18000;
const MAX_UPLOAD_CHARS = 45000;

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const normalizeOptionText = (value = "") =>
  String(value)
    .replace(/^[A-D][).:-]\s*/i, "")
    .trim();

const normalizeQuestions = (questions) => {
  if (!Array.isArray(questions)) return [];

  return questions
    .map((item) => {
      const rawOptions = Array.isArray(item.options)
        ? item.options
        : ["A", "B", "C", "D"].map((key) => item.options?.[key]);

      const options = rawOptions
        .filter((option) => option !== undefined && option !== null)
        .slice(0, 4)
        .map(normalizeOptionText);

      const correct = String(
        item.correct_answer || item.answer || item.correctAnswer || ""
      )
        .trim()
        .toUpperCase()
        .charAt(0);

      return {
        question: cleanText(item.question),
        options,
        correct_answer: ["A", "B", "C", "D"].includes(correct)
          ? correct
          : "A",
        explanation: cleanText(item.explanation || ""),
      };
    })
    .filter((item) => item.question && item.options.length === 4);
};

const parseAiJson = (response) => {
  const clean = String(response)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("AI returned invalid JSON");
  }
};

const getSubjectContext = async (data, selectedUnits) => {
  const subject = await prisma.subject.findUnique({
    where: { id: data.subjectId },
  });

  if (!subject) {
    throw new Error("Subject not found");
  }

  const units = selectedUnits.length
    ? await prisma.units.findMany({
        where: {
          subject_id: data.subjectId,
          unit_number: { in: selectedUnits },
        },
        orderBy: { unit_number: "asc" },
      })
    : [];

  const unitIds = units.map((unit) => unit.id);

  const questionBank = await prisma.question_bank.findMany({
    where: {
      subject_id: data.subjectId,
      faculty_id: data.facultyId,
      ...(unitIds.length ? { unit_id: { in: unitIds } } : {}),
    },
    take: 80,
    orderBy: { created_at: "desc" },
  });

  const studyMaterials = await prisma.study_materials.findMany({
    where: {
      subject_id: data.subjectId,
      faculty_id: data.facultyId,
    },
    take: 20,
    orderBy: { created_at: "desc" },
  });

  return { subject, units, questionBank, studyMaterials };
};

const buildPrompt = ({
  data,
  subject,
  units,
  questionBank,
  studyMaterials,
  uploadedText,
}) => {
  const topic = cleanText(data.topic || data.title || subject.name);
  const materialText = [
    uploadedText,
    ...studyMaterials.map((material) => material.extracted_text || ""),
    ...questionBank.map(
      (item) =>
        `Question: ${item.question}\nAnswer: ${item.answer || "Not provided"}`
    ),
  ].join("\n\n");

  const rankedContext = rankChunks(
    chunkText(materialText.slice(0, MAX_UPLOAD_CHARS)),
    `${subject.name} ${topic} ${units.map((unit) => unit.title).join(" ")}`
  );

  return `
Generate exactly ${Number(data.questionCount) || 10} high-quality multiple choice questions using retrieval augmented generation.

Use the retrieved context as the source of truth when it is available. If uploaded content exists, prioritize that content over generic subject knowledge. Do not invent facts that conflict with the context.

Subject:
${subject.code || ""} ${subject.name}

Selected units:
${
  units.length
    ? units.map((u) => `Unit ${u.unit_number}: ${u.title}`).join("\n")
    : "No specific unit selected"
}

Topic or focus:
${topic}

Difficulty:
${data.difficulty || "Medium"}

Bloom level:
${data.bloomLevel || "Understand"}

Retrieved context:
${truncate(rankedContext || materialText, MAX_CONTEXT_CHARS) || "No context provided"}

Return ONLY valid JSON as an array. Each item must match this schema:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "A",
    "explanation": "Short explanation grounded in the provided context"
  }
]
`;
};

const validateGenerateInput = (data, selectedUnits, uploadedText) => {
  if (!data.title?.trim()) throw new Error("Title is required");
  if (!data.subjectId) throw new Error("Subject is required");
  if (!data.difficulty) throw new Error("Difficulty is required");
  if (!data.bloomLevel) throw new Error("Bloom level is required");

  const count = Number(data.questionCount);
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("Question count must be between 1 and 50");
  }

  if (!uploadedText && selectedUnits.length === 0 && !data.topic?.trim()) {
    throw new Error("Select units, enter a topic, or upload content.");
  }
};

const generateMcqSet = async (data, file) => {
  const selectedUnits = toArray(data.selectedUnits)
    .map(Number)
    .filter((n) => Number.isInteger(n));

  const uploadedText = await extractFileText(file);
  validateGenerateInput(data, selectedUnits, uploadedText);

  const { subject, units, questionBank, studyMaterials } =
    await getSubjectContext(data, selectedUnits);

  const prompt = buildPrompt({
    data,
    subject,
    units,
    questionBank,
    studyMaterials,
    uploadedText,
  });

  const response = await askGemini(prompt);
  const questions = normalizeQuestions(parseAiJson(response));

  if (questions.length === 0) {
    throw new Error("No valid MCQs generated");
  }

  const mcqSet = await prisma.mcq_sets.create({
    data: {
      title: data.title.trim(),
      subject_id: data.subjectId,
      faculty_id: data.facultyId,
      topic: cleanText(data.topic || ""),
      difficulty: data.difficulty,
      bloom_level: data.bloomLevel,
      question_count: questions.length,
      generated_content: questions,
      status: "draft",
      ai_prompt: prompt,
    },
  });

  await prisma.mcq_questions.createMany({
    data: questions.map((q) => ({
      mcq_set_id: mcqSet.id,
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      difficulty: data.difficulty,
      bloom_level: data.bloomLevel,
      marks: 1,
    })),
  });

  return getMcqById(mcqSet.id, data.facultyId);
};

const getAllMcqSets = async (facultyId) => {
  return prisma.mcq_sets.findMany({
    where: { faculty_id: facultyId },
    include: {
      Subject: true,
      mcq_questions: { orderBy: { created_at: "asc" } },
    },
    orderBy: { created_at: "desc" },
  });
};

const publishMcq = async (id, facultyId) => {
  const existing = await prisma.mcq_sets.findFirst({
    where: { id, faculty_id: facultyId },
  });

  if (!existing) {
    throw new Error("MCQ set not found");
  }

  return prisma.mcq_sets.update({
    where: { id },
    data: {
      status: "published",
      is_published: true,
      share_token: existing.share_token || randomUUID(),
      updated_at: new Date(),
    },
    include: {
      Subject: true,
      mcq_questions: { orderBy: { created_at: "asc" } },
    },
  });
};

const deleteMcq = async (id, facultyId) => {
  const existing = await prisma.mcq_sets.findFirst({
    where: { id, faculty_id: facultyId },
  });

  if (!existing) {
    throw new Error("MCQ set not found");
  }

  return prisma.mcq_sets.delete({ where: { id } });
};

const getMcqById = async (id, facultyId) => {
  return prisma.mcq_sets.findFirst({
    where: { id, faculty_id: facultyId },
    include: {
      Subject: true,
      mcq_questions: { orderBy: { created_at: "asc" } },
    },
  });
};

const getSharedMcq = async (shareToken) => {
  return prisma.mcq_sets.findFirst({
    where: {
      share_token: shareToken,
      is_published: true,
    },
    include: {
      Subject: true,
      mcq_questions: { orderBy: { created_at: "asc" } },
    },
  });
};

const formatMcqText = (mcq) => {
  const questions = mcq.mcq_questions || [];
  const lines = [
    mcq.title,
    `${mcq.Subject?.code || ""} ${mcq.Subject?.name || ""}`.trim(),
    `Difficulty: ${mcq.difficulty || "N/A"}`,
    `Bloom Level: ${mcq.bloom_level || "N/A"}`,
    `Questions: ${questions.length}`,
    "",
  ];

  questions.forEach((question, index) => {
    const options = Array.isArray(question.options)
      ? question.options
      : ["A", "B", "C", "D"].map((key) => question.options?.[key]);

    lines.push(`${index + 1}. ${question.question}`);
    options.forEach((option, optionIndex) => {
      lines.push(`${String.fromCharCode(65 + optionIndex)}. ${option}`);
    });
    lines.push(`Answer: ${question.correct_answer}`);
    if (question.explanation) {
      lines.push(`Explanation: ${question.explanation}`);
    }
    lines.push("");
  });

  return lines.join("\n");
};

module.exports = {
  generateMcqSet,
  getAllMcqSets,
  publishMcq,
  deleteMcq,
  getMcqById,
  getSharedMcq,
  formatMcqText,
};
