import { createContext, useContext, useState, useEffect, useCallback } from "react";

const DataContext = createContext(null);

const PRODUCTS_URL = "https://sapnashrijewellers.github.io/static/data.json";
const RATES_URL = "https://sapnashrijewellers.github.io/static/rates.json";

export function DataProvider({ children }) {
  const [data, setData] = useState({ products: null, rates: null, ticker: null });
  const [isLoading, setIsLoading] = useState(true);

  // --- Core Fetch Function ---
  const fetchAndProcessData = useCallback(async () => {
    try {
      // Fetch both data.json and rates.json in parallel
      const [productsRes, ratesRes] = await Promise.all([
        fetch(PRODUCTS_URL, { cache: "no-cache" }),
        fetch(RATES_URL, { cache: "no-cache" }),
      ]);

      if (!productsRes.ok) throw new Error(`Failed to fetch data.json: ${productsRes.status}`);
      if (!ratesRes.ok) throw new Error(`Failed to fetch rates.json: ${ratesRes.status}`);

      const [productsData, ratesData] = await Promise.all([
        productsRes.json(),
        ratesRes.json(),
      ]);

      const mergedData = { categorizedProducts: productsData.categorizedProducts, sub_categories: productsData.sub_categories, rates: ratesData, ticker: productsData.ticker };
      setData(mergedData);
      setIsLoading(false);

      // Update cache
      if ("caches" in window) {
        const cache = await caches.open("ssj-data-cache-v3");
        await cache.put(PRODUCTS_URL, new Response(JSON.stringify(productsData)));
        await cache.put(RATES_URL, new Response(JSON.stringify(ratesData)));
      }

    } catch (err) {
      console.error("Data fetch failed:", err);

      // Attempt to load from cache (offline fallback)
      try {
        if ("caches" in window) {
          const cache = await caches.open("ssj-data-cache-v3");
          const [cachedProducts, cachedRates] = await Promise.all([
            cache.match(PRODUCTS_URL),
            cache.match(RATES_URL),
          ]);

          const cachedProductsData = cachedProducts ? await cachedProducts.json() : null;
          const cachedRatesData = cachedRates ? await cachedRates.json() : null;

          if (cachedProductsData || cachedRatesData) {
            setData({ products: cachedProductsData, rates: cachedRatesData });
          }
        }
      } catch (cacheErr) {
        console.warn("No cached data available:", cacheErr);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  // --- Initial load ---
  useEffect(() => {
    fetchAndProcessData();
  }, [fetchAndProcessData]);

  // --- Refresh when tab becomes visible ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchAndProcessData();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fetchAndProcessData]);

  // --- Periodic refresh every minute ---
  useEffect(() => {
    const interval = setInterval(fetchAndProcessData, 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAndProcessData]);

  if (isLoading) return <div>Loading latest data...</div>;
  if (!data.products && !data.rates) return <div>Data not available. Please try again later.</div>;

  return (
    <DataContext.Provider value={{ ...data, isLoading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (ctx === null) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
