const prisma = require("../config/prisma");
const { askGemini } = require("./gemini.service");

const parseAiJson = (rawText) => {
  if (!rawText) return null;

  const trimmed = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    const match = trimmed.match(/\{[\s\S]*\}/);

    if (!match) return null;

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
};

const buildFallbackPaper = ({
  subject,
  units,
  questionBank,
  totalMarks,
  examType,
  difficulty,
  bloomLevel,
}) => {
  const marksPerQuestion = Math.max(
    1,
    Math.ceil((totalMarks || 50) / Math.max(questionBank.length || 5, 1))
  );

  const generatedQuestions =
    questionBank.length > 0
      ? questionBank.slice(0, 12).map((item, index) => ({
          number: index + 1,
          question: item.question,
          marks: item.marks || marksPerQuestion,
          difficulty: item.difficulty || difficulty || "Medium",
          bloomLevel: item.bloom_level || bloomLevel || "Understand",
          unit:
            units.find((unit) => unit.id === item.unit_id)?.unit_number ||
            null,
        }))
      : units.map((unit, index) => ({
          number: index + 1,
          question: `Explain the key concepts from ${unit.title} in ${subject.name}.`,
          marks: marksPerQuestion,
          difficulty: difficulty || "Medium",
          bloomLevel: bloomLevel || "Understand",
          unit: unit.unit_number,
        }));

  return {
    title: `${subject.name} ${examType || "Question Paper"}`,
    subject: subject.name,
    totalMarks: totalMarks || 50,
    sections: [
      {
        name: "Section A",
        instructions: "Answer all questions.",
        questions: generatedQuestions,
      },
    ],
  };
};

const generateAiContent = async ({
  data,
  subject,
  units,
  questionBank,
  studyMaterials,
  totalMarks,
}) => {
  const fallback = buildFallbackPaper({
    subject,
    units,
    questionBank,
    totalMarks,
    examType: data.examType,
    difficulty: data.difficulty,
    bloomLevel: data.bloomLevel,
  });

  if (!process.env.GROQ_API_KEY) {
    return fallback;
  }

  const prompt = `
Generate a complete exam question paper as strict JSON only.

Return this shape:
{
  "title": string,
  "subject": string,
  "totalMarks": number,
  "duration": string,
  "instructions": string[],
  "sections": [
    {
      "name": string,
      "instructions": string,
      "questions": [
        {
          "number": number,
          "question": string,
          "marks": number,
          "difficulty": string,
          "bloomLevel": string,
          "unit": number
        }
      ]
    }
  ]
}

Paper details:
Title: ${data.title}
Subject: ${subject.code} - ${subject.name}
Exam type: ${data.examType}
Semester: ${data.semester || "Not specified"}
Academic year: ${data.academicYear || "Not specified"}
Duration: ${data.duration || "Not specified"}
Total marks: ${totalMarks || 50}
Difficulty: ${data.difficulty || "Balanced"}
Bloom level focus: ${data.bloomLevel || "Mixed"}
Faculty instructions: ${data.instructions || "None"}

Selected units:
${units.map((unit) => `Unit ${unit.unit_number}: ${unit.title}`).join("\n")}

Question bank:
${questionBank
  .slice(0, 30)
  .map(
    (item, index) =>
      `${index + 1}. [${item.marks} marks, ${item.difficulty || "NA"}, ${
        item.bloom_level || "NA"
      }] ${item.question}`
  )
  .join("\n")}

Study material:
${studyMaterials
  .slice(0, 3)
  .map((item) => `${item.title}\n${(item.extracted_text || "").slice(0, 2500)}`)
  .join("\n\n")}

Use the provided question bank and study material first. If not enough content exists, create syllabus-aligned questions from the selected unit titles.
`;

  try {
    const raw = await askGemini(prompt);
    return parseAiJson(raw) || { ...fallback, rawAiResponse: raw };
  } catch (error) {
    console.error("AI paper generation failed", error);
    return fallback;
  }
};

const generatePaper = async (data) => {
  const selectedUnits = Array.isArray(data.selectedUnits)
    ? data.selectedUnits
        .map((unit) => Number(unit))
        .filter((unit) => Number.isInteger(unit))
    : [];

  if (!data.title?.trim()) {
    throw new Error("Paper title is required");
  }

  if (!data.subjectId) {
    throw new Error("Subject is required");
  }

  if (!data.facultyId) {
    throw new Error("Faculty is required");
  }

  if (!data.examType) {
    throw new Error("Exam type is required");
  }

  if (selectedUnits.length === 0) {
    throw new Error("At least one unit is required");
  }

  const totalMarks = Number(data.totalMarks);
  const semester = data.semester ? Number(data.semester) : null;
  const subject = await prisma.subject.findUnique({
    where: {
      id: data.subjectId,
    },
  });

  if (!subject) {
    throw new Error("Selected subject was not found");
  }

  let units = await prisma.units.findMany({
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

  if (units.length === 0) {
    units = selectedUnits.map((unitNumber) => ({
      id: `default-${data.subjectId}-${unitNumber}`,
      title: `Unit ${unitNumber}`,
      unit_number: unitNumber,
      subject_id: data.subjectId,
      created_at: null,
    }));
  }

  const unitIds = units
    .map((unit) => unit.id)
    .filter((id) => !String(id).startsWith("default-"));

  const questionBankWhere = {
    subject_id: data.subjectId,
  };

  if (unitIds.length > 0) {
    questionBankWhere.OR = [
      {
        unit_id: {
          in: unitIds,
        },
      },
      {
        unit_id: null,
      },
    ];
  }

  const questionBank = await prisma.question_bank.findMany({
    where: questionBankWhere,
    orderBy: {
      created_at: "desc",
    },
  });

  const studyMaterials = await prisma.study_materials.findMany({
    where: {
      subject_id: data.subjectId,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const generatedContent = await generateAiContent({
    data,
    subject,
    units,
    questionBank,
    studyMaterials,
    totalMarks: Number.isFinite(totalMarks) ? totalMarks : 50,
  });

  const paper = await prisma.question_papers.create({
    data: {
      title: data.title.trim(),
      subject_id: data.subjectId,
      faculty_id: data.facultyId,
      exam_type: data.examType,
      semester: Number.isInteger(semester) ? semester : null,
      academic_year: data.academicYear || null,
      total_marks: Number.isFinite(totalMarks) ? totalMarks : 0,
      duration: data.duration || null,
      difficulty: data.difficulty || null,
      bloom_level: data.bloomLevel || null,
      instructions: data.instructions || null,
      selected_units: selectedUnits,
      question_count:
        generatedContent.sections?.reduce(
          (count, section) =>
            count + (section.questions?.length || 0),
          0
        ) || selectedUnits.length,
      generated_content: generatedContent,
      ai_prompt: data.instructions || null,
      generation_status: "completed",
      generated_at: new Date(),
    },
    include: {
      Subject: true,
      User: true,
    },
  });

  return paper;
};

const getAllPapers = async (facultyId) => {
  return await prisma.question_papers.findMany({
    where: {
      faculty_id: facultyId,
    },
    include: {
      Subject: true,
      User: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

const getPaperById = async (id) => {
  return await prisma.question_papers.findUnique({
    where: {
      id,
    },
    include: {
      Subject: true,
      User: true,
    },
  });
};

const deletePaper = async (id) => {
  return await prisma.question_papers.delete({
    where: {
      id,
    },
  });
};

module.exports = {
  generatePaper,
  getAllPapers,
  getPaperById,
  deletePaper,
};
