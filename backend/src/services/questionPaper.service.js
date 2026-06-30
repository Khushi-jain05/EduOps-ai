const prisma = require("../config/prisma");

const generatePaper = async (data) => {
  const paper = await prisma.question_papers.create({
    data: {
      title: data.title,
      subject_id: data.subjectId,
      faculty_id: data.facultyId,
      exam_type: data.examType,
      semester: data.semester,
      academic_year: data.academicYear,
      total_marks: data.totalMarks,
      duration: data.duration,
      difficulty: data.difficulty,
      bloom_level: data.bloomLevel,
      instructions: data.instructions,
      generated_content: {},
    },
  });

  return paper;
};

module.exports = {
  generatePaper,
};