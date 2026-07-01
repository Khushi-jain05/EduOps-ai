const McqService = require("../services/mcq.service");

const generateMcq = async (req, res) => {
  try {
    const mcq = await McqService.generateMcqSet(
      {
        ...req.body,
        facultyId: req.user.id,
      },
      req.file
    );

    res.status(201).json(mcq);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getAllMcqs = async (req, res) => {
  try {
    const mcqs = await McqService.getAllMcqSets(req.user.id);
    res.json(mcqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const publishMcq = async (req, res) => {
  try {
    const mcq = await McqService.publishMcq(req.params.id, req.user.id);
    res.json(mcq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMcq = async (req, res) => {
  try {
    await McqService.deleteMcq(req.params.id, req.user.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMcqById = async (req, res) => {
  try {
    const mcq = await McqService.getMcqById(req.params.id, req.user.id);

    if (!mcq) {
      return res.status(404).json({ message: "MCQ set not found" });
    }

    res.json(mcq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSharedMcq = async (req, res) => {
  try {
    const mcq = await McqService.getSharedMcq(req.params.token);

    if (!mcq) {
      return res.status(404).json({ message: "Shared MCQ set not found" });
    }

    res.json(mcq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const downloadMcq = async (req, res) => {
  try {
    const mcq = await McqService.getMcqById(req.params.id, req.user.id);

    if (!mcq) {
      return res.status(404).json({ message: "MCQ set not found" });
    }

    const filename = `${mcq.title || "mcq-set"}`
      .replace(/[^a-z0-9-_]+/gi, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}.txt"`
    );
    res.send(McqService.formatMcqText(mcq));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  generateMcq,
  getAllMcqs,
  publishMcq,
  deleteMcq,
  getMcqById,
  getSharedMcq,
  downloadMcq,
};
