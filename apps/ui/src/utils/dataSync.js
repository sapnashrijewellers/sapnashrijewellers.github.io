export async function getSetCache(event, baseURL, DATA_CACHE) {
    
    const url = new URL(event.request.url);

    // Return cached API data for known endpoints
    if (url.origin === baseURL) {
        event.respondWith(
            (async () => {
                const key =
                    url.searchParams.get("type") === "products"
                        ? "products"
                        : url.searchParams.get("type") === "ticker"
                            ? "ticker"
                            : "rates";

                const dataCache = await caches.open(DATA_CACHE);
                const cached = await dataCache.match(key);
                if (cached) return cached;

                // fallback: fetch fresh
                const response = await fetch(url);
                const clone = response.clone();
                await dataCache.put(key, clone);
                return response;
            })()
        );
    }
}

export // ✅ Periodic sync function
    async function syncData(DATA_CACHE, baseURL) {
    const ratesDefault = {
        "asOn": null,
        gold24K: 0,
        gold22K: 0,
        gold18K: 0,
        silver: 0,
        silverJewelry: 0
    };

    const [ratesData, productsData, tickerData] = await Promise.all([
        fetchWithCache(baseURL, "rates", ratesDefault),
        fetchWithCache(baseURL + "?type=products", "products", []),
        fetchWithCache(baseURL + "?type=ticker", "ticker", {}),
    ]);

    const dataCache = await caches.open(DATA_CACHE);
    await dataCache.put("rates", new Response(JSON.stringify(ratesData), { headers: { "Content-Type": "application/json" } }));
    await dataCache.put("products", new Response(JSON.stringify(productsData), { headers: { "Content-Type": "application/json" } }));
    await dataCache.put("ticker", new Response(JSON.stringify(tickerData), { headers: { "Content-Type": "application/json" } }));
    await dataCache.put("lastSync", new Response(JSON.stringify({ timestamp: Date.now() })));

    console.log("SW: Data synced successfully");

    // Notify clients
    const clients = await self.clients.matchAll();
    for (const client of clients) {
        client.postMessage({
            type: "dataUpdated",
            data: { rates: ratesData, products: productsData, ticker: tickerData },
        });
    }
}

// ✅ Fetch wrapper with fallback to cache
async function fetchWithCache(url, cacheKey, defaultValue, DATA_CACHE) {
    
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Network error");
        const data = await res.clone().json();

        const dataCache = await caches.open(DATA_CACHE);
        await dataCache.put(cacheKey, new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } }));
        
        return data;
    } catch {
        const dataCache = await caches.open(DATA_CACHE);
        const cached = await dataCache.match(cacheKey);
        if (cached) return await cached.json();
        return defaultValue;
    }
}