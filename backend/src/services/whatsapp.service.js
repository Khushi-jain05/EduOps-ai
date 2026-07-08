const prisma = require("../config/prisma");
const { sendWhatsAppMessage } = require("./twilioClient");

const isAdmin = (user) => user?.role === "admin";

const renderMessage = (message, lead) =>
  message
    .replace(/{{\s*name\s*}}/gi, lead?.name || "there")
    .replace(/{{\s*course\s*}}/gi, lead?.course || "your course")
    .replace(/{{\s*city\s*}}/gi, lead?.city || "");

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

const sendTest = async (id, phone, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can send test WhatsApp messages");
  }

  if (!phone) {
    throw new Error("Phone number is required");
  }

  const template = await prisma.whatsappTemplate.findUnique({ where: { id } });

  if (!template) {
    throw new Error("WhatsApp template not found");
  }

  const body = renderMessage(template.message, null);

  await sendWhatsAppMessage(phone, body);

  return { message: "Test message sent", body };
};

// Fires automatically from lead.service.js on lead events (creation, status
// change). Trigger values are free text set by the admin on each template —
// "new_lead" on create, "status:<value>" on status change — matched
// literally against WhatsappTemplate.trigger. Errors are swallowed so a
// misconfigured/unreachable WhatsApp provider never breaks lead writes.
const triggerAutomation = async (eventKey, lead) => {
  const templates = await prisma.whatsappTemplate.findMany({
    where: { trigger: eventKey, is_active: true },
  });

  for (const template of templates) {
    const body = renderMessage(template.message, lead);

    try {
      await sendWhatsAppMessage(lead.phone, body);

      await prisma.whatsappTemplate.update({
        where: { id: template.id },
        data: { sent_count: { increment: 1 } },
      });

      await prisma.leadActivity.create({
        data: {
          lead_id: lead.id,
          type: "whatsapp",
          message: `Sent "${template.name}" via WhatsApp.`,
        },
      });
    } catch (error) {
      console.error(`[whatsapp] automation "${template.name}" failed for lead ${lead.id}:`, error.message);

      await prisma.leadActivity.create({
        data: {
          lead_id: lead.id,
          type: "whatsapp",
          message: `Failed to send "${template.name}" via WhatsApp: ${error.message}`,
        },
      });
    }
  }
};

module.exports = {
  createTemplate,
  getTemplates,
  updateTemplate,
  toggleTemplate,
  deleteTemplate,
  sendTest,
  triggerAutomation,
};
