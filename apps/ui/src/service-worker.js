// src/service-worker.ts

/// <reference lib="webworker" /> 
import { syncData } from "./utils/dataSync";
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { clientsClaim, skipWaiting } from 'workbox-core';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';


precacheAndRoute(self.__WB_MANIFEST || []);

const DATA_CACHE = "ssj-data-cache-v1";
//const baseURL = "http://localhost:8787/";
const baseURL = "https://tight-sky-9fb5.ssjn.workers.dev/";
const baseOrigin = new URL(baseURL).origin;
const API_CACHE = "api-runtime-cache-v1"; // 💡 New, dedicated cache name for Workbox runtime data

// ----------------------------------------------------------------------
// 💡 WORKBOX ROUTING: NetworkFirst Strategy for API calls
// StaleWhileRevalidate is often better, but NetworkFirst is robust if
// you need to ensure fresh data when online. I'll stick with your original
// StaleWhileRevalidate from the previous conversation as it's faster.
// ----------------------------------------------------------------------

registerRoute(
    ({ url, request }) => url.origin === baseOrigin && request.method === 'GET',
    
    // 💡 Stale-While-Revalidate serves from cache instantly, fetches in background
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
        // Since Workbox is handling the caching, we just need a function 
        // to collect and return the most recent data from the cache (or network if cold).
        // We will call a simplified 'retrieveDataAndReply' function.
        
        // This function will fetch all data points concurrently and reply.
        const data = await syncData(DATA_CACHE, baseURL, { returnData: true }); 

        console.log("SW: Data retrieved. Replying to client.");
        replyPort.postMessage({ type: 'dataResponse', data: data });

    } catch (e) {
      console.error("SW: FAILED to process dataRequest:", e);
      replyPort.postMessage({ type: 'dataError', message: e.message || 'SW processing error during initial load.' });
    }
  }
});