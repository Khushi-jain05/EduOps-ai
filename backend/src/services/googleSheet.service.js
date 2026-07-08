const prisma = require("../config/prisma");

const isAdmin = (user) => user?.role === "admin";

const getOrCreateStatus = async () => {
  const existing = await prisma.googleSheetSync.findFirst();

  if (existing) {
    return existing;
  }

  return prisma.googleSheetSync.create({ data: {} });
};

const getStatus = async (user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can view Google Sheets sync status");
  }

  return getOrCreateStatus();
};

const syncNow = async (user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can trigger a Google Sheets sync");
  }

  const status = await getOrCreateStatus();
  const leadCount = await prisma.lead.count();

  return prisma.googleSheetSync.update({
    where: { id: status.id },
    data: {
      status: "connected",
      last_synced_at: new Date(),
      synced_rows: leadCount,
    },
  });
};

const updateSheetUrl = async (sheetUrl, user) => {
  if (!isAdmin(user)) {
    throw new Error("Only admin can update the Google Sheet URL");
  }

  const status = await getOrCreateStatus();

  return prisma.googleSheetSync.update({
    where: { id: status.id },
    data: { sheet_url: sheetUrl },
  });
};

module.exports = {
  getStatus,
  syncNow,
  updateSheetUrl,
};
