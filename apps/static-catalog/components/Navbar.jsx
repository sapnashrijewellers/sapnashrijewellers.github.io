"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaQrcode } from "react-icons/fa";
import IndianRupeeRate from "./IndianRupeeRate";

const RATES_URL = "https://sapnashrijewellers.github.io/static/rates.json ";

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
    <nav className="bg-background text-foreground p-2 shadow-md w-full border-b border-border">
      <div className="mx-auto max-w-7xl flex justify-between items-start">
        {/* Left: Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Sapna Shri Jewellers Nagda | सपना श्री ज्वैलर्स, नागदा"
              className="h-24 w-auto logo"
            />
          </Link>
        </div>

        {/* Right: Menu + Rates */}
        <div className="flex flex-col justify-between w-full sm:w-auto ml-4">
          {/* Top row: Menu links */}
          <div className="flex flex-wrap justify-end gap-4 mb-1">
            <Link className="hover:underline" href="/" title="Home Page">
              होम
            </Link>
            <Link className="hover:underline" href="/calculator" title="Price Calculator">
              कैलकुलेटर
            </Link>
            <Link className="hover:underline" href="/huid" title="HUID हॉलमार्किंग क्यों ज़रूरी है?">
              हॉलमार्किंग
            </Link>
            <Link className="hover:text-primary" href="/qr" title="Payment QR Code">
              <FaQrcode size="20" />
            </Link>
          </div>

          {/* Live rate timestamp */}
          {(rates.gold24K > 0 || rates.silver > 0) && (
            <div className="flex justify-start gap-4">
              <span>
                <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full inline-block p-1"></span>&nbsp;
                लाइव रेट *{" "}
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

          {/* Bottom row: Live rates */}
          {rates.gold24K > 0 && (
            <div className="flex justify-start gap-4">
              <span className="flex items-center gap-1">
                सोना (24K):{" "}
                <IndianRupeeRate rate={rates.gold24K * 10} className="text-primary" />
              </span>
              <span>
                सोना (22K):{" "}
                <IndianRupeeRate rate={rates.gold22K * 10} className="text-primary" />
              </span>
            </div>
          )}

          {rates.silver > 0 && (
            <div className="flex justify-start gap-4">
              <span className="flex items-center gap-1">
                चाँदी (99.9):{" "}
                <IndianRupeeRate rate={rates.silver * 1000} className="text-primary" />
              </span>
              <span>
                चाँदी (जेवर):{" "}
                <IndianRupeeRate rate={rates.silver * 1000 * 0.92} className="text-primary" />
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
