import { syncData } from "./utils/dataSync";
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { clientsClaim, skipWaiting } from 'workbox-core';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST || []);

const DATA_CACHE = "ssj-data-cache-v1";
const API_CACHE = "api-runtime-cache-v1"; // 💡 New, dedicated cache name for Workbox runtime data
//const baseURL = "http://localhost:8787/";
const baseURL = "https://tight-sky-9fb5.ssjn.workers.dev/";
const baseOrigin = new URL(baseURL).origin;

registerRoute(
  ({ url, request }) => url.origin === baseOrigin && request.method === 'GET',
  new StaleWhileRevalidate({
    cacheName: API_CACHE, // 💡 USE THE DEDICATED API CACHE NAME
    plugins: [
      // Ensure 200 status is the only one cached
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);


// ----------------------------------------------------------------------
// SERVICE WORKER LIFECYCLE
// ----------------------------------------------------------------------

// ✅ Install
self.addEventListener("install", (event) => {
  console.log("install");
  skipWaiting();
});

// ✅ Activate
self.addEventListener("activate", async (event) => {
  event.waitUntil(
    (async () => {
      cleanupOutdatedCaches();

      const keys = await caches.keys();
      // Only keep the custom data cache and Workbox caches
      await Promise.all(keys.filter((k) => ![DATA_CACHE, API_CACHE, 'workbox-precache'].includes(k)).map((k) => caches.delete(k)));

    })()
  );
  clientsClaim();

  // Trigger initial background sync on activation
  syncData(DATA_CACHE, baseURL);
});


// ----------------------------------------------------------------------
// CUSTOM MESSAGE HANDLING (Needed for initial load handshakes)
// ----------------------------------------------------------------------

self.addEventListener("message", async (event) => {

  // 1. Handle background sync request
  if (event.data?.type === "syncData") {
    console.log("SW: Received syncData trigger for background refresh");
    await syncData(DATA_CACHE, baseURL); // syncData needs modification below
  }

  // 2. Handle initial app data request (REPLY REQUIRED)
  if (event.data?.type === "dataRequest") {
    const replyPort = event.ports[0];

    console.log("SW: Received dataRequest. Starting data retrieval.");

    try {
      const data = await syncData(DATA_CACHE, baseURL, { returnData: true });

      console.log("SW: Data retrieved. Replying to client.");
      replyPort.postMessage({ type: 'dataResponse', data: data });

    } catch (e) {
      console.error("SW: FAILED to process dataRequest:", e);
      replyPort.postMessage({ type: 'dataError', message: e.message || 'SW processing error during initial load.' });
    }
  }
});