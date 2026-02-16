// filepath: e:\Workspace\devs-attendance\backend\middleware\googlesheetsapi.js
import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";

// Get current file directory (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load credentials using GOOGLE_APPLICATION_CREDENTIALS env variable
const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const auth = new google.auth.GoogleAuth({
  keyFile,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

// Create and export the sheets client
const sheets = google.sheets({ version: "v4", auth });

export default sheets;
