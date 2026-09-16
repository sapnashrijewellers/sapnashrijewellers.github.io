import { copyFile, mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import buildSearchIndex from "./buildSearchIndex";
import { Product } from "@/types/catalog";

const DATA_FOLDER = "./data/";
const PUBLIC_DATA_FOLDER = "./public/data/";

// Google Apps Script Web App
const API_URL =
  "https://script.google.com/macros/s/AKfycbwNQ9fFmV0MqVEKg6pk-x56FsCw-xOnV__A3l6hqrlUVukKyx6gf31DpiO4hn4Vep6U5w/exec";

type ApiResponse = Record<string, unknown>;

type FailedKey = {
  key: string;
  error: string;
};

type LabelEntry = {
  key: string;
  name?: string;
  collectionName?: string;
  icon?: string;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Moves a file safely across different partitions if rename fails (EXDEV).
 */
async function moveFile(source: string, destination: string): Promise<void> {
  try {
    await rename(source, destination);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "EXDEV") {
      await copyFile(source, destination);
      await unlink(source);
    } else {
      throw error;
    }
  }
}

/**
 * Reads labels.json and moves every {label.key}.json file
 * from data/ into public/data/.
 */
async function moveLabelFiles(): Promise<void> {
  const labelsFilePath = path.join(DATA_FOLDER, "labels.json");
  console.log(`\nProcessing labels from: ${labelsFilePath}`);

  let labels: LabelEntry[] = [];

  try {
    const rawContent = await readFile(labelsFilePath, "utf-8");
    labels = JSON.parse(rawContent) as LabelEntry[];
  } catch (error: unknown) {
    throw new Error(
      `Failed to read or parse '${labelsFilePath}': ${getErrorMessage(error)}`
    );
  }

  if (!Array.isArray(labels)) {
    throw new Error(`Expected '${labelsFilePath}' to contain an array of label objects.`);
  }

  for (const label of labels) {
    if (!label.key) continue;

    const sourceFile = path.join(DATA_FOLDER, `${label.key}.json`);
    const targetFile = path.join(PUBLIC_DATA_FOLDER, `${label.key}.json`);

    try {
      await moveFile(sourceFile, targetFile);
      console.log(`🚚 Moved: ${sourceFile} -> ${targetFile}`);
    } catch (error: unknown) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === "ENOENT") {
        console.warn(`⚠️ Warning: File for key '${label.key}' not found at ${sourceFile}`);
      } else {
        throw new Error(
          `Failed to move file for label key '${label.key}': ${getErrorMessage(error)}`
        );
      }
    }
  }
}

/**
 * Fetches data from the API and saves each top-level key
 * as a separate JSON file, then transfers label-referenced files.
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

    throw new Error(`Data fetch failed: ${message}`, { cause: error });
  }

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
          product.collection &&
          product.collection.length > 0 &&
          product.active === true &&
          product.weight !== undefined &&
          product.weight > 0
      );
    }

    const jsonString = JSON.stringify(keyData, null, 2);

    try {
      await writeFile(fileName, jsonString);

      if (key === "products") {
        const publicFileName = path.join(PUBLIC_DATA_FOLDER, `${key}.json`);
        await writeFile(publicFileName, jsonString);
        console.log(`✅ Saved data for key: ${key} -> ${fileName}`);
        console.log(`✅ Saved public data -> ${publicFileName}`);
      } else {
        console.log(`✅ Saved data for key: ${key} -> ${fileName}`);
      }

      successCount++;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      console.error(`❌ Failed to write file for key '${key}': ${message}`);
      failedKeys.push({ key, error: message });
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

  console.log("\n✅ All initial data files generated successfully.");

  // Process and transfer label files
  await moveLabelFiles();
}

/**
 * Main build process.
 */
async function main(): Promise<void> {
  try {
    await fetchAndSaveData();

    console.log("\nStarting search index generation...");
    await buildSearchIndex();

    console.log("\n✅ Search index generated successfully.");
    console.log("🎉 Data generation, transfers, and search index build completed successfully.");
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