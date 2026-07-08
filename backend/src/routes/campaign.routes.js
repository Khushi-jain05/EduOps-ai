const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");

const {
  createCampaign,
  getCampaigns,
  updateCampaign,
  deleteCampaign,
} = require("../controllers/campaign.controller");

router.post("/", auth, createCampaign);
router.get("/", auth, getCampaigns);
router.put("/:id", auth, updateCampaign);
router.delete("/:id", auth, deleteCampaign);

module.exports = router;
