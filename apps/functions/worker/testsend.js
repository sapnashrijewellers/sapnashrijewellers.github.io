import webpush from "web-push";
import { readFileSync } from "fs";

const vapidKeys = {
    publicKey: "BKX0C-dcKvSLhEunwNiaOJA2hY1yh4PTCSFngeKPbiWjJaC1Tm_JXKi7Cjtq8KENLaXcr07RKGO27ZqkDiSV4v4",
    privateKey: "Tkyw9G8XnpN0cUNHT3Bj8FMDTDaXq4LZi-SVGHcyaXY",
};

webpush.setVapidDetails(
    "mailto:info@sapnashrijewellers.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const payload = JSON.stringify({
    title: "Gold & Silver Rates",
    body: "आज के भाव अपडेट हुए ✨",
    data: { url: "/#/" },
    icon: "/icons/android-chrome-192x192-v1.png",
    badge: "/icons/android-chrome-96x96-v1.png",
    vibrate: [100, 50, 100],
    tag: "gold-rate-notification",
    renotify: true,
});

const subscription = { "endpoint": "https://fcm.googleapis.com/fcm/send/cNMkMjRi8f4:APA91bHCkqfw6aTMC1XuPPKJsNQ9FFFGTOsebFevHtSAU0GWP1L_cSJGQuJ2W-G7aGcbR0608mEfR0ZILPNKi7f_luNsDSM_ll8_wY_r1qq4rMHsn2-mGnkUP1pI1EuBvyU56PhlKvuf", "expirationTime": null, "keys": { "p256dh": "BFn61xPBc04HSyCRb3va28qyStin6AV-CsaABGvSuZ1J2GIgsGJs5wKu7HzlmRue2WTQG8W0IuodoLoqQuFZ1hY", "auth": "sUoPMdoFNSvLkYlBuWzLiQ" } };

try {
    const res = await webpush.sendNotification(subscription, payload);
    console.log("✅ Sent to:", subscription.endpoint);
} catch (err) {
    console.error("❌ Failed:", err.statusCode, err.body);
}

