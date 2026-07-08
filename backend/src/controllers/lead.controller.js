const LeadService = require("../services/lead.service");

const sendError = (res, error, fallback = "Lead request failed") => {
  console.error("[leads]", error);

  const message = error.message || fallback;
  const status =
    message.includes("Only admin")
      ? 403
      : message.includes("not found")
        ? 404
        : message.includes("required") || message.includes("Invalid")
          ? 400
          : 500;

  res.status(status).json({ message });
};

const createLead = async (req, res) => {
  try {
    const lead = await LeadService.createLead(req.body, req.user);
    res.status(201).json(lead);
  } catch (error) {
    sendError(res, error, "Failed to create lead");
  }
};

const getLeads = async (req, res) => {
  try {
    const leads = await LeadService.getLeads(req.query, req.user);
    res.json(leads);
  } catch (error) {
    sendError(res, error, "Failed to fetch leads");
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await LeadService.getLeadById(req.params.id, req.user);
    res.json(lead);
  } catch (error) {
    sendError(res, error, "Failed to fetch lead");
  }
};

const updateLead = async (req, res) => {
  try {
    const lead = await LeadService.updateLead(req.params.id, req.body, req.user);
    res.json(lead);
  } catch (error) {
    sendError(res, error, "Failed to update lead");
  }
};

const deleteLead = async (req, res) => {
  try {
    const result = await LeadService.deleteLead(req.params.id, req.user);
    res.json(result);
  } catch (error) {
    sendError(res, error, "Failed to delete lead");
  }
};

const getLeadStats = async (req, res) => {
  try {
    const stats = await LeadService.getLeadStats(req.user);
    res.json(stats);
  } catch (error) {
    sendError(res, error, "Failed to fetch lead stats");
  }
};

const getLeadScoring = async (req, res) => {
  try {
    const scoring = await LeadService.getLeadScoring(req.user);
    res.json(scoring);
  } catch (error) {
    sendError(res, error, "Failed to fetch lead scoring");
  }
};

const getActivity = async (req, res) => {
  try {
    const activity = await LeadService.getActivity(req.user);
    res.json(activity);
  } catch (error) {
    sendError(res, error, "Failed to fetch lead activity");
  }
};

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  getLeadStats,
  getLeadScoring,
  getActivity,
};
