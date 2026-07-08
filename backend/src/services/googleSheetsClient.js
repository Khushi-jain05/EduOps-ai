const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");

const CREDENTIALS_PATH =
  process.env.GOOGLE_SHEETS_CREDENTIALS_PATH ||
  path.resolve(__dirname, "../../credentials/google-service-account.json");

const getSpreadsheetId = (sheetUrl) => {
  if (!sheetUrl) {
    return null;
  }

  const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
};

const getSheetsClient = async () => {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(
      "Google Sheets is not configured. Add a service account key at backend/credentials/google-service-account.json."
    );
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const client = await auth.getClient();

  return google.sheets({ version: "v4", auth: client });
};

const getServiceAccountEmail = () => {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    return null;
  }

  const key = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  return key.client_email || null;
};

module.exports = {
  getSpreadsheetId,
  getSheetsClient,
  getServiceAccountEmail,
};
