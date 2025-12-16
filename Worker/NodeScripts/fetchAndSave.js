// Use the native Node.js 'fs' module for file system operations
import { writeFile } from 'fs/promises';
// 'path' is used for creating clean, platform-independent file paths
import path from 'path';

const DtaFolder = "../catalog/data/"
// The URL of your Google Apps Script Web App
const API_URL = "https://script.google.com/macros/s/AKfycbwNQ9fFmV0MqVEKg6pk-x56FsCw-xOnV__A3l6hqrlUVukKyx6gf31DpiO4hn4Vep6U5w/exec";

/**
 * Fetches data from the API and saves each top-level key as a separate JSON file.
 */
async function fetchAndSaveData() {
    console.log(`\nStarting data fetch from: ${API_URL}`);

    let apiResponse;
    try {
        // 1. Fetch the data using the native 'fetch' API
        const response = await fetch(API_URL);

        // Check for HTTP errors (e.g., 404, 500)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }

        // 2. Parse the response body as JSON
        apiResponse = await response.json();
        console.log('Successfully fetched and parsed data.');

    } catch (error) {
        console.error('--- 🛑 FAILED TO FETCH DATA ---');
        console.error(`Error details: ${error.message}`);
        // Exit the function if fetching or parsing failed
        return;
    }

    // 3. Iterate over the top-level keys and write each one to a separate file
    const keys = Object.keys(apiResponse);
    let successCount = 0;

    for (const key of keys) {
        // Construct the output filename (e.g., 'ticker.json')
        const fileName = path.join(DtaFolder, `${key}.json`);

        // Get the value for the current key
        const data = apiResponse[key];

        // Convert the JavaScript object/array into a nicely formatted JSON string
        // The third argument (2) specifies 2 spaces for indentation (pretty print)
        const jsonString = JSON.stringify(data, null, 2);

        try {
            // 4. Write the JSON string to a file using fs/promises.writeFile
            await writeFile(fileName, jsonString);
            console.log(`✅ Saved data for key: ${key} -> ${fileName}`);
            successCount++;
        } catch (fileError) {
            console.error(`❌ Failed to write file for key '${key}': ${fileError.message}`);
        }
    }

    console.log(`\n--- Process Complete ---`);
    console.log(`Total files created: ${successCount} / ${keys.length}`);
}

// Execute the main function
fetchAndSaveData();