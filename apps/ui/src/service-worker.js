import { syncData } from "./utils/dataSync";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { clientsClaim, skipWaiting } from "workbox-core";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

// --------------------------------------------
// PRECACHE
// --------------------------------------------
precacheAndRoute(self.__WB_MANIFEST || []);

const DATA_CACHE = "ssj-data-cache-v1";
const API_CACHE = "api-runtime-cache-v1";
//const baseURL = "https://localhost:8787/";
const baseURL = "https://tight-sky-9fb5.ssjn.workers.dev/";
const baseOrigin = new URL(baseURL).origin;

// Runtime caching for API requests
registerRoute(
  ({ url, request }) => url.origin === baseOrigin && request.method === "GET",
  new StaleWhileRevalidate({
    cacheName: API_CACHE,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

// --------------------------------------------
// SERVICE WORKER LIFECYCLE
// --------------------------------------------

// Install
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  skipWaiting(); // activate new SW immediately
});

// Activate
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    (async () => {
      cleanupOutdatedCaches();

      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => ![DATA_CACHE, API_CACHE, "workbox-precache"].includes(k))
          .map((k) => caches.delete(k))
      );

      clientsClaim(); // take control of pages immediately
      await syncData(DATA_CACHE, baseURL); // initial sync
    })()
  );
});

// --------------------------------------------
// PUSH NOTIFICATIONS
// --------------------------------------------
self.addEventListener("push", (event) => {
  event.waitUntil(
    (async () => {
      console.log("Push received!", event);

      // Fetch latest rates
      const data = await syncData(DATA_CACHE, baseURL, { returnData: true });

      const title = "भाव - सपना श्री ज्वैलर्स";
      const body = 
`🙏 जय श्री कृष्णा - जय जिनेंद्र 🙏
दिनांक: ${new Date(data.rates.asOn).toLocaleString("en-IN", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata"
})}
• चाँदी पाट (99.9%): ${parseFloat(data.rates.silver*1000).toFixed(2)} ₹
• सोना (24K 99.9%): ${parseFloat(data.rates.gold24K*10).toFixed(2)} ₹
• सोना जेवर (22K): ${parseFloat(data.rates.gold22K*10).toFixed(2)} ₹
• Gst 3% Extra*
• 📞 FOR BOOKING: 🤙🏻 8234042231
✨ आपका दिन मंगलमय रहें!`;

      const options = {
        body,
        icon: "/icons/android-chrome-192x192-v1.png",
        badge: "/icons/android-chrome-96x96-v1.png",
        vibrate: [100, 50, 100],
        tag: "gold-rate-notification",
        renotify: true,
        data: { url: '/#/' }
      };

      await self.registration.showNotification(title, options);
    })()
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click received.');

  event.notification.close(); // Always close the notification first

  // Define the URL you want to open
  const targetUrl = '/'; // or '/notifications' etc.

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // If PWA is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// --------------------------------------------
// MESSAGE HANDLING
// --------------------------------------------
self.addEventListener("message", (event) => {
  event.waitUntil(
    (async () => {
      const data = event.data;

      // Background sync trigger
      if (data?.type === "syncData") {
        console.log("SW: Received syncData trigger for background refresh");
        await syncData(DATA_CACHE, baseURL);
      }

      // Initial data request from client
      if (data?.type === "dataRequest" && event.ports?.[0]) {
        const replyPort = event.ports[0];
        try {
          const data = await syncData(DATA_CACHE, baseURL, { returnData: true });
          replyPort.postMessage({ type: "dataResponse", data });
        } catch (err) {
          console.error("SW: Failed to process dataRequest:", err);
          replyPort.postMessage({ type: "dataError", message: err.message || "SW processing error" });
        }
      }
    })()
  );
});
