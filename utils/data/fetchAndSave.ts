import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import buildSearchIndex from "./buildSearchIndex";

const DATA_FOLDER = "./data/";
const PUBLIC_DATA_FOLDER = "./public/data/";

// Google Apps Script Web App
const API_URL =
  "https://script.google.com/macros/s/AKfycbwNQ9fFmV0MqVEKg6pk-x56FsCw-xOnV__A3l6hqrlUVukKyx6gf31DpiO4hn4Vep6U5w/exec";

type Product = {
  name?: string;
  category?: string;
  active?: boolean;
  weight?: number;
};

type ApiResponse = Record<string, unknown>;

type FailedKey = {
  key: string;
  error: string;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Fetches data from the API and saves each top-level key
 * as a separate JSON file.
 *
 * Any fatal error is thrown so GitHub Actions receives
 * a non-zero exit code.
 */
async function fetchAndSaveData(): Promise<void> {
  console.log(`\nStarting data fetch from: ${API_URL}`);

  // Ensure required directories exist.
  await mkdir(DATA_FOLDER, { recursive: true });
  await mkdir(PUBLIC_DATA_FOLDER, { recursive: true });

  let apiResponse: unknown;

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      redirect: "follow",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `API request failed with HTTP ${response.status} ${response.statusText}`
      );
    }

    apiResponse = await response.json();

    console.log("Successfully fetched and parsed data.");
  } catch (error: unknown) {
    const message = getErrorMessage(error);

    console.error("\n--- 🛑 FAILED TO FETCH DATA ---");
    console.error(`Error details: ${message}`);

    throw new Error(`Data fetch failed: ${message}`, {
      cause: error,
    });
  }

  // Validate API response.
  if (
    apiResponse === null ||
    typeof apiResponse !== "object" ||
    Array.isArray(apiResponse)
  ) {
    throw new Error(
      "Invalid API response: expected a JSON object containing top-level data keys."
    );
  }

  const data = apiResponse as ApiResponse;
  const keys = Object.keys(data);

  if (keys.length === 0) {
    throw new Error("API returned an empty object. No data was generated.");
  }

  let successCount = 0;
  const failedKeys: FailedKey[] = [];

  for (const key of keys) {
    const fileName = path.join(DATA_FOLDER, `${key}.json`);

    let keyData = data[key];

    // Apply product filtering.
    if (key === "products") {
      if (!Array.isArray(keyData)) {
        throw new Error(
          `Invalid products data: expected an array but received ${typeof keyData}.`
        );
      }

      keyData = (keyData as Product[]).filter(
        (product) =>
          product.name &&
          product.name.length > 4 &&
          product.category &&
          product.category.length > 0 &&
          product.active === true &&
          product.weight !== undefined &&
          product.weight > 0
      );
    }

    const jsonString = JSON.stringify(keyData, null, 2);

    try {
      // Write main data file.
      await writeFile(fileName, jsonString);

      // Products are also copied to the public data directory.
      if (key === "products") {
        const publicFileName = path.join(
          PUBLIC_DATA_FOLDER,
          `${key}.json`
        );

        await writeFile(publicFileName, jsonString);

        console.log(`✅ Saved data for key: ${key} -> ${fileName}`);
        console.log(`✅ Saved public data -> ${publicFileName}`);
      } else {
        console.log(`✅ Saved data for key: ${key} -> ${fileName}`);
      }

      successCount++;
    } catch (error: unknown) {
      const message = getErrorMessage(error);

      console.error(
        `❌ Failed to write file for key '${key}': ${message}`
      );

      failedKeys.push({
        key,
        error: message,
      });
    }
  }

  console.log("\n--- Data Generation Complete ---");
  console.log(`Total keys: ${keys.length}`);
  console.log(`Successfully generated: ${successCount}`);
  console.log(`Failed: ${failedKeys.length}`);

  if (failedKeys.length > 0) {
    console.error("\n--- 🛑 DATA GENERATION FAILED ---");

    for (const failure of failedKeys) {
      console.error(`❌ ${failure.key}: ${failure.error}`);
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
 * causes the process to terminate with a non-zero exit code.
 */
async function main(): Promise<void> {
  try {
    await fetchAndSaveData();

    console.log("\nStarting search index generation...");

    await buildSearchIndex();

    console.log("\n✅ Search index generated successfully.");
    console.log(
      "🎉 Data generation and search index build completed successfully."
    );
  } catch (error: unknown) {
    console.error("\n========================================");
    console.error("🛑 BUILD FAILED");
    console.error("========================================");

    console.error(`Error: ${getErrorMessage(error)}`);

    if (error instanceof Error && error.cause) {
      console.error(`Cause: ${getErrorMessage(error.cause)}`);
    }

    process.exitCode = 1;
  }
}

main();
