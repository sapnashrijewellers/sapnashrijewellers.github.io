import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// --- ESM __dirname workaround ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
const IMG_DIR = path.join("/app/repo", "img");
const OPTIMIZED_IMG_DIR = path.join(IMG_DIR, "optimized");
const TRACKER_FILE = path.join(IMG_DIR, "optimized_images.json");

console.log("Image directory:", IMG_DIR);
console.log("Optimized directory:", OPTIMIZED_IMG_DIR);

/**
 * Reads the list of already optimized image filenames from the tracker file.
 * @returns {Promise<Set<string>>} A Set of optimized filenames.
 */
async function getOptimizedTracker() {
    try {
        const data = await fs.readFile(TRACKER_FILE, "utf8");
        const list = JSON.parse(data);
        return new Set(list);
    } catch (error) {
        if (error.code === "ENOENT") return new Set();
        console.error("Error reading tracker file:", error.message);
        return new Set();
    }
}

/**
 * Writes the tracker file.
 */
async function updateOptimizedTracker(trackerSet) {
    const list = Array.from(trackerSet);
    await fs.writeFile(TRACKER_FILE, JSON.stringify(list, null, 2), "utf8");
}

/**
 * Optimize a single image into WebP format if not already processed.
 */
async function optimizeImage(inputPath, filename, trackerSet) {
    // Skip if already optimized
    if (trackerSet.has(filename)) return;

    const ext = path.extname(filename).toLowerCase();
    if (ext === ".webp") return; // Skip .webp files entirely

    const baseName = path.parse(filename).name;
    const outputPath = path.join(OPTIMIZED_IMG_DIR, `${baseName}.webp`);

    try {
        await sharp(inputPath)
            .webp({ quality: 80 })
            .toFile(outputPath);

        console.log(`✅ Optimized: ${filename} -> ${path.basename(outputPath)}`);
        trackerSet.add(filename);
    } catch (error) {
        console.error(`❌ Failed to optimize ${filename}:`, error.message);
    }
}

/**
 * Main optimization logic.
 */
async function runOptimization() {
    console.log(`--- Starting Image Optimization at ${new Date().toISOString()} ---`);

    await fs.mkdir(OPTIMIZED_IMG_DIR, { recursive: true });

    const trackerSet = await getOptimizedTracker();
    console.log(`Tracker currently has ${trackerSet.size} entries.`);

    const files = await fs.readdir(IMG_DIR, { withFileTypes: true });
    console.log("All entries in folder:", files.map(f => f.name));
    console.log("runOptimization: ",IMG_DIR);
    const imageFiles = files
        .filter(
            (f) => {                
                return f.isFile() &&
                    !f.name.startsWith(".") &&
                    !f.name.endsWith(".webp") &&
                    !f.name.endsWith(path.basename(TRACKER_FILE)) &&
                    ["jpg", "jpeg", "png", "gif"].includes(
                        path.extname(f.name).slice(1).toLowerCase()
                    );
            }
        )
        .map((f) => f.name);

    console.log(`Found ${imageFiles.length} image files to process.`);

    // If tracker is empty, process all eligible images
    if (trackerSet.size === 0) {
        console.log("Tracker empty — optimizing all non-WebP images...");
    }

    let processedCount = 0;
    for (const file of imageFiles) {
        if (!trackerSet.has(file)) {
            await optimizeImage(path.join(IMG_DIR, file), file, trackerSet);
            processedCount++;
        }
    }

    await updateOptimizedTracker(trackerSet);

    console.log(
        `--- Optimization complete. Processed ${processedCount} new images. Tracker now has ${trackerSet.size} entries. ---`
    );
}

// Execute
runOptimization().catch(console.error);
