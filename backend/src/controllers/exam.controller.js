const prisma = require("../config/prisma");

const getExams = async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        examDate: "asc",
      },
    });

    res.json(exams);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch exams",
    });
  }
};
const PDFDocument = require("pdfkit");


const downloadTimetable = async (req, res) => {
  try {
    const exams = await prisma.exam.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        examDate: "asc",
      },
    });

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=timetable.pdf"
    );

    doc.pipe(res);

    doc
      .fontSize(22)
      .text("Exam Timetable", {
        align: "center",
      });

    doc.moveDown();

    exams.forEach((exam) => {
      doc
        .fontSize(14)
        .text(`Subject: ${exam.subject}`);

      doc.text(`Code: ${exam.code}`);

      doc.text(
        `Date: ${new Date(
          exam.examDate
        ).toLocaleDateString()}`
      );

      doc.text(`Time: ${exam.examTime}`);

      doc.text(`Venue: ${exam.venue}`);

      doc.moveDown();
    });

    doc.end();
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "PDF generation failed",
    });
  }
};

module.exports = {
  getExams,
  downloadTimetable,
};

