import { syncData } from "./utils/dataSync";
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { clientsClaim, skipWaiting } from 'workbox-core';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST || []);

const DATA_CACHE = "ssj-data-cache-v1";
const API_CACHE = "api-runtime-cache-v1"; // 💡 New, dedicated cache name for Workbox runtime data
const baseURL = "https://localhost:8787/";
//const baseURL = "https://tight-sky-9fb5.ssjn.workers.dev/";
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
self.addEventListener("install", () => {
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
      clientsClaim();
    })()
  );
  clientsClaim();

  // Trigger initial background sync on activation
  syncData(DATA_CACHE, baseURL);
});

self.addEventListener("push", async function (event) {
  console.log("Push received!", event);

  // fetch or compute data asynchronously
  const data = await syncData(DATA_CACHE, baseURL, { returnData: true });

  const title = "भाव - सपना श्री ज्वैलर्स";
  const body =
    `🙏 जय श्री कृष्णा - जय जिनेंद्र 🙏 
    ${new Date(data.rates.asOn).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata"
    })}
 - चाँदी पाट (99.9%): ${parseFloat(data.rates.silver).toFixed(2)} ₹  
 - सोना (24K 99.9%): ${parseFloat(data.rates.gold24K).toFixed(2)} ₹ 
 - सोना जेवर (22K): ${parseFloat(data.rates.gold22K).toFixed(2)} ₹ 
 - Gst 3% Extra* 
 - 📞 FOR BOOKING: 🤙🏻 8234042231 
✨ आपका दिन मंगलमय रहें! 
`;
  const options = {
    body,
    icon: "/icons/android-chrome-192x192-v1.png", // main icon
    badge: "/icons/android-chrome-96x96-v1.png", // small badge for status bar
    vibrate: [100, 50, 100], // optional vibration pattern
    tag: "gold-rate-notification", // replaceable notification
    renotify: true // notify again if tag matches
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
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