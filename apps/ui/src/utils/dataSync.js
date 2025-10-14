// src/utils/dataSync.js

// 💡 We only need the defaults and syncData now.
const ratesDefault = {
    "asOn": null,
    gold24K: 0,
    gold22K: 0,
    gold18K: 0,
    silver: 0,
    silverJewelry: 0
};

const DATA_ENDPOINTS = [
    { type: "rates", url: (baseURL) => baseURL, default: ratesDefault },
    { type: "products", url: (baseURL) => baseURL + "?type=products", default: [] },
    { type: "ticker", url: (baseURL) => baseURL + "?type=ticker", default: {} },
];


/**
 * Helper to fetch data, relying on Workbox to handle caching (Stale-While-Revalidate).
 * @param {string} url - The URL to fetch.
 * @param {any} defaultValue - Default value on network failure.
 * @returns {Promise<any>}
 */
async function fetchWithWorkbox(url, defaultValue) {
    try {
        // 💡 Workbox Strategy (StaleWhileRevalidate) is configured in service-worker.ts.
        // Calling fetch() here will trigger the SW's 'fetch' listener, where Workbox 
        // intercepts and applies the cache-first logic, returning the fastest available response.
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Network fetch failed for ${url}: ${res.status}`);
        }

        return await res.json();

    } catch (e) {
        // If the fetch fails and Workbox (or the browser) has no cache, 
        // we return the application-level default.
        console.warn(`SW: Fetch failed for ${url}. Returning default value.`, e.message);
        return defaultValue;
    }
}


/**
 * Fetches data from network (via Workbox), updates cache implicitly, and notifies clients.
 * This is used for both initial data reply and background sync.
 * @param {string} DATA_CACHE - The name of the cache (no longer strictly needed but kept for signature).
 * @param {string} baseURL - The base API URL.
 * @param {object} options - Options object.
 * @param {boolean} [options.returnData=false] - If true, returns the fetched data.
 * @returns {Promise<{rates: any, products: any, ticker: any}>}
 */
export async function syncData(DATA_CACHE, baseURL, options = {}) {
    const DATA_ENDPOINTS = [
        { type: "rates", url: (baseURL) => baseURL + "?type=rate", default: ratesDefault },
        { type: "products", url: (baseURL) => baseURL + "?type=products", default: [] },
        { type: "ticker", url: (baseURL) => baseURL + "?type=ticker", default: {} },
    ];
    const data = {};

    // Fetch all data points concurrently
    const fetchPromises = DATA_ENDPOINTS.map(endpoint =>
        fetchWithWorkbox(endpoint.url(baseURL), endpoint.default)
            .then(result => data[endpoint.type] = result)
            .catch(e => {
                // Should be caught by fetchWithWorkbox, but defensive catch here.
                data[endpoint.type] = endpoint.default;
            })
    );

    await Promise.all(fetchPromises);

    const fullData = { rates: data.rates, products: data.products, ticker: data.ticker };

    console.log("SW: Data sync/retrieval complete.");

    // 1. If requested for initial load, return immediately
    if (options.returnData) {
        return fullData;
    }

    // 2. Otherwise, notify clients for background updates
    const clients = await self.clients.matchAll();
    for (const client of clients) {
        client.postMessage({
            type: "dataUpdated",
            data: fullData,
        });
    }

    return fullData;
}