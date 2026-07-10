const prisma = require("../config/prisma");
const WhatsappService = require("./whatsapp.service");
const { askGemini } = require("./gemini.service");
const { computeLeadScore } = require("./scoring.service");

const isAdmin = (user) => user?.role === "admin";
const getUserId = (user) => user?.id || user?.userId || user?.sub;

const STATUSES = ["new", "contacted", "hot", "enrolled", "lost"];

// Recompute a lead's intent score from its real signals and persist it.
const recalculateLeadScore = async (leadId) => {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { activities: true, calls: true },
  });

  if (!lead) {
    return null;
  }

  const { score } = computeLeadScore(lead, lead.activities, lead.calls.length);

  return prisma.lead.update({ where: { id: leadId }, data: { score } });
};

const logActivity = (leadId, type, message, createdBy) =>
  prisma.leadActivity.create({
    data: {
      lead_id: leadId,
      type,
      message,
      created_by: createdBy || null,
    },
  });

const createLead = async (data, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can create leads");
  }

  if (!data.name || !data.phone) {
    throw new Error("Name and phone are required");
  }

  const lead = await prisma.lead.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      course: data.course || null,
      city: data.city || null,
      source: data.source || "Website",
      score: Number(data.score) || 0,
      status: data.status || "new",
      assigned_to: data.assigned_to || null,
      notes: data.notes || null,
    },
  });

  await logActivity(
    lead.id,
    "note",
    `Lead captured from ${lead.source}.`,
    getUserId(user)
  );

  await WhatsappService.triggerAutomation("new_lead", lead).catch((error) =>
    console.error("[leads] new_lead automation failed:", error.message)
  );

  // Auto-score the freshly captured lead from its real signals.
  return recalculateLeadScore(lead.id);
};

const getLeads = async (query, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can view leads");
  }

  const where = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.course) {
    where.course = query.course;
  }

  if (query.city) {
    where.city = query.city;
  }

  if (query.q) {
    where.OR = [
      { name: { contains: query.q, mode: "insensitive" } },
      { phone: { contains: query.q, mode: "insensitive" } },
      { email: { contains: query.q, mode: "insensitive" } },
      { course: { contains: query.q, mode: "insensitive" } },
      { city: { contains: query.q, mode: "insensitive" } },
    ];
  }

  return prisma.lead.findMany({
    where,
    orderBy: { created_at: "desc" },
    include: { User: true },
  });
};

const getLeadById = async (id, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can view leads");
  }

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { User: true, activities: { orderBy: { created_at: "desc" } } },
  });

  if (!lead) {
    throw new Error("Lead not found");
  }

  return lead;
};

const updateLead = async (id, data, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can update leads");
  }

  const existing = await prisma.lead.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Lead not found");
  }

  const updateData = {};

  ["name", "phone", "email", "course", "city", "source", "notes", "assigned_to"].forEach(
    (field) => {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }
  );

  // Score is derived automatically by the engine, never set by hand.

  if (data.status !== undefined) {
    if (!STATUSES.includes(data.status)) {
      throw new Error("Invalid status value");
    }
    updateData.status = data.status;
  }

  const lead = await prisma.lead.update({
    where: { id },
    data: updateData,
  });

  if (data.status && data.status !== existing.status) {
    await logActivity(
      lead.id,
      "status_change",
      `Status changed from ${existing.status} to ${lead.status}.`,
      getUserId(user)
    );

    await WhatsappService.triggerAutomation(`status:${lead.status}`, lead).catch((error) =>
      console.error("[leads] status automation failed:", error.message)
    );
  }

  // Any change (status, profile fields, new touchpoint) shifts intent — rescore.
  return recalculateLeadScore(lead.id);
};

const deleteLead = async (id, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can delete leads");
  }

  await prisma.lead.delete({ where: { id } });

  return { message: "Lead deleted successfully" };
};

const getLeadStats = async (user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can view lead stats");
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalLeads30d, hotLeads, enrolledThisMonth, enrolledTotal, totalAllTime] =
    await Promise.all([
      prisma.lead.count({ where: { created_at: { gte: thirtyDaysAgo } } }),
      prisma.lead.count({ where: { score: { gte: 80 } } }),
      prisma.lead.count({
        where: { status: "enrolled", updated_at: { gte: monthStart } },
      }),
      prisma.lead.count({ where: { status: "enrolled" } }),
      prisma.lead.count(),
    ]);

  const conversionRate =
    totalAllTime > 0 ? (enrolledTotal / totalAllTime) * 100 : 0;

  return {
    totalLeads30d,
    hotLeads,
    enrolledThisMonth,
    conversionRate: Math.round(conversionRate * 10) / 10,
  };
};

const getLeadScoring = async (user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can view lead scoring");
  }

  const leads = await prisma.lead.findMany({
    select: { status: true, score: true },
  });

  const buckets = STATUSES.reduce((acc, status) => {
    acc[status] = { status, count: 0, totalScore: 0 };
    return acc;
  }, {});

  leads.forEach((lead) => {
    const bucket = buckets[lead.status] || (buckets[lead.status] = {
      status: lead.status,
      count: 0,
      totalScore: 0,
    });
    bucket.count += 1;
    bucket.totalScore += lead.score;
  });

  return Object.values(buckets).map((bucket) => ({
    status: bucket.status,
    count: bucket.count,
    avgScore: bucket.count > 0 ? Math.round(bucket.totalScore / bucket.count) : 0,
  }));
};

// Recompute and persist scores for every lead. Used to backfill existing leads
// and to refresh after time-based factors (recency) drift.
const recalculateAllScores = async (user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can recalculate scores");
  }

  const leads = await prisma.lead.findMany({
    include: { activities: true, calls: true },
  });

  await Promise.all(
    leads.map((lead) => {
      const { score } = computeLeadScore(lead, lead.activities, lead.calls.length);
      return prisma.lead.update({ where: { id: lead.id }, data: { score } });
    })
  );

  return { updated: leads.length };
};

// Explain a single lead's score: return the per-factor breakdown.
const getLeadScoreBreakdown = async (id, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can view score breakdown");
  }

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { activities: true, calls: true },
  });

  if (!lead) {
    throw new Error("Lead not found");
  }

  const { score, factors } = computeLeadScore(lead, lead.activities, lead.calls.length);

  return { id: lead.id, name: lead.name, score, factors };
};

const getActivity = async (user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can view lead activity");
  }

  return prisma.leadActivity.findMany({
    orderBy: { created_at: "desc" },
    take: 30,
    include: { Lead: true },
  });
};

const periodStats = async (start, end) => {
  const [newLeads, hotVelocity, totalInWindow, enrolledInWindow, leadsWithFirstTouch] =
    await Promise.all([
      prisma.lead.count({ where: { created_at: { gte: start, lt: end } } }),
      prisma.leadActivity.count({
        where: {
          type: "status_change",
          message: { contains: "to hot" },
          created_at: { gte: start, lt: end },
        },
      }),
      prisma.lead.count({ where: { created_at: { gte: start, lt: end } } }),
      prisma.lead.count({
        where: { created_at: { gte: start, lt: end }, status: "enrolled" },
      }),
      prisma.lead.findMany({
        where: { created_at: { gte: start, lt: end } },
        select: {
          created_at: true,
          activities: {
            where: { type: { not: "note" } },
            orderBy: { created_at: "asc" },
            take: 1,
            select: { created_at: true },
          },
        },
      }),
    ]);

  const responseTimes = leadsWithFirstTouch
    .filter((lead) => lead.activities.length > 0)
    .map(
      (lead) =>
        (new Date(lead.activities[0].created_at).getTime() -
          new Date(lead.created_at).getTime()) /
        1000
    );

  const avgResponseSeconds =
    responseTimes.length > 0
      ? Math.round(responseTimes.reduce((sum, s) => sum + s, 0) / responseTimes.length)
      : 0;

  const conversionRate = totalInWindow > 0 ? (enrolledInWindow / totalInWindow) * 100 : 0;

  return { newLeads, hotVelocity, avgResponseSeconds, conversionRate };
};

const deltaPct = (curr, prior) => {
  if (prior === 0) return curr > 0 ? 100 : 0;
  return Math.round(((curr - prior) / prior) * 1000) / 10;
};

const getWorkspaceStats = async (user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can view workspace stats");
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [openLeads, hotLeads, currentPeriod, priorPeriod] = await Promise.all([
    prisma.lead.count({ where: { status: { notIn: ["enrolled", "lost"] } } }),
    prisma.lead.count({ where: { score: { gte: 80 } } }),
    periodStats(weekAgo, now),
    periodStats(twoWeeksAgo, weekAgo),
  ]);

  return {
    openLeads: {
      value: openLeads,
      deltaPct: deltaPct(currentPeriod.newLeads, priorPeriod.newLeads),
    },
    hotLeads: {
      value: hotLeads,
      deltaPct: deltaPct(currentPeriod.hotVelocity, priorPeriod.hotVelocity),
    },
    avgResponseSeconds: {
      value: currentPeriod.avgResponseSeconds,
      deltaPct: deltaPct(currentPeriod.avgResponseSeconds, priorPeriod.avgResponseSeconds),
    },
    conversionRate: {
      value: Math.round(currentPeriod.conversionRate * 10) / 10,
      deltaPct: deltaPct(currentPeriod.conversionRate, priorPeriod.conversionRate),
    },
  };
};

const getFollowUpSuggestions = async (user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can view follow-up suggestions");
  }

  const leads = await prisma.lead.findMany({
    where: { status: { in: ["new", "contacted"] } },
    include: {
      activities: { orderBy: { created_at: "desc" }, take: 1 },
    },
    take: 50,
  });

  const withRecency = leads
    .map((lead) => {
      const lastActivityAt = lead.activities[0]?.created_at || lead.created_at;
      const daysSinceContact = Math.floor(
        (Date.now() - new Date(lastActivityAt).getTime()) / 86400000
      );
      return { ...lead, daysSinceContact };
    })
    .sort((a, b) => b.daysSinceContact - a.daysSinceContact || b.score - a.score)
    .slice(0, 15);

  if (withRecency.length === 0) {
    return [];
  }

  const prompt = `You are a lead-follow-up assistant for a college admissions team. For each lead below, write ONE short, specific sentence suggesting what the counselor should say or do next. Respond with ONLY a JSON array like [{"id": "<lead id>", "suggestion": "..."}], no other text.

Leads:
${withRecency
  .map(
    (l) =>
      `- id: ${l.id}, name: ${l.name}, course: ${l.course || "unspecified"}, status: ${l.status}, score: ${l.score}, days since last contact: ${l.daysSinceContact}`
  )
  .join("\n")}`;

  let suggestionsById = {};

  try {
    const raw = await askGemini(prompt);
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    suggestionsById = Object.fromEntries(parsed.map((item) => [item.id, item.suggestion]));
  } catch (error) {
    console.error("[leads] follow-up AI suggestion failed:", error.message);
  }

  return withRecency.map((lead) => ({
    id: lead.id,
    name: lead.name,
    course: lead.course,
    city: lead.city,
    status: lead.status,
    score: lead.score,
    daysSinceContact: lead.daysSinceContact,
    suggestion:
      suggestionsById[lead.id] ||
      `Follow up on ${lead.course || "their"} interest — no contact in ${lead.daysSinceContact}d.`,
  }));
};

const getCounselorPerformance = async (user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can view counselor performance");
  }

  const [leads, activities, users] = await Promise.all([
    prisma.lead.findMany({
      where: { assigned_to: { not: null } },
      select: { assigned_to: true, status: true },
    }),
    prisma.leadActivity.findMany({
      where: { created_by: { not: null } },
      select: { created_by: true, type: true },
    }),
    prisma.user.findMany({ select: { id: true, username: true } }),
  ]);

  const userNames = Object.fromEntries(users.map((u) => [u.id, u.username]));
  const stats = {};

  const ensure = (id) => {
    if (!stats[id]) {
      stats[id] = {
        userId: id,
        name: userNames[id] || "Unknown",
        leadsAssigned: 0,
        conversions: 0,
        calls: 0,
      };
    }
    return stats[id];
  };

  leads.forEach((lead) => {
    const entry = ensure(lead.assigned_to);
    entry.leadsAssigned += 1;
    if (lead.status === "enrolled") {
      entry.conversions += 1;
    }
  });

  activities.forEach((activity) => {
    const entry = ensure(activity.created_by);
    if (activity.type === "call") {
      entry.calls += 1;
    }
  });

  const counselors = Object.values(stats).sort(
    (a, b) => b.conversions - a.conversions || b.leadsAssigned - a.leadsAssigned
  );

  let insight = "";

  if (counselors.length > 0) {
    const prompt = `You manage a college admissions counseling team. Here is each counselor's stats (leads assigned, calls logged, conversions to enrolled):
${counselors
  .map((c) => `- ${c.name}: ${c.leadsAssigned} leads, ${c.calls} calls, ${c.conversions} conversions`)
  .join("\n")}

Write ONE short sentence (max 25 words) highlighting the standout performer or an actionable observation about the team's workload balance. Respond with only that sentence, no preamble.`;

    try {
      insight = (await askGemini(prompt)).trim();
    } catch (error) {
      console.error("[leads] counselor insight AI failed:", error.message);
    }
  }

  return { counselors, insight };
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
  getWorkspaceStats,
  getFollowUpSuggestions,
  getCounselorPerformance,
  recalculateLeadScore,
  recalculateAllScores,
  getLeadScoreBreakdown,
};
