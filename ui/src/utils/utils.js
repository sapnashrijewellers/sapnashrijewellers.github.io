// utils.js
export const RATES_KEY = "ratesCache";
const CACHE_DURATION = 10 * 60 * 1000; // 10 min in milliseconds

/**
 * Fetch rates from public/data/rates.json with caching
 */
export async function getRates() {
  try {
    const cached = localStorage.getItem(RATES_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data; // return cached rates
      }
    }

    const res = await fetch("/data/rates.json");
    if (!res.ok) throw new Error("Failed to fetch rates.json");
    const data = await res.json();

    // save to localStorage with timestamp
    localStorage.setItem(
      RATES_KEY,
      JSON.stringify({ data, timestamp: Date.now() })
    );

    return data;
  } catch (err) {
    console.error("Error fetching rates:", err);
    return null;
  }
}

/**
 * Optional: force update rates in localStorage every minute
 */
export function startRatesAutoRefresh(interval = 60 * 1000) {
  setInterval(async () => {
    try {
      const res = await fetch("/data/rates.json");
      if (!res.ok) return;
      const data = await res.json();
      localStorage.setItem(
        RATES_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (err) {
      console.error("Auto-refresh rates failed:", err);
    }
  }, interval);
}
