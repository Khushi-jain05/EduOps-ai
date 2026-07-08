const prisma = require("../config/prisma");

const isAdmin = (user) => user?.role === "admin";
const getUserId = (user) => user?.id || user?.userId || user?.sub;

const STATUSES = ["draft", "active", "paused", "completed"];

const createCampaign = async (data, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can create campaigns");
  }

  if (!data.name || !data.channel) {
    throw new Error("Name and channel are required");
  }

  return prisma.campaign.create({
    data: {
      name: data.name,
      channel: data.channel,
      status: data.status || "draft",
      audience_count: Number(data.audience_count) || 0,
      sent_count: 0,
      created_by: getUserId(user),
    },
  });
};

const getCampaigns = async (user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can view campaigns");
  }

  return prisma.campaign.findMany({ orderBy: { created_at: "desc" } });
};

const updateCampaign = async (id, data, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can update campaigns");
  }

  const existing = await prisma.campaign.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("Campaign not found");
  }

  const updateData = {};

  ["name", "channel"].forEach((field) => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  if (data.audience_count !== undefined) {
    updateData.audience_count = Number(data.audience_count) || 0;
  }

  if (data.status !== undefined) {
    if (!STATUSES.includes(data.status)) {
      throw new Error("Invalid status value");
    }
    updateData.status = data.status;
  }

  return prisma.campaign.update({ where: { id }, data: updateData });
};

const deleteCampaign = async (id, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can delete campaigns");
  }

  await prisma.campaign.delete({ where: { id } });

  return { message: "Campaign deleted successfully" };
};

module.exports = {
  createCampaign,
  getCampaigns,
  updateCampaign,
  deleteCampaign,
};
