import { createContext, useContext, useState, useEffect } from "react";
import { subscribe } from "./../utils/pubsub";
const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [rates, setRates] = useState(null);
  const [products, setProducts] = useState(null);
  const [ticker, setTicker] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // <--- NEW STATE
  const baseURL = "https://tight-sky-9fb5.ssjn.workers.dev/";
  //const baseURL = "http://localhost:8787/";

  // Trigger SW sync every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage("syncData");
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Listen for updates from SW
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "dataUpdated") {
          const { rates, products, ticker } = event.data.data;
          console.log("App: received updated data from SW");
          setRates(rates);
          setProducts(products);
          setTicker(ticker);
        }
      });
    }
  }, []);

  // Initial load directly from network
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {

        const [ratesData, productsData, tickerData] = await Promise.all([
          fetch(baseURL).then((r) => r.json()),
          fetch(baseURL + "?type=products").then((r) => r.json()),
          fetch(baseURL + "?type=ticker").then((r) => r.json()),
        ]);
        
        setRates(ratesData);
        setProducts(productsData);
        setTicker(tickerData);
      } catch (err) {
        console.error("Failed to load data:", err);
        setRates({
          asOn: null,
          "24K": 0,
          "22K": 0,
          "18K": 0,
          silver: 0
        });
      } finally {
        // 3. Stop loading in all cases
        setIsLoading(false); // <--- IMPORTANT: Stop loading after try/catch
      }
    }

    load();
  }, []);

  // Request notification permission and subscribe after 2 sec
  // useEffect(() => {
  //   const timer = setTimeout(() => subscribe(baseURL), 2000);

  //   return () => clearTimeout(timer);
  // }, []);


  if (!rates) return <div>Loading rates...</div>;

  return (
    <DataContext.Provider value={{ rates, products, ticker, isLoading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}