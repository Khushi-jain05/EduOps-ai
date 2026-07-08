const prisma = require("../config/prisma");

const isAdmin = (user) => user?.role === "admin";
const getUserId = (user) => user?.id || user?.userId || user?.sub;

const STATUSES = ["new", "contacted", "hot", "enrolled", "lost"];

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

  if (data.score !== undefined) {
    updateData.score = Number(data.score) || 0;
  }

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
  }

  return lead;
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
