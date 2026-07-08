const GoogleSheetService = require("../services/googleSheet.service");

const sendError = (res, error, fallback = "Google Sheets request failed") => {
  console.error("[google-sheets]", error);

  const message = error.message || fallback;
  const status = message.includes("Only admin") ? 403 : 500;

  res.status(status).json({ message });
};

const getStatus = async (req, res) => {
  try {
    const status = await GoogleSheetService.getStatus(req.user);
    res.json(status);
  } catch (error) {
    sendError(res, error, "Failed to fetch Google Sheets status");
  }
};

const syncNow = async (req, res) => {
  try {
    const status = await GoogleSheetService.syncNow(req.user);
    res.json(status);
  } catch (error) {
    sendError(res, error, "Failed to sync Google Sheets");
  }
};

const updateSheetUrl = async (req, res) => {
  try {
    const status = await GoogleSheetService.updateSheetUrl(req.body.sheet_url, req.user);
    res.json(status);
  } catch (error) {
    sendError(res, error, "Failed to update sheet URL");
  }
};

module.exports = {
  getStatus,
  syncNow,
  updateSheetUrl,
};
