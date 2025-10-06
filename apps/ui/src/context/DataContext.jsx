import { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext(null);

// In-memory cache (shared across renders/pages)
let cache = {
  timestamp: 0,
  data: null,
};

export function DataProvider({ children }) {
  const [rates, setRates] = useState(null);
  const [products, setProducts] = useState(null);
  const [ticker, setTicker] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const now = Date.now();
      const cacheValid = cache.data && now - cache.timestamp < 60 * 1000;

      if (cacheValid) {
        const { rates, products, ticker } = cache.data;
        setRates(rates);
        setProducts(products);
        setTicker(ticker);
        return;
      }

      const sURL = "https://tight-sky-9fb5.ssjn.workers.dev/"; // or localhost
      //const sURL = "http://localhost:8787"; // or localhost

      try {
        const [ratesData, productsData, tickerData] = await Promise.all([
          fetch(sURL).then((r) => r.json()),
          fetch(sURL + "?type=products").then((r) => r.json()),
          fetch(sURL + "?type=ticker").then((r) => r.json()),
        ]);

        const normalizedRates = {
          asOn: ratesData.asOn,
          gold24K: ratesData["24K"],
          gold22K: ratesData["22K"],
          gold18K: ratesData["18K"],
          silver: ratesData.silver,
          gstPercent: ratesData.gstPercent,
        };

        const newData = {
          rates: normalizedRates,
          products: productsData,
          ticker: tickerData,
        };

        // Save to in-memory cache
        cache = {
          timestamp: now,
          data: newData,
        };

        if (mounted) {
          setRates(normalizedRates);
          setProducts(productsData);
          setTicker(tickerData);
        }
      } catch (err) {
        console.error("Failed to load data", err);
      }
    }

    load();

    // Optional: auto-refresh every minute
    const interval = setInterval(load, 60 * 1000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (!rates) {
    return <div>Loading rates, please wait...</div>;
  }

  return (
    <DataContext.Provider value={{ rates, products, ticker }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
