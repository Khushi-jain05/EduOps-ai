const { execFile } = require("child_process");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const { promisify } = require("util");
const pdfParse = require("pdf-parse");

const execFileAsync = promisify(execFile);

const cleanText = (value = "") =>
  String(value)
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const truncate = (value = "", limit = 18000) => {
  const text = cleanText(value);
  return text.length > limit ? `${text.slice(0, limit)}\n...` : text;
};

const extractPptxText = async (file) => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "eduops-pptx-"));
  const filePath = path.join(tempDir, file.originalname || "slides.pptx");

  try {
    await fs.writeFile(filePath, file.buffer);
    const { stdout } = await execFileAsync("unzip", [
      "-p",
      filePath,
      "ppt/slides/slide*.xml",
    ]);

    return cleanText(
      stdout
        .replace(/<a:t[^>]*>/g, " ")
        .replace(/<\/a:t>/g, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
    );
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
};

const extractFileText = async (file) => {
  if (!file) return "";

  const extension = path.extname(file.originalname || "").toLowerCase();
  const mime = file.mimetype || "";

  if (mime.includes("pdf") || extension === ".pdf") {
    const pdf = await pdfParse(file.buffer);
    return cleanText(pdf.text);
  }

  if (
    mime.includes("presentation") ||
    extension === ".pptx" ||
    extension === ".ppt"
  ) {
    if (extension === ".ppt") {
      throw new Error("Please upload PPTX files. Legacy PPT is not supported.");
    }
    return extractPptxText(file);
  }

  if (
    mime.startsWith("text/") ||
    [".txt", ".md", ".csv", ".html"].includes(extension)
  ) {
    return cleanText(file.buffer.toString("utf8"));
  }

  throw new Error("Only PDF, PPTX, TXT, MD, CSV, and HTML content is supported.");
};

const chunkText = (text, size = 1200, overlap = 160) => {
  const normalized = cleanText(text);
  if (!normalized) return [];

  const chunks = [];
  for (let start = 0; start < normalized.length; start += size - overlap) {
    chunks.push(normalized.slice(start, start + size));
  }
  return chunks;
};

const rankChunks = (chunks, query) => {
  const keywords = cleanText(query)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2);

  return chunks
    .map((chunk, index) => {
      const lower = chunk.toLowerCase();
      const score = keywords.reduce(
        (total, word) => total + (lower.includes(word) ? 1 : 0),
        0
      );
      return { chunk, index, score };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 10)
    .map((item, index) => `Context chunk ${index + 1}:\n${item.chunk}`)
    .join("\n\n");
};

module.exports = {
  chunkText,
  cleanText,
  extractFileText,
  extractPptxText,
  rankChunks,
  truncate,
};
