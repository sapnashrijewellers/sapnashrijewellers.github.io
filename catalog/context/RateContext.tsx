"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {Rates} from "@/types/catalog"

const DEFAULT_RATES: Rates = {
  asOn: new Date(),
  gold24K: 0,
  gold22K: 0,
  gold18K: 0,
  silver: 0,
  silverJewelry: 0,
};

const RateContext = createContext<Rates>(DEFAULT_RATES);

const RATES_URL = `${process.env.BASE_URL}/rate/rates.json`;

export function RateProvider({ children }: { children: React.ReactNode }) {
  const [rates, setRates] = useState<Rates>(DEFAULT_RATES);

  const fetchRates = async () => {
    try {
      const res = await fetch(RATES_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("Rate fetch failed");
      const data = await res.json();
      setRates(data);
    } catch (e) {
      console.error("Rates error:", e);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 32_000); // 30–36 sec sweet spot
    return () => clearInterval(interval);
  }, []);

  return (
    <RateContext.Provider value={rates}>
      {children}
    </RateContext.Provider>
  );
}

export const useRates = () => useContext(RateContext);
