const CampaignService = require("../services/campaign.service");

const sendError = (res, error, fallback = "Campaign request failed") => {
  console.error("[campaigns]", error);

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

const createCampaign = async (req, res) => {
  try {
    const campaign = await CampaignService.createCampaign(req.body, req.user);
    res.status(201).json(campaign);
  } catch (error) {
    sendError(res, error, "Failed to create campaign");
  }
};

const getCampaigns = async (req, res) => {
  try {
    const campaigns = await CampaignService.getCampaigns(req.user);
    res.json(campaigns);
  } catch (error) {
    sendError(res, error, "Failed to fetch campaigns");
  }
};

const updateCampaign = async (req, res) => {
  try {
    const campaign = await CampaignService.updateCampaign(req.params.id, req.body, req.user);
    res.json(campaign);
  } catch (error) {
    sendError(res, error, "Failed to update campaign");
  }
};

const deleteCampaign = async (req, res) => {
  try {
    const result = await CampaignService.deleteCampaign(req.params.id, req.user);
    res.json(result);
  } catch (error) {
    sendError(res, error, "Failed to delete campaign");
  }
};

module.exports = {
  createCampaign,
  getCampaigns,
  updateCampaign,
  deleteCampaign,
};
