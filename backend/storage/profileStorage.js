import sheets from "../middleware/googlesheetsapi.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Fetch user profile data by username from ATTENDANCE_SHEET
 * @param {string} username - The username to query
 * @returns {Promise<Object>} - User profile data
 */
export async function getUserProfile(username) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.ATTENDANCE_SHEET,
      range: "Sheet1!A:F", // username, name, roll_number, department, team, role
    });

    const rows = response.data.values || [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const sheetUsername = row[0]; // Column A

      if (sheetUsername === username) {
        return {
          found: true,
          user: {
            username: row[0] || '',
            name: row[1] || '',
            roll_number: row[2] || '',
            department: row[3] || '',
            team: row[4] || '',
            role: row[5] || ''
          }
        };
      }
    }

    return { found: false };
  } catch (error) {
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }
}

/**
 * Fetch all sessions created by a specific user from SHEET_HISTORY
 * @param {string} username - The username to query
 * @returns {Promise<Array>} - Array of session objects
 */
export async function getUserSessions(username) {
  try {
    const historySpreadsheetId = process.env.SHEET_HISTORY;
    
    if (!historySpreadsheetId) {
      throw new Error("SHEET_HISTORY environment variable is not set");
    }

    // Fetch all data from SHEET_HISTORY
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: historySpreadsheetId,
      range: "Sheet1!A:H", // sheet_name, sheet_link, sheet_id, event_name, uploaded_by, uploaded_at, status, closed_at
    });

    const rows = response.data.values || [];
    const sessions = [];

    // Skip header row (index 0) and filter by username
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const uploadedBy = row[4]; // Column E (uploaded_by)

      if (uploadedBy === username) {
        sessions.push({
          id: row[2] || '', // sheet_id
          name: row[3] || '', // event_name
          sheet_name: row[0] || '',
          sheet_link: row[1] || '',
          uploaded_at: row[5] || '',
          status: row[6] || 'Active', // status (Active or Complete)
          closed_at: row[7] || ''
        });
      }
    }

    // Return in descending order (most recent first)
    return sessions.reverse();
  } catch (error) {
    throw new Error(`Failed to fetch user sessions: ${error.message}`);
  }
}
