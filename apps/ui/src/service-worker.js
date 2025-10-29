import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { clientsClaim, skipWaiting } from "workbox-core";

// --- Constants ---
const DATA_CACHE = "ssj-data-cache-v2";
const DATA_URL = "/static/data.json"; // or /data.json if you switched format

// --- Precache app shell (HTML, JS, CSS, icons, etc.) ---
precacheAndRoute(self.__WB_MANIFEST || []);

// Cache images dynamically
registerRoute(
  ({ request, url }) =>
    request.destination === "image" && url.pathname.startsWith("/static/img"),
  new CacheFirst({
    cacheName: "static-images-cache-v1",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100, // limit to 100 images
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

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
      clientsClaim(); // take control of pages immediately

      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter(
            (k) =>
              !["workbox-precache", DATA_CACHE, "static-images-cache-v1"].some(prefix =>
                k.startsWith(prefix)
              )
          )
          .map((k) => caches.delete(k))
      );
      
      try {
        const cache = await caches.open(DATA_CACHE);
        const res = await fetch(DATA_URL, { cache: "no-cache" });
        if (res.ok) {
          await cache.put(DATA_URL, res.clone());
          console.log("Cached fresh data.json during activate");
        }
      } catch (err) {
        console.warn("Failed to pre-cache data.js:", err);
      }
    })()
  );
});

self.addEventListener("push", (event) => {

  if (!event.data) {
    console.warn("No payload received!");
    return;
  }
  const payload = event.data.json();
  console.log("Received payload:", payload);

  const title = payload.title || "Notification";
  const options = {
    body: payload.body,
    data: { url: "/#/" },
    icon: "/icons/android-chrome-192x192-v1.png",
    badge: "/icons/android-chrome-96x96-v1.png",
    vibrate: [100, 50, 100],
    tag: "gold-rate-notification",
    renotify: true,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
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

// --- Fetch Handler (for data.js only) ---
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.endsWith("/static/data.json")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(DATA_CACHE);
        try {
          const networkResponse = await fetch(event.request);
          // If successful, update the cache
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          console.warn("Network failed, serving cached data.js");
          const cached = await cache.match(event.request);
          return cached || new Response("{}", { headers: { "Content-Type": "application/json" } });
        }
      })()
    );
  }
});