const WhatsappService = require("../services/whatsapp.service");

const sendError = (res, error, fallback = "WhatsApp request failed") => {
  console.error("[whatsapp]", error);

  const message = error.message || fallback;
  const status =
    message.includes("Only admin")
      ? 403
      : message.includes("not found")
        ? 404
        : message.includes("required") || message.includes("not configured")
          ? 400
          : 500;

  res.status(status).json({ message });
};

const createTemplate = async (req, res) => {
  try {
    const template = await WhatsappService.createTemplate(req.body, req.user);
    res.status(201).json(template);
  } catch (error) {
    sendError(res, error, "Failed to create WhatsApp template");
  }
};

const getTemplates = async (req, res) => {
  try {
    const templates = await WhatsappService.getTemplates(req.user);
    res.json(templates);
  } catch (error) {
    sendError(res, error, "Failed to fetch WhatsApp templates");
  }
};

const updateTemplate = async (req, res) => {
  try {
    const template = await WhatsappService.updateTemplate(req.params.id, req.body, req.user);
    res.json(template);
  } catch (error) {
    sendError(res, error, "Failed to update WhatsApp template");
  }
};

const toggleTemplate = async (req, res) => {
  try {
    const template = await WhatsappService.toggleTemplate(req.params.id, req.user);
    res.json(template);
  } catch (error) {
    sendError(res, error, "Failed to toggle WhatsApp template");
  }
};

const deleteTemplate = async (req, res) => {
  try {
    const result = await WhatsappService.deleteTemplate(req.params.id, req.user);
    res.json(result);
  } catch (error) {
    sendError(res, error, "Failed to delete WhatsApp template");
  }
};

const sendTest = async (req, res) => {
  try {
    const result = await WhatsappService.sendTest(req.params.id, req.body.phone, req.user);
    res.json(result);
  } catch (error) {
    sendError(res, error, "Failed to send test WhatsApp message");
  }
};

module.exports = {
  createTemplate,
  getTemplates,
  updateTemplate,
  toggleTemplate,
  deleteTemplate,
  sendTest,
};
