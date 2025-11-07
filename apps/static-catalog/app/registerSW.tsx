"use client";

import { useEffect } from "react";
import { subscribeUser } from "../utils/pubsub.js";

const workerURL = "https://tight-sky-9fb5.ssjn.workers.dev/";
export default function RegisterSW() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", async () => {
        try {
          const registration = await navigator.serviceWorker.register("/service-worker.js", {
            scope: "/",
          });
          console.log("✅ Service Worker registered:", registration);
          if (registration && Notification.permission === "granted") {
            subscribeUser(workerURL, registration);
          }

          // Request Notification permission on install
          if (Notification.permission === "default") {
            const permission = await Notification.requestPermission();
            console.log("Notification permission:", permission);
          }
        } catch (err) {
          console.error("SW registration failed:", err);
        }
      });
    }
  }, []);

  return null;
}
