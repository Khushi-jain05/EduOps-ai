const pdfParse = require("pdf-parse");

const uploadNotesService = async (file, body) => {
  const pdf = await pdfParse(file.buffer);

  console.log(pdf.text);

  return {
    message: "PDF Parsed Successfully",
    extractedText: pdf.text,
  };
};

module.exports = {
  uploadNotesService,
};