import { createContext, useContext, useState, useEffect, useCallback } from "react";

const DataContext = createContext(null);
const dataURL ="https://sapnashrijewellers.github.io/static/data.json";

export function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Core Fetch Function ---
  const fetchAndProcessData = useCallback(async () => {
    try {
      const res = await fetch(dataURL, { cache: "no-cache" });
      if (!res.ok) throw new Error(`Failed to fetch data.json: ${res.status}`);

      const rawData = await res.json();
      
      setData(rawData);
      setIsLoading(false);
    } catch (err) {
      console.error("Data fetch failed:", err);

      // Attempt to load from cache (offline fallback)
      try {
        if ("caches" in window) {
          const cache = await caches.open("ssj-data-cache-v2");
          const cachedRes = await cache.match(dataURL);
          if (cachedRes) {
            const cachedData = await cachedRes.json();            
            setData(cachedData);
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

  // --- Background refresh when tab becomes visible ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Tab active — refreshing data");
        fetchAndProcessData();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fetchAndProcessData]);

  // --- Periodic refresh 
  useEffect(() => {
    const interval = setInterval(fetchAndProcessData, 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAndProcessData]);

  if (isLoading) return <div>Loading latest data...</div>;
  if (!data) return <div>Data not available. Please try again later.</div>;

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