export function subscribe(baseURL) {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

  Notification.requestPermission().then((permission) => {
    if (permission !== "granted") return;
    console.log("Notification permission granted!!");

    navigator.serviceWorker.ready
      .then(async (registration) => {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEFhxdhBDhUsGYYj-1e4-OHo5f_4Q4FVqM1QknC-9TSRsiELQoSTEHRUeMzDx6fy3iyzG1yDCbZ1KTiYDZqCG3eA"
          ),
        });
        // Send subscription to Cloudflare Worker
        await fetch(baseURL + "subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription),
        });

        console.log("✅ User subscribed for push notifications");
      })
      .catch((err) => console.error("Service Worker not ready:", err));
  });
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}