import { createContext, useContext, useState, useEffect, useCallback } from "react";

const DataContext = createContext(null);
const RATES_URL = "https://sapnashrijewellers.github.io/static/rates1.json";

export function DataProvider({ children }) {
  const [data, setData] = useState({ rates: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch latest rates ---
  const fetchAndProcessData = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(RATES_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`Failed to fetch rates.json: ${response.status}`);

      const ratesData = await response.json();
      setData({ rates: ratesData });
    } catch (err) {
      console.error("Rates fetch failed:", err);
      setData({ rates: null }); // ensure null if fetch failed
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Initial load ---
  useEffect(() => {
    fetchAndProcessData();
  }, [fetchAndProcessData]);

  // --- Refresh when tab becomes visible ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchAndProcessData();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fetchAndProcessData]);

  // --- Periodic refresh every minute ---
  useEffect(() => {
    const interval = setInterval(fetchAndProcessData, 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAndProcessData]);

  // --- Always render children; consumer decides handling ---
  return (
    <DataContext.Provider value={{ ...data, isLoading, error }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (ctx === null)
    throw new Error("useData must be used within a DataProvider");
  return ctx;
}
