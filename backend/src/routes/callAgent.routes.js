const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");

const {
  createAgent,
  getAgents,
  updateAgent,
  toggleAgent,
  getCallStats,
  getQueue,
  testCall,
  generateTranscript,
} = require("../controllers/callAgent.controller");

router.get("/stats", auth, getCallStats);
router.get("/queue", auth, getQueue);
router.post("/", auth, createAgent);
router.get("/", auth, getAgents);
router.put("/:id", auth, updateAgent);
router.patch("/:id/toggle", auth, toggleAgent);
router.post("/:id/test-call", auth, testCall);
router.post("/queue/:callId/transcript", auth, generateTranscript);

module.exports = router;
