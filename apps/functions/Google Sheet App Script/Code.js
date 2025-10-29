const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwNQ9fFmV0MqVEKg6pk-x56FsCw-xOnX__A3l6hqrlUVukKyx6gf31DpiO4hn4Vep6U5w/exec'; // Updated URL placeholder for clarity
const CACHE_KEY = 'ALL_SHEET_DATA';
const CACHE_EXPIRATION_SECONDS = 21599 ; //6 hours max 
/**
 * Web App entry point to serve the CONSOLIDATED JSON object.
 * Returns all three sheets' data (rate_config, products, ticker) in a single JSON response.
 * @param {Object} e The event object containing URL parameters (not strictly used here, but kept for context).
 */
function doGet(e) {
  const cache = CacheService.getScriptCache();
  let jsonOutput = cache.get(CACHE_KEY);

  if (jsonOutput != null) {
    // 1. CACHE HIT: Return the cached JSON immediately. This is lightning fast.
    Logger.log('Cache Hit: Returning cached data.');
    return ContentService.createTextOutput(jsonOutput)
      .setMimeType(ContentService.MimeType.JSON);
  }

  // 2. CACHE MISS: Proceed with the slow data fetch, then cache the result.
  Logger.log('Cache Miss: Fetching new data from Sheets...');
  try {
    const fullData = {
        rate_config: getRateConfigData(),
        products: getProductData(),
        ticker: getTickerData()       
    };
    
    jsonOutput = JSON.stringify(fullData);

    // Store the fresh JSON output in the cache for 5 minutes
    cache.put(CACHE_KEY, jsonOutput, CACHE_EXPIRATION_SECONDS);

    // 3. Return the fresh JSON
    return ContentService.createTextOutput(jsonOutput)
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    // ... (Error handling as previously defined)
    return ContentService.createTextOutput(JSON.stringify({ 
        error: 'An error occurred while fetching data.', 
        details: error.message 
    }))
      .setMimeType(ContentService.MimeType.JSON)
      .setStatusCode(500);
  }
}

/**
 * Automatically invalidates the cache when the sheet is edited.
 * This ensures the next web app call gets fresh data.
 * NOTE: This requires installing an "On edit" trigger manually in the App Script editor.
 * Trigger type: From Spreadsheet -> On edit.
 */
function onEdit(e) {
  // Clear the cache key
  CacheService.getScriptCache().remove(CACHE_KEY);
  Logger.log('Spreadsheet edited. Cache invalidated.');
}

// --------------------------------------------------------------------------------------------------

/**
 * Helper function to read the sheet data and generate the data as a raw JavaScript array of objects.
 * NOTE: Changed name from generateProductJsonData to getProductData and it now returns an Object/Array.
 */
function getProductData() {
  const sheetName = 'Products';
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName); 
  
  if (!sheet) {
    throw new Error(`Sheet '${sheetName}' not found.`);
  }

  // Use getDataRange() and getValues() for efficiency.
  const values = sheet.getDataRange().getValues();
  
  if (values.length < 2) {
    return []; // Return empty array if only headers or no data
  }
  
  const [headers, ...dataRows] = values;
  const cleanedHeaders = headers.map(h => String(h).trim()); 
  const products = [];
  
  // Define original keys for mapping (optional, but helps enforce naming)
  const originalJsonKeys = ['id', 'name', 'weight', 'purity', 'makingCharges', 'images', 'highlights', 'newArrival', 'sub_category'];

  for (const row of dataRows) {
    // Assuming 'Name' is in the second column (index 1) for the empty check
    const nameValue = String(row[1]).trim(); 
    if (nameValue === "") {
        continue; // Skip rows where the Name column is empty
    }
    
    const product = {};
    
    for (let j = 0; j < cleanedHeaders.length; j++) {
      const header = cleanedHeaders[j];
      let value = row[j];
      
      // Clean and normalize the header for key generation
      const key = header.toLowerCase().replace(/\s\(g\)|\s\(inr\)/g, '').trim(); 
      
      // Data type conversion/cleaning based on the normalized key
      if (key === 'weight' || key === 'makingcharges' || key === 'display') {
        // Robust conversion for numbers, handling commas and ensuring 0 on failure
        value = (typeof value === 'number') ? value : parseFloat(String(value).replace(/,/g, '')) || 0;
      } else if (key === 'handpicked' || key === 'newarrival') {
        // Boolean conversion
        value = (typeof value === 'boolean') ? value : (String(value).toUpperCase() === 'TRUE');
      } else if (key === 'images') {        
        // Array of strings, split by newline or whitespace, filtering empty strings
        value = String(value).split(/\n|\s+/).filter(item => item.trim() !== '');
      } else if (key === 'highlights') {        
        // Array of strings, split by newline, filtering empty strings
        value = String(value).split('\n').filter(item => item.trim() !== '');
      } else {
          // Default: trim string values
          if (typeof value === 'string') {
              value = value.trim();
          }
      }

      // Map the normalized key back to the desired final key name (case-sensitive)
      const finalKey = originalJsonKeys.find(k => k.toLowerCase() === key) || header;
      
      product[finalKey] = value;
    }
    products.push(product);
  }
  
  return products; // Return the raw array of objects
}

// --------------------------------------------------------------------------------------------------

/**
 * Helper function to read the 'Ticker' sheet data and generate a raw JavaScript array of strings.
 * Requirements: Single column data, no headers, return array of strings.
 * NOTE: Changed name from generateTickerJsonData to getTickerData and it now returns an Object/Array.
 */
function getTickerData() {
  const sheetName = 'Ticker';
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error(`Sheet '${sheetName}' not found.`);
  }

  const lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    return []; // Return empty array if the sheet is empty
  }

  // Get all values from the first column (A1:A_lastRow)
  const range = sheet.getRange(1, 1, lastRow, 1);
  const values = range.getValues();

  // Flatten the 2D array and convert each element to a trimmed string, then filter out empty values.
  const tickerData = values.flat()
    .map(cell => String(cell).trim())
    .filter(str => str !== "");
  
  return tickerData; // Return the raw array of strings
}


/**
 * Helper function to read the 'Rate Configuration' sheet data and generate a raw nested JavaScript object.
 * NOTE: Changed name from generateNestedJson to getRateConfigData and it now returns a raw Object.
 */
function getRateConfigData() {
  const sheetName = 'Rate Configuration';
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  if (!sheet) {
    throw new Error(`Sheet '${sheetName}' not found.`);
  }
  
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
      return {}; // Return empty object if only headers or no data
  }

  const [headers, ...dataRows] = values; // Destructure headers and data rows
  
  // Find column indices
  const headersMap = headers.reduce((acc, h, i) => {
    acc[String(h).trim()] = i;
    return acc;
  }, {});
  
  const sourceIndex = headersMap["Source"];
  const typeIndex = headersMap["Type"];
  const costingIndex = headersMap["Costing"];
  const diffIndex = headersMap["Diff"];
  const absoluteIndex = headersMap["Absolute"];
  const displayIndex = headersMap["Display"];
  
  // Basic validation for critical columns
  if ([sourceIndex, typeIndex, costingIndex, diffIndex, absoluteIndex, displayIndex].some(i => i === undefined)) {
      throw new Error("Missing one or more required headers in 'Rate Configuration' sheet.");
  }

  const result = {};

  for (const row of dataRows) {
    const source = String(row[sourceIndex]).trim();
    if (source === "") continue; // Skip rows with no source
      
    const type = String(row[typeIndex]).trim();
    if (type === "") continue; // Skip rows with no type
      
    // Use Number() for robust conversion, defaulting to 0 if NaN.
    const costing = Number(row[costingIndex]) || 0;
    const diff = Number(row[diffIndex]) || 0;
    const absolute = Number(row[absoluteIndex]) || 0;
    const display = Number(row[displayIndex]) || 0;

    if (!result[source]) {
      result[source] = {};
    }

    // Use lowercase for the type key
    result[source][type.toLowerCase()] = {
      costing,
      diff,
      absolute,
      display
    };
  }

  return result; // Return the raw nested object
}