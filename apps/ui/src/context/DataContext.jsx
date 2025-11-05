import { createContext, useContext, useState, useEffect, useCallback } from "react";

const DataContext = createContext(null);
const RATES_URL = "https://sapnashrijewellers.github.io/static/rates.json";

export function DataProvider({ children }) {
  const [rates, setRates] = useState(null);
  const [error, setError] = useState(null);

  const fetchRates = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(RATES_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`Failed to fetch rates.json: ${response.status}`);
      const data = await response.json();
      setRates(data);
    } catch (err) {
      console.error("Rates fetch failed:", err);
      setRates(null);
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchRates();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fetchRates]);

  useEffect(() => {
    const interval = setInterval(fetchRates, 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  return (
    <DataContext.Provider value={{ rates, error }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (ctx === null) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
