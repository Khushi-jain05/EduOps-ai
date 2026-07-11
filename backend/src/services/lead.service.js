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

// Create a lead from a non-admin/system source (e.g. an applicant booking a
// counseling call). No role gate. Dedupes by email so the same applicant does
// not spawn duplicate leads across multiple bookings.
const createLeadFromSystem = async (data) => {
  if (!data.name || !data.phone) {
    throw new Error("Name and phone are required");
  }

  if (data.email) {
    const existing = await prisma.lead.findFirst({ where: { email: data.email } });
    if (existing) {
      await logActivity(existing.id, "note", data.captureNote || "Applicant activity.", null);
      return recalculateLeadScore(existing.id);
    }
  }

  const lead = await prisma.lead.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      course: data.course || null,
      city: data.city || null,
      source: data.source || "Applicant Portal",
      status: data.status || "contacted",
      notes: data.notes || null,
    },
  });

  await logActivity(lead.id, "note", data.captureNote || `Lead captured from ${lead.source}.`, null);
  await recalculateLeadScore(lead.id);
  return lead;
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
    phone: lead.phone,
    email: lead.email,
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

const FOLLOW_UP_CHANNELS = ["call", "whatsapp", "email", "note"];

// Record a real follow-up touch on a lead: logs an activity, optionally bumps a
// brand-new lead to "contacted", and rescores. This is what makes the Smart
// Follow-ups actions actually change the pipeline (recency resets, score moves,
// activity feed + counselor stats update).
const logFollowUp = async (leadId, data, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can log follow-ups");
  }

  const channel = data.channel || "note";

  if (!FOLLOW_UP_CHANNELS.includes(channel)) {
    throw new Error("Invalid follow-up channel");
  }

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });

  if (!lead) {
    throw new Error("Lead not found");
  }

  const channelLabel = {
    call: "Called",
    whatsapp: "Messaged on WhatsApp",
    email: "Emailed",
    note: "Logged a note for",
  }[channel];

  await logActivity(
    leadId,
    channel,
    data.note?.trim() || `${channelLabel} ${lead.name}.`,
    getUserId(user)
  );

  // First real contact moves a brand-new lead into the "contacted" stage.
  const shouldMarkContacted = data.markContacted && lead.status === "new";

  if (shouldMarkContacted) {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: "contacted" },
    });

    await logActivity(
      leadId,
      "status_change",
      `Status changed from new to contacted.`,
      getUserId(user)
    );
  }

  // Recompute the score now that recency + engagement (and maybe status) changed.
  return recalculateLeadScore(leadId);
};

const FOLLOWUP_TYPES = ["call", "whatsapp", "email"];

// A 0-100 quality score for how fast a counselor responds.
const responseQuality = (secs) =>
  secs === 0 ? 50 : secs <= 120 ? 100 : secs <= 300 ? 65 : 35;

const coachingNote = (c) => {
  if (c.leadsAssigned === 0 && c.calls === 0) return "No activity recorded yet";
  if (c.conversionRate >= 35) return "Top performer — assign more hot leads";
  if (c.avgResponseSeconds > 300) return "Response time critical — coach on first response";
  if (c.conversionRate < 15) return "Coach on closing / objection handling";
  if (c.followUpPct < 75) return "Improve follow-up coverage on assigned leads";
  if (c.avgResponseSeconds > 180) return "Strong closer — reduce first-response gap";
  return "Solid contributor — keep it up";
};

const getCounselorPerformance = async (user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can view counselor performance");
  }

  const [assignedLeads, activities, users, totalLeads, enrolledTotal] = await Promise.all([
    prisma.lead.findMany({
      where: { assigned_to: { not: null } },
      select: {
        assigned_to: true,
        status: true,
        created_at: true,
        activities: {
          select: { type: true, created_at: true },
          orderBy: { created_at: "asc" },
        },
      },
    }),
    prisma.leadActivity.findMany({
      where: { created_by: { not: null } },
      select: { created_by: true, type: true },
    }),
    prisma.user.findMany({ select: { id: true, username: true } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "enrolled" } }),
  ]);

  const userNames = Object.fromEntries(users.map((u) => [u.id, u.username]));
  const raw = {};

  const ensure = (id) => {
    if (!raw[id]) {
      raw[id] = {
        userId: id,
        name: userNames[id] || "Unknown",
        leadsAssigned: 0,
        conversions: 0,
        calls: 0,
        followedUp: 0,
        responseTimes: [],
      };
    }
    return raw[id];
  };

  assignedLeads.forEach((lead) => {
    const e = ensure(lead.assigned_to);
    e.leadsAssigned += 1;
    if (lead.status === "enrolled") e.conversions += 1;

    const firstTouch = lead.activities.find((a) => a.type !== "note");
    if (firstTouch) {
      e.responseTimes.push(
        (new Date(firstTouch.created_at).getTime() - new Date(lead.created_at).getTime()) / 1000
      );
    }
    if (lead.activities.some((a) => FOLLOWUP_TYPES.includes(a.type))) {
      e.followedUp += 1;
    }
  });

  activities.forEach((a) => {
    if (a.type === "call") ensure(a.created_by).calls += 1;
  });

  const counselors = Object.values(raw)
    // Only counselors who actually own a book of leads belong on the leaderboard.
    .filter((s) => s.leadsAssigned > 0)
    .map((s) => {
      const conversionRate = s.leadsAssigned > 0 ? (s.conversions / s.leadsAssigned) * 100 : 0;
      const followUpPct = s.leadsAssigned > 0 ? (s.followedUp / s.leadsAssigned) * 100 : 0;
      const avgResponseSeconds =
        s.responseTimes.length > 0
          ? Math.round(s.responseTimes.reduce((a, b) => a + b, 0) / s.responseTimes.length)
          : 0;
      const score = Math.round(
        Math.max(
          0,
          Math.min(
            100,
            0.5 * Math.min(conversionRate * 2.5, 100) +
              0.3 * followUpPct +
              0.2 * responseQuality(avgResponseSeconds)
          )
        )
      );

      const c = {
        userId: s.userId,
        name: s.name,
        calls: s.calls,
        leadsAssigned: s.leadsAssigned,
        conversions: s.conversions,
        conversionRate: Math.round(conversionRate * 10) / 10,
        followUpPct: Math.round(followUpPct),
        avgResponseSeconds,
        score,
      };
      c.note = coachingNote(c);
      return c;
    })
    .sort((a, b) => b.score - a.score || b.conversionRate - a.conversionRate);

  // Team-level rollups.
  const allResponseTimes = Object.values(raw).flatMap((s) => s.responseTimes);
  const teamAvgResponseSeconds =
    allResponseTimes.length > 0
      ? Math.round(allResponseTimes.reduce((a, b) => a + b, 0) / allResponseTimes.length)
      : 0;
  const teamAssigned = Object.values(raw).reduce((sum, s) => sum + s.leadsAssigned, 0);
  const teamFollowedUp = Object.values(raw).reduce((sum, s) => sum + s.followedUp, 0);

  const team = {
    conversionRate: totalLeads > 0 ? Math.round((enrolledTotal / totalLeads) * 1000) / 10 : 0,
    avgResponseSeconds: teamAvgResponseSeconds,
    onTimeFollowUpPct: teamAssigned > 0 ? Math.round((teamFollowedUp / teamAssigned) * 100) : 0,
    activeCounselors: counselors.length,
  };

  const topPerformer = counselors[0] || null;

  const benchmark =
    counselors.length > 0
      ? counselors.reduce((sum, c) => sum + c.score, 0) / counselors.length
      : 0;
  const attentionNeeded = counselors
    .filter((c) => c.score < benchmark)
    .map((c) => ({ name: c.name, score: c.score }));

  // AI coaching insights, generated from the real stats (graceful fallback).
  let coachingInsights = [];

  if (counselors.length > 0) {
    const prompt = `You manage a college admissions counseling team. Per-counselor stats:
${counselors
  .map(
    (c) =>
      `- ${c.name}: ${c.leadsAssigned} leads, ${c.calls} calls, ${c.conversionRate}% conversion, ${c.followUpPct}% follow-up, avg response ${c.avgResponseSeconds}s, score ${c.score}`
  )
  .join("\n")}

Write up to 3 short, specific coaching bullets (max 18 words each), each naming a counselor. Respond with ONLY a JSON array of strings, no other text.`;

    try {
      const rawText = await askGemini(prompt);
      const match = rawText.match(/\[[\s\S]*\]/);
      coachingInsights = JSON.parse(match ? match[0] : rawText).slice(0, 3);
    } catch (error) {
      console.error("[leads] counselor insights AI failed, using fallback:", error.message);
      coachingInsights = counselors
        .slice(0, 3)
        .map((c) => `${c.name} — ${c.note.toLowerCase()} (score ${c.score}).`);
    }
  }

  return { team, counselors, topPerformer, coachingInsights, attentionNeeded };
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
  logFollowUp,
  createLeadFromSystem,
};
