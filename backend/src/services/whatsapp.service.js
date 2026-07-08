const prisma = require("../config/prisma");

const isAdmin = (user) => user?.role === "admin";

const createTemplate = async (data, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can create WhatsApp templates");
  }

  if (!data.name || !data.trigger || !data.message) {
    throw new Error("Name, trigger and message are required");
  }

  return prisma.whatsappTemplate.create({
    data: {
      name: data.name,
      trigger: data.trigger,
      message: data.message,
      is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
    },
  });
};

const getTemplates = async (user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can view WhatsApp templates");
  }

  return prisma.whatsappTemplate.findMany({ orderBy: { created_at: "desc" } });
};

const updateTemplate = async (id, data, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can update WhatsApp templates");
  }

  const existing = await prisma.whatsappTemplate.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("WhatsApp template not found");
  }

  const updateData = {};

  ["name", "trigger", "message"].forEach((field) => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  if (data.is_active !== undefined) {
    updateData.is_active = Boolean(data.is_active);
  }

  return prisma.whatsappTemplate.update({ where: { id }, data: updateData });
};

const toggleTemplate = async (id, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can toggle WhatsApp templates");
  }

  const existing = await prisma.whatsappTemplate.findUnique({ where: { id } });

  if (!existing) {
    throw new Error("WhatsApp template not found");
  }

  return prisma.whatsappTemplate.update({
    where: { id },
    data: { is_active: !existing.is_active },
  });
};

const deleteTemplate = async (id, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can delete WhatsApp templates");
  }

  await prisma.whatsappTemplate.delete({ where: { id } });

  return { message: "Template deleted successfully" };
};

module.exports = {
  createTemplate,
  getTemplates,
  updateTemplate,
  toggleTemplate,
  deleteTemplate,
};
