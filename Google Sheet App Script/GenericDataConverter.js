// Reusable, Rule-Based Data Fetcher
function getData(sheetName, primaryKeyIndex = 0, typeConfig = {}) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error(`Sheet '${sheetName}' not found.`);
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const values = sheet.getRange(1, 1, lastRow, sheet.getLastColumn()).getValues();
  const [headers, ...dataRows] = values;
  const keys = headers.map(h => String(h).trim());

  const results = [];

// Find slug source field from configuration
  // Example: { slug: 'name' } → use item.name
  const slugSourceKey = typeConfig.slug
    ? String(typeConfig.slug).trim()
    : null;
  

  for (const row of dataRows) { // OUTER LOOP (Row Loop)
    const primaryValue = String(row[primaryKeyIndex]).trim();
    if (primaryValue === "") {
      continue;
    }

    const item = {};

    for (let j = 0; j < keys.length; j++) { // INNER LOOP (Column Loop)
      const key = keys[j];
      let value = row[j];

      if (key === "") continue;

      // --- THE GENERIC CONVERSION LOGIC ---
      const rule = typeConfig[key.toLowerCase()] || 'STRING';
      item[key] = processValue(key, value, rule,primaryValue);
      // ------------------------------------
    }

    
    if (item.hasOwnProperty('active') && item.active === false) {
        continue; // Skip the entire row if 'active' is present and reliably false
    }   

    // Generate slug if configured
    if (slugSourceKey) {
      const sourceValue = item[slugSourceKey];

      if (sourceValue !== undefined && sourceValue !== null) {
        item.slug = generateSlug(sourceValue, primaryValue);
      }
    }
    
    results.push(item);
  }

  
    

  return results;
}
/**
 * Generic helper function to apply the necessary data transformation based on a rule.
 * @param {string} key The column header/key.
 * @param {*} value The raw cell value.
 * @param {string} rule The transformation rule (e.g., 'NUMBER', 'BOOLEAN').
 * @returns {*} The processed value.
 */
function processValue(key, value, rule) {
  const strValue = String(value);
  if (key === "active") {
    if (typeof value === 'boolean')
      return value;
    else
      return true;
  }
  switch (rule) {
    case 'NUMBER':
      // Robust conversion for numbers, handling commas and ensuring 0 on failure
      return (typeof value === 'number') ? value : parseFloat(strValue.replace(/,/g, '')) || 0;

    case 'BOOLEAN':
      // Boolean conversion
      return (typeof value === 'boolean') ? value : (strValue.toUpperCase() === 'TRUE');

    case 'ARRAY_IMAGES':
      // Array of strings, split by newline or whitespace, filtering empty strings, and converting file extension
      return strValue
        .split(/\n|\s+/)
        .filter(item => item.trim() !== '')
        .map(img => img.trim().replace(/\.(jpg|jpeg|png|gif|svg)$/i, '.webp'));

    case 'ARRAY_NEWLINE':
      // Array of strings, split by newline, filtering empty strings
      return strValue
      .split(/[\n•;]/)      
      .filter(item => item.trim() !== '').map(s => s.trim());

    case 'ARRAY_COMMA':
      // Array of strings, split by comma, filtering empty strings
      return strValue.split(',').filter(item => item.trim() !== '').map(s => s.trim());    

    case 'STRING':
    default:
      // Default: trim string values
      return strValue.trim();
  }
}

function generateSlug(name, id) {
  const slug = String(name)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")      // Everything else → hyphen
    .replace(/^-+|-+$/g, "");         // Remove leading/trailing hyphens

  return `${slug}-${id}`;
}