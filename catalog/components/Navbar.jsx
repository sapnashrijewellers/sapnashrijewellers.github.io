"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import IndianRupeeRate from "./IndianRupeeRate";
import Image from "next/image";
import DesktopTopLinks from "./DesktopNavLinks";

const RATES_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/rate/rates.json`;

export default function Navbar() {
  const [rates, setRates] = useState({
    asOn: "",
    gold24K: 0,
    gold22K: 0,
    gold18K: 0,
    silver: 0,
    silverJewelry: 0,
  });

  // Fetch function
  const fetchRates = async () => {
    try {
      console.log(RATES_URL);
      const res = await fetch(RATES_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to fetch rates: ${res.status}`);
      const data = await res.json();
      setRates(data);
    } catch (err) {
      console.error("Rates fetch error:", err);
    }
  };

  // Auto refresh every minute
  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="p-2 shadow-md">
      <div className="flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" title="Go to Home Page of Sapna Shri Jewellers" className="flex items-start">
            <Image
              src="/icons/favicon-v1.svg"
              alt="Sapna Shri Jewellers Nagda | सपना श्री ज्वैलर्स, नागदा"
              className="h-24 w-auto logo bg-black rounded-xl"
              width="150"
              height="150"
            />
          </Link>
        </div>

        {/* Right: Menu + Rates */}
        <div className="flex flex-col p-1">
          {/* Top row: Menu links */}
         <DesktopTopLinks/>

          {/* Live rate timestamp */}
          {(rates.gold24K > 0 || rates.silver > 0) && (
            <div className="flex items-end justify-end gap-4 text-xs">
              <span>
                <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full inline-block p-1"></span>&nbsp;
                Live Rates *{" "}
                {new Date(rates.asOn).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                  timeZone: "Asia/Kolkata",
                })}
              </span>
            </div>
          )}

          {/* Bottom rates section */}
          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-2 text-right justify-end">
            
            <div className="flex justify-end">
            सोना-24K:
              <IndianRupeeRate rate={rates.gold24K * 10} className="text-primary" itemName="Gold 24K" />
            </div>

            <div className="flex justify-end">
            सोना-22K:
              <IndianRupeeRate rate={rates.gold22K * 10} className="text-primary" itemName="Gold 22K" />
            </div>

            <div className="flex justify-end">
            चाँदी: 
              <IndianRupeeRate rate={rates.silver * 1000} className="text-primary" itemName="Silver 99.9%" />
            </div>

            <div className="flex justify-end">
            चाँदी जेवर: 
              <IndianRupeeRate rate={rates.silver * 1000 * 0.92} className="text-primary" itemName="Silver Jewelry" />
            </div>
          </div>


        </div>
      </div>
    </nav>
  );
}
