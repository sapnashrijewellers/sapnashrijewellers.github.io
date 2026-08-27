// Use the native Node.js 'fs' module for file system operations
import { writeFile } from 'fs/promises';

// 'path' is used for creating clean, platform-independent file paths
import path from 'path';

import buildSearchIndex from "./buildSearchIndex.js";

const DataFolder = "./catalog/data/";
const PublicDataFolder = "./catalog/public/data/";

// The URL of your Google Apps Script Web App
const API_URL =
    "https://script.google.com/macros/s/AKfycbwNQ9fFmV0MqVEKg6pk-x56FsCw-xOnV__A3l6hqrlUVukKyx6gf31DpiO4hn4Vep6U5w/exec";
/**
 * Fetches data from the API and saves each top-level key as a separate JSON file.
 *
 * IMPORTANT FOR CI/CD:
 * This function throws whenever a fatal error occurs.
 * The thrown error will eventually cause Node.js to exit with a non-zero
 * exit code, which makes GitHub Actions mark the deployment as FAILED.
 */
async function fetchAndSaveData() {
    console.log(`\nStarting data fetch from: ${API_URL}`);

    let apiResponse;

    try {
        // 1. Fetch the data using the native 'fetch' API
        //const response = await fetch(API_URL);        

        const response = await fetch(API_URL, {
            method: "GET",
            redirect: "follow",
            headers: {
                "Accept": "application/json"
            }
        });
        // 2. Parse the response body as JSON
        apiResponse = await response.json();

        console.log("Successfully fetched and parsed data.");

    } catch (error) {
        console.error("\n--- 🛑 FAILED TO FETCH DATA ---");
        console.error(`Error details: ${error.message}`);

        // IMPORTANT:
        // Do NOT simply return here.
        // Throwing the error causes the Node.js process to exit with
        // a non-zero exit code when this error reaches the top level.
        throw new Error(`Data fetch failed: ${error.message}`, {
            cause: error
        });
    }

    // Basic validation to make sure the API returned an object.
    if (
        apiResponse === null ||
        typeof apiResponse !== "object" ||
        Array.isArray(apiResponse)
    ) {
        throw new Error(
            "Invalid API response: expected a JSON object containing top-level data keys."
        );
    }

    // 3. Iterate over the top-level keys and write each one to a separate file
    const keys = Object.keys(apiResponse);

    if (keys.length === 0) {
        throw new Error("API returned an empty object. No data was generated.");
    }

    let successCount = 0;
    const failedKeys = [];

    for (const key of keys) {

        // Construct the output filename
        const fileName = path.join(DataFolder, `${key}.json`);

        // Get the value for the current key
        let data = apiResponse[key];

        // Apply product filtering
        if (key === "products") {
            if (!Array.isArray(data)) {
                throw new Error(
                    `Invalid products data: expected an array but received ${typeof data}.`
                );
            }

            data = data.filter(
                p =>
                    p.name?.length > 4 &&
                    p.category?.length > 0 &&
                    p.active &&
                    p.weight > 0                     
            );
        }

        const jsonString = JSON.stringify(data, null, 2);

        try {
            // Write the main data file
            await writeFile(fileName, jsonString);

            // Products are also copied to the public data directory
            if (key === "products") {
                const publicFileName = path.join(
                    PublicDataFolder,
                    `${key}.json`
                );

                await writeFile(publicFileName, jsonString);

                console.log(
                    `✅ Saved data for key: ${key} -> ${fileName}`
                );

                console.log(
                    `✅ Saved public data -> ${publicFileName}`
                );
            } else {
                console.log(
                    `✅ Saved data for key: ${key} -> ${fileName}`
                );
            }

            successCount++;

        } catch (fileError) {
            console.error(
                `❌ Failed to write file for key '${key}': ${fileError.message}`
            );

            // Remember the failure, but continue processing the remaining
            // keys so the log shows all files that failed.
            failedKeys.push({
                key,
                error: fileError.message
            });
        }
    }

    console.log(`\n--- Data Generation Complete ---`);
    console.log(`Total keys: ${keys.length}`);
    console.log(`Successfully generated: ${successCount}`);
    console.log(`Failed: ${failedKeys.length}`);

    // IMPORTANT FOR GITHUB ACTIONS:
    // If even one file failed, throw an error.
    //
    // This causes the Node.js process to exit with a non-zero status,
    // which makes the GitHub Actions step fail.
    if (failedKeys.length > 0) {
        console.error("\n--- 🛑 DATA GENERATION FAILED ---");

        for (const failure of failedKeys) {
            console.error(
                `❌ ${failure.key}: ${failure.error}`
            );
        }

        throw new Error(
            `Data generation failed for ${failedKeys.length} of ${keys.length} key(s).`
        );
    }

    console.log("\n✅ All data files generated successfully.");
}


/**
 * Main build process.
 *
 * Any error thrown by fetchAndSaveData() or buildSearchIndex()
 * reaches this catch block and terminates the process with exit code 1.
 */
try {
    await fetchAndSaveData();

    console.log("\nStarting search index generation...");

    await buildSearchIndex();

    console.log("\n✅ Search index generated successfully.");
    console.log("🎉 Data generation and search index build completed successfully.");

} catch (error) {
    console.error("\n========================================");
    console.error("🛑 BUILD FAILED");
    console.error("========================================");

    console.error(`Error: ${error.message}`);

    if (error.cause) {
        console.error(`Cause: ${error.cause.message}`);
    }

    // Explicitly terminate with a non-zero exit code.
    //
    // GitHub Actions interprets exit code 0 = success
    // and non-zero = failure.
    process.exitCode = 1;
}