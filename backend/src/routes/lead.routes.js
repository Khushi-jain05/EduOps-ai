const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");

const {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  getLeadStats,
  getLeadScoring,
  getActivity,
} = require("../controllers/lead.controller");

router.get("/stats", auth, getLeadStats);
router.get("/scoring", auth, getLeadScoring);
router.get("/activity", auth, getActivity);
router.post("/", auth, createLead);
router.get("/", auth, getLeads);
router.get("/:id", auth, getLeadById);
router.put("/:id", auth, updateLead);
router.delete("/:id", auth, deleteLead);

module.exports = router;
