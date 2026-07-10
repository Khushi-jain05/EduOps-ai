const prisma = require("../config/prisma");
const { askGemini } = require("./gemini.service");

const isAdmin = (user) => user?.role === "admin";
const getUserId = (user) => user?.id || user?.userId || user?.sub;

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const createAgent = async (data, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can create AI voice agents");
  }

  if (!data.name || !data.role_label) {
    throw new Error("Name and role label are required");
  }

  return prisma.aiVoiceAgent.create({
    data: {
      name: data.name,
      role_label: data.role_label,
      languages: data.languages || "EN",
      description: data.description || null,
      is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
      created_by: getUserId(user),
    },
  });
};

const getAgents = async (user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can view AI voice agents");
  }

  const today = startOfToday();

  const agents = await prisma.aiVoiceAgent.findMany({
    orderBy: { created_at: "asc" },
    include: {
      calls: {
        where: { started_at: { gte: today } },
      },
    },
  });

  return agents.map((agent) => {
    const callsToday = agent.calls.length;
    const successfulCalls = agent.calls.filter((c) =>
      ["connected", "completed"].includes(c.status)
    ).length;

    const { calls, ...rest } = agent;

    return {
      ...rest,
      callsToday,
      successRate:
        callsToday > 0 ? Math.round((successfulCalls / callsToday) * 100) : 0,
    };
  });
};

const updateAgent = async (id, data, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can update AI voice agents");
  }

  const existing = await prisma.aiVoiceAgent.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("AI voice agent not found");
  }

  const updateData = {};

  ["name", "role_label", "languages", "description"].forEach((field) => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  if (data.is_active !== undefined) {
    updateData.is_active = Boolean(data.is_active);
  }

  return prisma.aiVoiceAgent.update({
    where: { id },
    data: updateData,
  });
};

const toggleAgent = async (id, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can toggle AI voice agents");
  }

  const existing = await prisma.aiVoiceAgent.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("AI voice agent not found");
  }

  return prisma.aiVoiceAgent.update({
    where: { id },
    data: { is_active: !existing.is_active },
  });
};

const getCallStats = async (user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can view call stats");
  }

  const today = startOfToday();

  const callsToday = await prisma.callLog.findMany({
    where: { started_at: { gte: today } },
    include: { Lead: true },
  });

  const total = callsToday.length;
  const connected = callsToday.filter((c) =>
    ["connected", "completed"].includes(c.status)
  );
  const withDuration = callsToday.filter((c) => c.duration_seconds != null);
  const hotHandoffs = callsToday.filter(
    (c) =>
      ["connected", "completed"].includes(c.status) &&
      c.Lead &&
      c.Lead.score >= 80
  );

  const avgHandleSeconds =
    withDuration.length > 0
      ? Math.round(
          withDuration.reduce((sum, c) => sum + c.duration_seconds, 0) /
            withDuration.length
        )
      : 0;

  return {
    callsToday: total,
    connectedCount: connected.length,
    connectedRate: total > 0 ? Math.round((connected.length / total) * 100) : 0,
    avgHandleSeconds,
    hotHandoffs: hotHandoffs.length,
  };
};

const getQueue = async (user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can view the call queue");
  }

  return prisma.callLog.findMany({
    where: { status: { in: ["queued", "ringing", "in_call", "no_answer"] } },
    include: { Lead: true, AiVoiceAgent: true },
    orderBy: { started_at: "desc" },
    take: 20,
  });
};

const testCall = async (agentId, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can trigger a test call");
  }

  const agent = await prisma.aiVoiceAgent.findUnique({ where: { id: agentId } });

  if (!agent) {
    throw new Error("AI voice agent not found");
  }

  return prisma.callLog.create({
    data: {
      agent_id: agentId,
      phone: "+91 00000 00000",
      status: "queued",
    },
    include: { AiVoiceAgent: true },
  });
};

const generateTranscript = async (callId, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can generate a call transcript");
  }

  const call = await prisma.callLog.findUnique({
    where: { id: callId },
    include: { Lead: true, AiVoiceAgent: true },
  });

  if (!call) {
    throw new Error("Call not found");
  }

  const lead = call.Lead;
  const agent = call.AiVoiceAgent;

  const prompt = `You are simulating a realistic short outbound qualification call for a college admissions AI voice agent, based on real data below. Write a natural 5-6 turn back-and-forth transcript, alternating "agent" and "lead", grounded in the lead's actual course/status/score. End with one concrete next-best-action for the human counselor.

Agent: ${agent.name} — ${agent.role_label} (${agent.languages})${agent.description ? `, style: ${agent.description}` : ""}
Lead: ${lead?.name || "Unknown"}, interested in ${lead?.course || "an unspecified program"}, city ${lead?.city || "unknown"}, pipeline status "${lead?.status || "new"}", intent score ${lead?.score ?? "n/a"}.

Respond with ONLY JSON in this exact shape, no other text:
{"turns":[{"speaker":"agent","text":"..."},{"speaker":"lead","text":"..."}],"nextBestAction":"..."}`;

  const raw = await askGemini(prompt);
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);

  if (!Array.isArray(parsed.turns) || parsed.turns.length === 0) {
    throw new Error("AI returned an unexpected transcript format");
  }

  return {
    callId: call.id,
    leadName: lead?.name || "Unknown",
    agentName: agent.name,
    turns: parsed.turns,
    nextBestAction: parsed.nextBestAction || "",
  };
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
};
