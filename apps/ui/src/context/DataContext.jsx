// src/context/DataContext.jsx

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { subscribe } from "./../utils/pubsub";

const DataContext = createContext(null);

// Utility function to request data from the Service Worker and await a response
const requestDataFromSW = (swController) => {
  return new Promise((resolve, reject) => {
      // ⚠️ IMPORTANT: Now accepts the controller
      if (!swController) {
          return reject(new Error("Service Worker controller unavailable."));
      }

      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
          if (event.data?.type === 'dataResponse') {
              resolve(event.data.data);
          } else if (event.data?.type === 'dataError') {
              reject(new Error(event.data.message || 'SW data fetch failed'));
          }
          messageChannel.port1.close();
      };

      swController.postMessage({ type: 'dataRequest' }, [messageChannel.port2]);
  });
};


export function DataProvider({ children }) {
  const [rates, setRates] = useState(null);
  const [products, setProducts] = useState(null);
  const [ticker, setTicker] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  // ✅ 1. DEFINE: Define this function BEFORE the useEffect hooks
  // This function is defined first so the hooks can use it without a ReferenceError.
  const updateDataState = useCallback((data) => {
    // Check if data is valid before setting state
    if (data && data.rates) {
        setRates(data.rates);
        setProducts(data.products);
        setTicker(data.ticker);
    }
  }, []);

  
  // ------------------------------------------------------------------
  // ✅ 2. USE: The useEffect hooks now safely use the defined function
  // ------------------------------------------------------------------

  // ✅ Trigger SW sync every minute (for background refresh)
  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: "syncData" });
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Listen for background updates from SW
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const handler = (event) => {
        if (event.data?.type === "dataUpdated") {
          console.log("App: received background updated data from SW");
          updateDataState(event.data.data); // Safely called here
        }
      };
      navigator.serviceWorker.addEventListener("message", handler);
      return () => navigator.serviceWorker.removeEventListener("message", handler);
    }
  }, [updateDataState]);


  // ✅ Initial Load: Request data from SW (Cache First, Awaiting Response)
  useEffect(() => {
    async function loadFromCacheOrNetwork(swController) {
        setIsLoading(true);
        try {
            // WAIT for the SW to return data 
            const data = await requestDataFromSW(swController);
            
            updateDataState(data); // Safely called here

        } catch (err) {
            console.error("Failed to load initial data via Service Worker:", err);
            // Fallback to minimal data state
            updateDataState({
              rates: { asOn: null, "24K": 0, "22K": 0, "18K": 0, silver: 0 },
              products: null,
              ticker: null,
            });
        } finally {
            setIsLoading(false); 
        }
    }
    
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
            if (registration.active) {
                // Pass the active controller to the loading function
                loadFromCacheOrNetwork(registration.active); 
            } else {
                console.error("SW ready, but no active controller.");
                setIsLoading(false);
            }
        });
    } else {
        setIsLoading(false);
    }
    
  }, [updateDataState]);


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