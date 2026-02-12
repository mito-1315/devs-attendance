import sheets from "../middleware/googlesheetsapi.js";

export async function getSaltAndHash(username) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.ATTENDANCE_SHEET,
    range: "Sheet1!A:H",   // Reads columns A to H
  });

  const rows = response.data.values;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    const sheetUsername = row[0]; // Column A
    const storedHash = row[6];          // Column G
    const saltHex = row[7];          // Column H

    if (sheetUsername === username) {
      return {
        found: true,
        saltHex: saltHex || null,
        storedHash: storedHash || null,
        row: row || null
      };
    }
  }

  return { found: false };
}