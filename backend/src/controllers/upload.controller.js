const {
  uploadNotesService,
} = require("../services/upload.service");

const uploadNotes = async (req, res) => {
  try {
    const result = await uploadNotesService(
      req.file,
      req.body
    );

    res.status(201).json(result);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  uploadNotes,
};