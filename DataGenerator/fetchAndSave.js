// Use the native Node.js 'fs' module for file system operations
import { writeFile } from 'fs/promises';
// 'path' is used for creating clean, platform-independent file paths
import path from 'path';
import buildSearchIndex from "./buildSearchIndex.js"

const DataFolder = "../catalog/data/"
const PublicDataFolder = "../catalog/public/data/"
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
        const fileName = path.join(DataFolder, `${key}.json`);

        // Get the value for the current key
        let data = apiResponse[key];
        if (key === "products") {
            data = data.filter(p => p.name?.length > 4
                && p.category?.length > 0
                && p.active
                && p.weight > 0
                && p.slug.length > 4
            );
        }
        const jsonString = JSON.stringify(data, null, 2);

        try {

            await writeFile(fileName, jsonString);
            if (key === "products") {
                const fName = path.join(PublicDataFolder, `${key}.json`);
                await writeFile(fName, jsonString);
            }
            console.log(`✅ Saved data for key: ${key} -> ${fileName}`);
            successCount++;
        } catch (fileError) {
            console.error(`❌ Failed to write file for key '${key}': ${fileError.message}`);
        }
    }

    console.log(`\n--- Process Complete ---`);
    console.log(`Total files created: ${successCount} / ${keys.length}`);
}

await fetchAndSaveData();
await buildSearchIndex();