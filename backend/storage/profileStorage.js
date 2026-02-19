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
