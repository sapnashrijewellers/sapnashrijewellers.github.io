// src/utils/dataSync.js - REVISED

// Define a simple structure for endpoints, removing the 'default' key
const DATA_ENDPOINTS = [
    { type: "rates", url: (baseURL) => baseURL + "?type=rate" },
    { type: "products", url: (baseURL) => baseURL + "?type=products" },
    { type: "ticker", url: (baseURL) => baseURL + "?type=ticker" },
];

const API_CACHE = "api-runtime-cache-v1"; // Must match service-worker.js

/**
 * Helper to attempt network fetch or fall back to cache on failure (Stale-If-Error).
 * It will throw a Network error if both network and cache fail.
 * @param {string} url - The URL to fetch.
 * @returns {Promise<any>}
 */
async function fetchOrCache(url) {
    const cache = await caches.open(API_CACHE);

    try {
        // 1. Attempt Network Fetch
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Network fetch failed: ${res.status}`);
        }

        // 2. Network Success: Update Cache & Return Data
        // Clone response before caching because a response body can only be read once.
        await cache.put(url, res.clone());
        return await res.json();

    } catch (e) {
        // 3. Network Failure: Fall back to Cache
        console.warn(`SW: Network fetch failed for ${url}. Attempting cache fallback.`, e.message);

        const cachedResponse = await cache.match(url);

        if (cachedResponse) {
            console.log(`SW: Cache HIT for ${url}. Returning cached data.`);
            return await cachedResponse.json();
        }

        // 4. Cache Miss: Re-throw the error. The caller must handle it.
        console.error(`SW: Cache MISS and Network failed for ${url}.`, e.message);
        throw new Error(`Failed to retrieve data for ${url}.`);
    }
}


/**
 * Fetches data from network/cache, and notifies clients.
 * This is used for both initial data reply and background sync.
 * @param {string} DATA_CACHE - The name of the cache (ignored).
 * @param {string} baseURL - The base API URL.
 * @param {object} options - Options object.
 * @param {boolean} [options.returnData=false] - If true, returns the fetched data.
 * @returns {Promise<{rates: any, products: any, ticker: any}>}
 */
export async function syncData(DATA_CACHE, baseURL, options = {}) {
    const data = {};
    const failedTypes = [];

    // Fetch all data points concurrently
    const fetchPromises = DATA_ENDPOINTS.map(endpoint =>
        fetchOrCache(endpoint.url(baseURL))
            .then(result => data[endpoint.type] = result)
            .catch(e => {
                console.warn(`SW: Failed to get data for ${endpoint.type}. Setting to null.`);
                data[endpoint.type] = null; // Set to null on failure
                failedTypes.push(endpoint.type);
            })
    );

    await Promise.all(fetchPromises);

    const fullData = {
        rates: data.rates,
        products: data.products,
        ticker: data.ticker
    };

    console.log("SW: Data sync/retrieval complete. Failed (" + failedTypes.length + "): " + failedTypes.join(', '));

    const clients = await self.clients.matchAll();
    for (const client of clients) {
        client.postMessage({
            type: "dataUpdated",
            data: fullData, // Contains any new data + any old cached data
        });
    }
    return fullData;
}