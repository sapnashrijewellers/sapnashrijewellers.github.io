import { getSetCache, syncData } from "../src/utils/dataSync";

//const CACHE_NAME = "ssj-cache-v1";
const DATA_CACHE = "ssj-data-cache-v1";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/android-chrome-192x192-v1.png",
  "/icons/android-chrome-512x512-v1.png",
  "/icons/apple-touch-icon-v1.png"
];

//const baseURL = "https://tight-sky-9fb5.ssjn.workers.dev/";
const baseURL = "http://localhost:8787/";

// ✅ Install: Pre-cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(DATA_CACHE).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// ✅ Activate: Clean up old caches and trigger initial sync
self.addEventListener("activate", async (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => ![DATA_CACHE, DATA_CACHE].includes(k)).map((k) => caches.delete(k)));
    })()
  );
  self.clients.claim();
  syncData(DATA_CACHE, baseURL);  
});

// ✅ Intercept requests from React app
self.addEventListener("fetch", (event) => getSetCache(event, baseURL, DATA_CACHE));

// ✅ Manual trigger from React
self.addEventListener("message", async (event) => {
  if (event.data === "syncData") {
    console.log("SW: Received syncData trigger");
    await syncData(DATA_CACHE, baseURL);
  }
});