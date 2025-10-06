/**
 * Creates a custom menu in the Google Sheet UI on open.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🛠️ Tools')
    // NOTE: Fixed spelling of "Products" and "Download"
    .addItem('Download Products', 'openDownloadURL_Products')
    .addItem('Download Ticker', 'openDownloadURL_Ticker')
    .addToUi();
}

// !!! IMPORTANT: Replace this placeholder URL with your actual deployed Web App URL !!!
// Ensure the deployment is set to 'Execute as: Me' and 'Who has access: Anyone' or 'Anyone, even anonymous'

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwNQ9fFmV0MqVEKg6pk-x56FsCw-xOnV__A3l6hqrlUVukKyx6gf31DpiO4hn4Vep6U5w/exec';

/**
 * Function called by the "Download Products" menu item. 
 * Appends a 'type=products' parameter to the URL.
 */
function openDownloadURL_Products() {
  const downloadUrl = `${WEB_APP_URL}?type=products`;
  showDownloadModal(downloadUrl);
}

/**
 * Function called by the "Download Ticker" menu item.
 * Appends a 'type=ticker' parameter to the URL.
 */
function openDownloadURL_Ticker() {
  const downloadUrl = `${WEB_APP_URL}?type=ticker`;
  showDownloadModal(downloadUrl);
}

/**
 * Helper function to open the download URL in a new window via a modal.
 */
function showDownloadModal(downloadUrl) {
  const html = HtmlService.createHtmlOutput(`<script>window.open("${downloadUrl}"); google.script.host.close();</script>`)
    .setWidth(10)
    .setHeight(10);

  SpreadsheetApp.getUi().showModalDialog(html, 'Preparing Download...');
}

// --------------------------------------------------------------------------------------------------

/**
 * Web App entry point to serve the JSON string.
 * This is now the CONSOLIDATED function that handles both product and ticker downloads.
 * @param {Object} e The event object containing URL parameters.
 */
function doGet(e) {
  const type = e.parameter.type;
  let jsonString;
  let jsonFileName;

  try {
    if (type === 'products') {
      jsonString = generateProductJsonData();
      jsonFileName = 'product_data.json';
    } else if (type === 'ticker') {
      jsonString = generateTickerJsonData(); // Calls the new function
      jsonFileName = 'ticker_data.json';
    } else if (type === 'rate_config') {
      jsonString = generateNestedJson(); // Calls the new function
      jsonFileName = 'rateConfig.json';
    } else {
      return ContentService.createTextOutput("Error: Missing or invalid 'type' parameter in URL.")
        .setMimeType(ContentService.MimeType.TEXT);
    }

    // The Web App must be deployed in a way that triggers a download. 
    // This is typically achieved by setting "Execute as: Me" and using a standard 
    // ContentService.createTextOutput() with the JSON MIME type.
    return ContentService.createTextOutput(jsonString)
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log the error for debugging and return a user-friendly message
    Logger.log(`Error generating JSON for type ${type}: ${error.toString()}`);
    return ContentService.createTextOutput(`Error generating data: ${error.message}`)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

// --------------------------------------------------------------------------------------------------

/**
 * Helper function to read the sheet data and generate the JSON string.
 */
function generateProductJsonData() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  // Ensure the sheet name 'Products' is correct.
  const sheet = spreadsheet.getSheetByName('Products'); 
  if (!sheet) {
    throw new Error("Sheet 'Products' not found.");
  }
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  if (values.length < 2) {
    return JSON.stringify([]); 
  }
  
  const headers = values[0].map(h => String(h).trim()); 
  const products = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    
    const nameValue = String(row[1]).trim(); 
    if (nameValue === "") {
        continue; 
    }
    
    const product = {};
    
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      let value = row[j];
      
      const key = header.toLowerCase().replace(/\s\(g\)|\s\(inr\)/g, '').trim(); 
      
      if (key === 'weight' || key === 'makingcharges') {
        value = (typeof value === 'number') ? value : parseFloat(String(value).replace(/,/g, '')) || 0;
      } else if (key === 'handpicked' || key === 'newarrival') {
        value = (typeof value === 'boolean') ? value : (String(value).toUpperCase() === 'TRUE');
      } else if (key === 'images') {        
        value = String(value).split(/\n|\s+/).filter(item => item.trim() !== '');
        // *****************************************************************
      } else if (key === 'highlights') {        
        value = String(value).split('\n').filter(item => item.trim() !== '');
        // *****************************************************************
      }

      const originalJsonKeys = ['id', 'name', 'category', 'weight', 'purity', 'makingCharges', 'images', 'highlights', 'handpicked', 'newArrival'];
      const finalKey = originalJsonKeys.find(k => k.toLowerCase() === key) || header;
      
      product[finalKey] = value;
    }
    products.push(product);
  }
  
  return JSON.stringify(products, null, 2);
}



// --------------------------------------------------------------------------------------------------

/**
 * Helper function to read the 'Ticker' sheet data and generate a JSON array of strings.
 * Requirements: Single column data, no headers, return array of strings.
 */
function generateTickerJsonData() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('Ticker');

  if (!sheet) {
    // This will cause an error that doGet catches, returning a helpful message.
    throw new Error("Sheet 'Ticker' not found.");
  }

  // Get all data from column A (assuming the strings are in the first column)
  const lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    return JSON.stringify([]); // Return empty array if the sheet is empty
  }

  // Get all values from the first column (A1:A_lastRow)
  const range = sheet.getRange(1, 1, lastRow, 1);
  const values = range.getValues();

  // Flatten the 2D array and convert each element to a string, then filter out empty/null values.
  const tickerData = values.flat()
    .map(cell => String(cell).trim())
    .filter(str => str !== "");

  // Return the JSON string for the array of strings
  return JSON.stringify(tickerData, null, 2);
}


function generateNestedJson() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Rate Configuration");
  const data = sheet.getDataRange().getValues();

  const headers = data.shift(); // remove header row
  const sourceIndex = headers.indexOf("Source");
  const typeIndex = headers.indexOf("Type");
  const costingIndex = headers.indexOf("Costing");
  const diffIndex = headers.indexOf("Diff");
  const absoluteIndex = headers.indexOf("Absolute");

  const result = {};

  data.forEach(row => {
    const source = row[sourceIndex];
    const type = row[typeIndex].trim();
    const costing = parseFloat(row[costingIndex]);
    const diff = parseFloat(row[diffIndex]);
    const absolute = parseFloat(row[absoluteIndex]);

    if (!result[source]) {
      result[source] = {};
    }

    result[source][type.toLowerCase()] = { // optional: lowercase keys
      costing,
      diff,
      absolute
    };
  });

  // Stringify before returning
  return JSON.stringify(result, null, 2);
}



