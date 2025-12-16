"use client";

import { useEffect, useState } from "react";
import IndianRupeeRate from "./IndianRupeeRate";

type Rates = {
  asOn: string;
  gold24K: number;
  gold22K: number;
  gold18K?: number;
  silver: number;
  silverJewelry?: number;
};

export default function RatesPanel() {
  const [rates, setRates] = useState<Rates | null>(null);
const rateUrl = `${process.env.BASE_URL}/rate/rates.json`
  const fetchRates = async () => {
    try {
      const res = await fetch(rateUrl, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch rates");
      const data: Rates = await res.json();
      setRates(data);
    } catch (err) {
      console.error("Error fetching rates:", err);
    }
  };

  useEffect(() => {
    fetchRates(); // initial fetch
    const interval = setInterval(fetchRates, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (!rates) return null;

  const rateItems = [
    { label: "सोना (24K)", value: rates.gold24K * 10 },
    { label: "सोना (22K)", value: rates.gold22K * 10 },
    { label: "चाँदी (99.9)", value: rates.silver * 1000 },
    { label: "चाँदी (जेवर)", value: rates.silver * 1000 * 0.92 },
  ];

  const formattedDate = new Date(rates.asOn).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  return (
    <div className="mt-2 flex flex-col gap-6 p-6  w-full bg-accent border rounded-2xl">
      <div>
        <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full inline-block p-1"></span>
        &nbsp; लाइव रेट * {formattedDate}
      </div>

      {rateItems
        .filter((item) => item.value > 0)
        .map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center text-3xl border-b pb-2"
          >
            <span className=" flex items-center gap-2">
              {item.label}:
            </span>
            <IndianRupeeRate rate={item.value} className="" />
          </div>
        ))}
    </div>
  );
}
