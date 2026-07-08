const prisma = require("../config/prisma");
const { getSpreadsheetId, getSheetsClient, getServiceAccountEmail } = require("./googleSheetsClient");

const isAdmin = (user) => user?.role === "admin";

const LEAD_HEADERS = [
  "Name",
  "Phone",
  "Email",
  "Course",
  "City",
  "Source",
  "Score",
  "Status",
  "Created At",
];

const leadToRow = (lead) => [
  lead.name,
  lead.phone,
  lead.email || "",
  lead.course || "",
  lead.city || "",
  lead.source || "",
  lead.score,
  lead.status,
  lead.created_at.toISOString(),
];

const writeLeadsToSheet = async (spreadsheetId, leads) => {
  const sheets = await getSheetsClient();

  const rows = [LEAD_HEADERS, ...leads.map(leadToRow)];

  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: "Sheet1!A:Z",
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "Sheet1!A1",
    valueInputOption: "RAW",
    requestBody: { values: rows },
  });
};

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

  const spreadsheetId = getSpreadsheetId(status.sheet_url);

  if (!spreadsheetId) {
    throw new Error("Add a valid Google Sheet URL before syncing");
  }

  const leads = await prisma.lead.findMany({ orderBy: { created_at: "asc" } });

  try {
    await writeLeadsToSheet(spreadsheetId, leads);
  } catch (error) {
    await prisma.googleSheetSync.update({
      where: { id: status.id },
      data: { status: "error" },
    });

    if (error.code === 403 || error.message?.includes("permission")) {
      const email = getServiceAccountEmail();
      throw new Error(
        `Google denied access to this sheet. Share it with ${email || "the service account"} (Editor access) and try again.`
      );
    }

    throw error;
  }

  return prisma.googleSheetSync.update({
    where: { id: status.id },
    data: {
      status: "connected",
      last_synced_at: new Date(),
      synced_rows: leads.length,
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
