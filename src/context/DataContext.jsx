import { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [rates, setRates] = useState(null);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [ratesData, productsData] = await Promise.all([
          fetch("https://tight-sky-9fb5.vipul81.workers.dev/").then(r => r.json()),
          fetch("/data/products.json").then(r => r.json())
        ]);

        if (mounted) {
          // Normalize numeric keys for easy access in UI
          const normalizedRates = {
            asOn: ratesData.asOn,
            gold24K: ratesData["24K"],
            gold22K: ratesData["22K"],
            gold18K: ratesData["18K"],
            silver: ratesData.silver,
            gstPercent: ratesData.gstPercent
          };

          setRates(normalizedRates);
          setProducts(productsData);
        }
      } catch (err) {
        console.error("Failed to load data", err);
      }
    }

    load();

    const interval = setInterval(load, 60 * 1000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Wait until rates are loaded before rendering children
  if (!rates) {
    return <div>Loading rates, please wait...</div>;
  }

  return (
    <DataContext.Provider value={{ rates, products }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
