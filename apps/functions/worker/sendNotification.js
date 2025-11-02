import webpush from 'web-push';
import { readFileSync } from 'fs';

// 1. Generate your VAPID keys once (can reuse)
const vapidKeys = {
  publicKey:
    "BKX0C-dcKvSLhEunwNiaOJA2hY1yh4PTCSFngeKPbiWjJaC1Tm_JXKi7Cjtq8KENLaXcr07RKGO27ZqkDiSV4v4",

  privateKey:
    "Tkyw9G8XnpN0cUNHT3Bj8FMDTDaXq4LZi-SVGHcyaXY"

}

// 2. Configure sender
webpush.setVapidDetails(
  'https://sapnashrijewellers.github.io/',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// 4. Payload (this will be encrypted)
const payload = await getNotificationMessage();

await sendAll(webpush, payload);

async function sendAll(webpush, payload) {
  const keys = await getAllSubscriptions();


  // Create an array of Promises
  const sendPromises = keys.map(async (keyPair) => {
    try {
      const response = await webpush.sendNotification(
        keyPair.subscription, JSON.stringify(payload));
      console.log("Push sent successfully:", response.statusCode);
    } catch (err) {
      const status = err?.statusCode || err?.status || 0;

      if (status === 410) {        
        try {
          await deleteSubscription(keyPair.userId);
          console.log("Deleted expired subscription successfully.", keyPair);
        } catch (deleteErr) {
          console.error("Failed to delete expired subscription:", deleteErr);
        }
      } else {
        console.error("Push failed:", status, err?.body || err?.message);
      }

    }
  });

  // Wait for all sends to finish
  await Promise.all(sendPromises);
}

async function getNotificationMessage() {
  const response = await fetch('https://sapnashrijewellers.github.io/static/data.json');
  const data = await response.json();

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
• चाँदी पाट (99.9%): ${parseFloat(data.rates.silver * 1000).toFixed(2)} ₹
• सोना (24K 99.9%): ${parseFloat(data.rates.gold24K * 10).toFixed(2)} ₹
• सोना जेवर (22K): ${parseFloat(data.rates.gold22K * 10).toFixed(2)} ₹
• Gst 3% Extra*
• 📞 FOR BOOKING: 🤙🏻 8234042231
✨ आपका दिन मंगलमय रहें!`;

  const options = {
    title: "भाव - सपना श्री ज्वैलर्स",
    body: body,

  };
  return options;
}

async function getAllSubscriptions() {
  const res = await fetch("https://tight-sky-9fb5.ssjn.workers.dev/subscriptions");
  return await res.json()
}

async function deleteSubscription(userId) {
  const res = await fetch("https://tight-sky-9fb5.ssjn.workers.dev/subscription", {
    //const res = await fetch("http://localhost:8787/subscription", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: userId,
  });

  if (!res.ok) {
    throw new Error(`Failed to delete subscription: ${res.status}`);
  }
  return await res.json();
}