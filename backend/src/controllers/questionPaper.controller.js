const QuestionPaperService = require("../services/questionPaper.service");
const PDFDocument = require("pdfkit");

const writePaperPdf = (paper, res) => {
  const content = paper.generated_content || {};
  const sections = content.sections || [];
  const doc = new PDFDocument({ margin: 48 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${paper.title.replace(/[^a-z0-9]+/gi, "-")}.pdf"`
  );

  doc.pipe(res);
  doc.fontSize(18).text(content.title || paper.title, {
    align: "center",
  });
  doc.moveDown(0.5);
  doc
    .fontSize(11)
    .text(
      `${paper.Subject?.code || ""} ${paper.Subject?.name || ""}`,
      { align: "center" }
    )
    .text(
      `${paper.exam_type || "Exam"} | ${
        paper.duration || "Duration not set"
      } | ${paper.total_marks || 0} marks`,
      { align: "center" }
    );
  doc.moveDown();

  if (Array.isArray(content.instructions)) {
    doc.fontSize(12).text("Instructions", { underline: true });
    content.instructions.forEach((item) => {
      doc.fontSize(10).text(`• ${item}`);
    });
    doc.moveDown();
  } else if (paper.instructions) {
    doc.fontSize(12).text("Instructions", { underline: true });
    doc.fontSize(10).text(paper.instructions);
    doc.moveDown();
  }

  if (sections.length === 0) {
    doc.fontSize(10).text(JSON.stringify(content, null, 2));
  } else {
    sections.forEach((section) => {
      doc.fontSize(13).text(section.name || "Section", {
        underline: true,
      });
      if (section.instructions) {
        doc.fontSize(10).text(section.instructions);
      }
      doc.moveDown(0.5);

      (section.questions || []).forEach((question, index) => {
        doc
          .fontSize(11)
          .text(
            `Q${question.number || index + 1}. ${
              question.question
            } (${question.marks || 0} marks)`
          );
        doc.moveDown(0.35);
      });
      doc.moveDown();
    });
  }

  doc.end();
};

const generatePaper = async (req, res) => {
  try {
    const paper = await QuestionPaperService.generatePaper({
      ...req.body,
      facultyId: req.user.id,
    });

    res.status(201).json(paper);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

const getAllPapers = async (req, res) => {
  try {
    const papers = await QuestionPaperService.getAllPapers(
      req.user.id
    );

    res.json(papers);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getPaperById = async (req, res) => {
  try {
    const paper = await QuestionPaperService.getPaperById(
      req.params.id
    );

    res.json(paper);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getSharedPaper = async (req, res) => {
  try {
    const paper = await QuestionPaperService.getPaperByShareToken(
      req.params.token
    );

    if (!paper) {
      return res.status(404).json({
        message: "Shared paper not found or not published",
      });
    }

    res.json(paper);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const downloadPaper = async (req, res) => {
  try {
    const paper = await QuestionPaperService.getPaperById(
      req.params.id
    );

    if (!paper || paper.faculty_id !== req.user.id) {
      return res.status(404).json({
        message: "Question paper not found",
      });
    }

    writePaperPdf(paper, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

const updatePublishStatus = async (req, res) => {
  try {
    const result =
      await QuestionPaperService.updatePaperPublishStatus({
        id: req.params.id,
        facultyId: req.user.id,
        publish: Boolean(req.body.publish),
      });

    if (result.count === 0) {
      return res.status(404).json({
        message: "Question paper not found",
      });
    }

    const paper = await QuestionPaperService.getPaperById(
      req.params.id
    );

    res.json(paper);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const deletePaper = async (req, res) => {
  try {
    await QuestionPaperService.deletePaper(req.params.id);

    res.json({
      message: "Deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  generatePaper,
  getAllPapers,
  getPaperById,
  getSharedPaper,
  downloadPaper,
  updatePublishStatus,
  deletePaper,
};
