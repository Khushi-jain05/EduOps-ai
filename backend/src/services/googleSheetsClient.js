const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");

const CREDENTIALS_DIR = path.resolve(__dirname, "../../credentials");

const findCredentialsPath = () => {
  if (process.env.GOOGLE_SHEETS_CREDENTIALS_PATH) {
    return fs.existsSync(process.env.GOOGLE_SHEETS_CREDENTIALS_PATH)
      ? process.env.GOOGLE_SHEETS_CREDENTIALS_PATH
      : null;
  }

  if (!fs.existsSync(CREDENTIALS_DIR)) {
    return null;
  }

  const jsonFile = fs
    .readdirSync(CREDENTIALS_DIR)
    .find((file) => file.endsWith(".json"));

  return jsonFile ? path.join(CREDENTIALS_DIR, jsonFile) : null;
};

const getSpreadsheetId = (sheetUrl) => {
  if (!sheetUrl) {
    return null;
  }

  const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
};

const getSheetsClient = async () => {
  const credentialsPath = findCredentialsPath();

  if (!credentialsPath) {
    throw new Error(
      "Google Sheets is not configured. Drop a service account JSON key into backend/credentials/."
    );
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const client = await auth.getClient();

  return google.sheets({ version: "v4", auth: client });
};

const getServiceAccountEmail = () => {
  const credentialsPath = findCredentialsPath();

  if (!credentialsPath) {
    return null;
  }

  const key = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
  return key.client_email || null;
};

module.exports = {
  getSpreadsheetId,
  getSheetsClient,
  getServiceAccountEmail,
};
