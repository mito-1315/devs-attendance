import sheets from "../middleware/googlesheetsapi.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Fetch the spreadsheet name
 * @param {string} spreadsheetId - The ID of the Google Sheet
 * @returns {Promise<string>} - Name of the spreadsheet
 */
export async function fetchSpreadsheetName(spreadsheetId) {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    
    return response.data.properties.title;
  } catch (error) {
    throw new Error(`Failed to fetch spreadsheet name: ${error.message}`);
  }
}

/**
 * Fetch headers from the first row of the sheet
 * @param {string} spreadsheetId - The ID of the Google Sheet
 * @returns {Promise<Array<string>>} - Array of header values
 */
export async function fetchHeaders(spreadsheetId) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A1:Z1", // Fetch first row
    });
    
    const headers = response.data.values ? response.data.values[0] : [];
    return headers;
  } catch (error) {
    throw new Error(`Failed to fetch headers: ${error.message}`);
  }
}

/**
 * Fetch all data from the sheet except headers
 * @param {string} spreadsheetId - The ID of the Google Sheet
 * @returns {Promise<Array<Array<any>>>} - 2D array of data rows
 */
export async function fetchData(spreadsheetId) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A2:E", // Fetch from row 2 onwards (skip header)
    });
    
    const data = response.data.values || [];
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch data: ${error.message}`);
  }
}

/**
 * Check if a sheet_id already exists in SHEET_HISTORY
 * @param {string} sheetId - The sheet ID to check
 * @returns {Promise<boolean>} - True if sheet_id exists, false otherwise
 */
export async function checkSheetIdExists(sheetId) {
  try {
    const historySpreadsheetId = process.env.SHEET_HISTORY;
    
    if (!historySpreadsheetId) {
      throw new Error("SHEET_HISTORY environment variable is not set");
    }

    // Fetch all sheet_ids from column C (sheet_id column)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: historySpreadsheetId,
      range: "Sheet1!C:C", // Column C contains sheet_id
    });

    const sheetIds = response.data.values || [];
    
    // Skip header row (index 0) and check if sheetId exists
    for (let i = 1; i < sheetIds.length; i++) {
      if (sheetIds[i][0] === sheetId) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    throw new Error(`Failed to check sheet_id existence: ${error.message}`);
  }
}

/**
 * Add a row to SHEET_HISTORY spreadsheet
 * @param {Object} historyData - Data to add to history
 * @param {string} historyData.sheet_name - Name of the sheet
 * @param {string} historyData.sheet_link - Link to the sheet
 * @param {string} historyData.sheet_id - ID of the sheet
 * @param {string} historyData.event_name - Name of the event
 * @param {string} historyData.uploaded_by - Username of the uploader
 * @param {string} historyData.uploaded_at - Timestamp of upload
 * @param {string} historyData.status - Status (e.g., "active")
 * @returns {Promise<void>}
 */
export async function addToSheetHistory(historyData) {
  try {
    const historySpreadsheetId = process.env.SHEET_HISTORY;
    
    if (!historySpreadsheetId) {
      throw new Error("SHEET_HISTORY environment variable is not set");
    }

    const values = [[
      historyData.sheet_name,
      historyData.sheet_link,
      historyData.sheet_id,
      historyData.event_name,
      historyData.uploaded_by,
      historyData.uploaded_at,
      historyData.status,
      historyData.closed_at || "" // Leave empty if not provided
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: historySpreadsheetId,
      range: "Sheet1!A:H", // Assuming SHEET_HISTORY is in Sheet1
      valueInputOption: "RAW",
      resource: {
        values: values
      }
    });

    return { success: true };
  } catch (error) {
    throw new Error(`Failed to add to sheet history: ${error.message}`);
  }
}
