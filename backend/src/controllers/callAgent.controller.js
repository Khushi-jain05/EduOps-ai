const CallAgentService = require("../services/callAgent.service");

const sendError = (res, error, fallback = "Call agent request failed") => {
  console.error("[call-agents]", error);

  const message = error.message || fallback;
  const status =
    message.includes("Only admin")
      ? 403
      : message.includes("not found")
        ? 404
        : message.includes("required")
          ? 400
          : 500;

  res.status(status).json({ message });
};

const createAgent = async (req, res) => {
  try {
    const agent = await CallAgentService.createAgent(req.body, req.user);
    res.status(201).json(agent);
  } catch (error) {
    sendError(res, error, "Failed to create AI voice agent");
  }
};

const getAgents = async (req, res) => {
  try {
    const agents = await CallAgentService.getAgents(req.user);
    res.json(agents);
  } catch (error) {
    sendError(res, error, "Failed to fetch AI voice agents");
  }
};

const updateAgent = async (req, res) => {
  try {
    const agent = await CallAgentService.updateAgent(req.params.id, req.body, req.user);
    res.json(agent);
  } catch (error) {
    sendError(res, error, "Failed to update AI voice agent");
  }
};

const toggleAgent = async (req, res) => {
  try {
    const agent = await CallAgentService.toggleAgent(req.params.id, req.user);
    res.json(agent);
  } catch (error) {
    sendError(res, error, "Failed to toggle AI voice agent");
  }
};

const getCallStats = async (req, res) => {
  try {
    const stats = await CallAgentService.getCallStats(req.user);
    res.json(stats);
  } catch (error) {
    sendError(res, error, "Failed to fetch call stats");
  }
};

const getQueue = async (req, res) => {
  try {
    const queue = await CallAgentService.getQueue(req.user);
    res.json(queue);
  } catch (error) {
    sendError(res, error, "Failed to fetch call queue");
  }
};

const testCall = async (req, res) => {
  try {
    const call = await CallAgentService.testCall(req.params.id, req.user);
    res.status(201).json(call);
  } catch (error) {
    sendError(res, error, "Failed to trigger test call");
  }
};

const generateTranscript = async (req, res) => {
  try {
    const transcript = await CallAgentService.generateTranscript(req.params.callId, req.user);
    res.json(transcript);
  } catch (error) {
    sendError(res, error, "Failed to generate call transcript");
  }
};

const launchCampaign = async (req, res) => {
  try {
    const result = await CallAgentService.launchCampaign(req.body, req.user);
    res.status(201).json(result);
  } catch (error) {
    sendError(res, error, "Failed to launch calling campaign");
  }
};

const advanceQueue = async (req, res) => {
  try {
    const result = await CallAgentService.advanceQueue(req.user);
    res.json(result);
  } catch (error) {
    sendError(res, error, "Failed to advance call queue");
  }
};

module.exports = {
  createAgent,
  getAgents,
  updateAgent,
  toggleAgent,
  getCallStats,
  getQueue,
  testCall,
  generateTranscript,
  launchCampaign,
  advanceQueue,
};
