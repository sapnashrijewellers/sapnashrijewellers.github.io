function getMap(KEYWORD_MAP_SHEET ="Rates", isValueNumber) {

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(KEYWORD_MAP_SHEET);

  if (!sheet) {
    Logger.log(`ERROR: Sheet "${KEYWORD_MAP_SHEET}" not found.`);
    return {};
  }

  const range = sheet.getRange(1, 1, sheet.getLastRow(), 2);
  const data = range.getValues();

  
  const dataMap = {};

  // Process the data row by row
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    let rawKeywords = row[0]; // Data in Column A (index 0)
    let mappedValue = row[1]; // Data in Column B (index 1)

    // Skip if either value is empty
    if (!rawKeywords || !mappedValue) {
      continue;
    }

    rawKeywords = rawKeywords.toString().toLowerCase().trim();    
    dataMap[rawKeywords] =  mappedValue;
  }

  Logger.log(JSON.stringify(dataMap));
  return dataMap;
}