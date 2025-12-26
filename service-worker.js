/* ===== Minimal Custom Service Worker (No Workbox) ===== */

// Take control of clients immediately
self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");
  self.skipWaiting(); // activate immediately
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...");
  event.waitUntil(
    (async () => {
      // Claim clients so SW takes control of open tabs
      await self.clients.claim();

      // Optionally: cleanup old caches (if any)
      const expectedCaches = [];
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => !expectedCaches.includes(k))
          .map((k) => caches.delete(k))
      );
    })()
  );
});

/* ===== Push Notification Handling ===== */

self.addEventListener("push", (event) => {
  if (!event.data) {
    console.warn("[SW] No push payload received");
    return;
  }

  const payload = event.data.json();
  console.log("[SW] Push received:", payload);

  const title = payload.title || "Sapna Shri Jewellers";
  const options = {
    body: payload.body || "Tap to open",
    icon: "/icons/android-chrome-192x192.png",
    badge: "/icons/android-chrome-96x96.png",
    data: { url: payload.url || "/" },
    vibrate: [100, 50, 100],
    tag: "ssj-notification",
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

/* ===== Handle Notification Click ===== */

self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification click:", event.notification.tag);
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

/* ===== Optional: Simple fetch logging (no caching) ===== */
self.addEventListener("fetch", (event) => {
  // Don’t hijack anything yet — let the network work normally
  // console.log("[SW] Fetch:", event.request.url);
});
