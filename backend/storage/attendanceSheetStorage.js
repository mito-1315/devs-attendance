import sheets from "../middleware/googlesheetsapi.js";
import dotenv from "dotenv";

dotenv.config();

/**
 * Fetch all details from a Google Sheet including headers and data
 * @param {string} spreadsheetId - The ID of the Google Sheet
 * @returns {Promise<Object>} - Object containing sheet name, headers, and data
 */
export async function fetchDetails(spreadsheetId) {
  try {
    // Fetch spreadsheet metadata (name)
    const metadataResponse = await sheets.spreadsheets.get({
      spreadsheetId,
    });
    const sheetName = metadataResponse.data.properties.title;

    // Fetch all data including headers
    const dataResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:Z", // Fetch all columns
    });

    const allRows = dataResponse.data.values || [];
    
    if (allRows.length === 0) {
      return {
        sheetName,
        headers: [],
        data: [],
        totalRows: 0,
      };
    }

    // First row is headers, rest is data
    const headers = allRows[0];
    const data = allRows.slice(1);

    return {
      sheetName,
      headers,
      data,
      totalRows: data.length,
      spreadsheetId,
    };
  } catch (error) {
    throw new Error(`Failed to fetch sheet details: ${error.message}`);
  }
}

/**
 * Add commit column to sheet if it doesn't already exist
 * @param {string} spreadsheetId - The ID of the Google Sheet
 * @returns {Promise<Object>} - Result with commitColumnAdded flag and column index
 */
export async function ensureCommitColumn(spreadsheetId) {
  try {
    // Fetch current headers
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A1:Z1",
    });

    const headers = headerResponse.data.values ? headerResponse.data.values[0] : [];
    
    // Check if commit column already exists
    const commitIndex = headers.findIndex(h => 
      h && h.toLowerCase() === 'commit'
    );

    if (commitIndex !== -1) {
      // Commit column already exists
      return {
        commitColumnAdded: false,
        commitColumnIndex: commitIndex,
        message: "Commit column already exists"
      };
    }

    // Find the next available column (after the last non-empty header)
    const nextColumnIndex = headers.length;
    const nextColumnLetter = getColumnLetter(nextColumnIndex);

    // Add "commit" header
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Sheet1!${nextColumnLetter}1`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [["commit"]]
      }
    });

    // Get the total number of rows with data
    const dataResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:A", // Get column A to count rows
    });

    const totalRows = dataResponse.data.values ? dataResponse.data.values.length : 1;

    // Add FALSE checkboxes for all data rows (excluding header)
    if (totalRows > 1) {
      const checkboxValues = [];
      for (let i = 1; i < totalRows; i++) {
        checkboxValues.push([false]);
      }

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Sheet1!${nextColumnLetter}2:${nextColumnLetter}${totalRows}`,
        valueInputOption: "USER_ENTERED",
        resource: {
          values: checkboxValues
        }
      });
    }

    return {
      commitColumnAdded: true,
      commitColumnIndex: nextColumnIndex,
      message: "Commit column added successfully"
    };

  } catch (error) {
    throw new Error(`Failed to ensure commit column: ${error.message}`);
  }
}

/**
 * Update commit status for specific roll numbers
 * @param {string} spreadsheetId - The ID of the Google Sheet
 * @param {Array<string>} rollNumbers - Array of roll numbers to mark as committed
 * @returns {Promise<Object>} - Result with updated count
 */
export async function updateCommitStatus(spreadsheetId, rollNumbers) {
  try {
    // Fetch current headers and data
    const dataResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:Z",
    });

    const allRows = dataResponse.data.values || [];
    
    if (allRows.length === 0) {
      throw new Error("Sheet is empty");
    }

    const headers = allRows[0];
    const data = allRows.slice(1);

    // Find column indices
    const rollNumberIndex = headers.findIndex(h => 
      h && (h.toLowerCase() === 'roll_number' || h.toLowerCase().includes('roll'))
    );
    const attendanceIndex = headers.findIndex(h => 
      h && (h.toLowerCase() === 'attendance' || h.toLowerCase() === 'status')
    );
    const commitIndex = headers.findIndex(h => 
      h && h.toLowerCase() === 'commit'
    );

    if (rollNumberIndex === -1) {
      throw new Error("Roll number column not found");
    }
    if (attendanceIndex === -1) {
      throw new Error("Attendance column not found");
    }
    if (commitIndex === -1) {
      throw new Error("Commit column not found");
    }

    const attendanceColumnLetter = getColumnLetter(attendanceIndex);
    const commitColumnLetter = getColumnLetter(commitIndex);
    const updates = [];
    let updatedCount = 0;

    // Find rows matching the roll numbers and prepare updates
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rollNumber = row[rollNumberIndex];
      
      if (rollNumbers.includes(rollNumber)) {
        const rowNumber = i + 2; // +2 because: 0-indexed array + header row
        // Update attendance column to TRUE
        updates.push({
          range: `Sheet1!${attendanceColumnLetter}${rowNumber}`,
          values: [[true]]
        });
        // Update commit column to TRUE
        updates.push({
          range: `Sheet1!${commitColumnLetter}${rowNumber}`,
          values: [[true]]
        });
        updatedCount++;
      }
    }

    // Batch update all commit columns
    if (updates.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        resource: {
          valueInputOption: "USER_ENTERED",
          data: updates
        }
      });
    }

    return {
      success: true,
      updatedCount,
      message: `${updatedCount} students marked as committed`
    };

  } catch (error) {
    throw new Error(`Failed to update commit status: ${error.message}`);
  }
}

/**
 * Add a new student on-spot to the sheet
 * @param {string} spreadsheetId - The ID of the Google Sheet
 * @param {Object} studentData - Student data {name, roll_number, mail_id, department}
 * @returns {Promise<Object>} - Result with success status
 */
export async function addStudentOnSpot(spreadsheetId, studentData) {
  try {
    const { name, roll_number, mail_id, department } = studentData;

    // Get current sheet structure to find the next row
    const dataResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A:A",
    });

    const totalRows = dataResponse.data.values ? dataResponse.data.values.length : 1;
    const newRowNumber = totalRows + 1;

    // Prepare the new row data: name, roll_number, mail_id, department, attendance=TRUE, commit=TRUE
    const newRow = [name, roll_number, mail_id, department, true, true];

    // Append the new row
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `Sheet1!A${newRowNumber}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [newRow]
      }
    });

    return {
      success: true,
      message: "Student added on-spot successfully",
      studentData: {
        name,
        roll_number,
        mail_id,
        department
      }
    };

  } catch (error) {
    throw new Error(`Failed to add student on-spot: ${error.message}`);
  }
}

/**
 * Convert column index to letter (0 = A, 1 = B, 25 = Z, 26 = AA, etc.)
 * @param {number} index - Column index (0-based)
 * @returns {string} - Column letter
 */
function getColumnLetter(index) {
  let letter = '';
  while (index >= 0) {
    letter = String.fromCharCode((index % 26) + 65) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
}
