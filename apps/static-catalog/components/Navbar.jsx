"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaQrcode } from "react-icons/fa";
import IndianRupeeRate from "./IndianRupeeRate";
import Image from "next/image";

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
    <nav className="pt-2 shadow-md">
      <div className="flex justify-between items-start">
        {/* Left: Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" title="Go to Home Page of Sapna Shri Jewellers" className="flex items-start">
            <Image
              src="/logo.png"
              alt="Sapna Shri Jewellers Nagda | सपना श्री ज्वैलर्स, नागदा"
              className="h-24 w-auto logo"
              width="150"
              height="150"
            />
          </Link>
        </div>

        {/* Right: Menu + Rates */}
        <div className="flex flex-col p-1">
          {/* Top row: Menu links */}
          <div className="flex flex-wrap items-end justify-end gap-4">
            <Link className="hover:underline" href="/" title="Go to Home Page of Sapna Shri Jewellers">
              होम
            </Link>
            <Link className="hover:underline" href="/calculator" title="Jewelry Price Calculator">
              कैलकुलेटर
            </Link>
            <Link className="hover:underline" href="/huid" title="HUID हॉलमार्किंग क्यों ज़रूरी है?">
              हॉलमार्क
            </Link>
            <Link className="hover:text-primary" href="/qr" title="Payment QR Code">
              {/* <FaQrcode size="20" /> */}
              QR
            </Link>
          </div>

          {/* Live rate timestamp */}
          {(rates.gold24K > 0 || rates.silver > 0) && (
            <div className="flex items-end justify-end gap-4 text-sm">
              <span>
                <span className="animate-pulse w-3 h-3 bg-red-500 rounded-full inline-block p-1 text-sm"></span>&nbsp;
                लाइव रेट *{" "}
                {new Date(rates.asOn).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "Asia/Kolkata",
                })}
              </span>
            </div>
          )}

          {/* Bottom rates section */}
<div className="grid grid-cols-2 gap-x-3 gap-y-1 text-right text-sm">
  <div>सोना-24K <IndianRupeeRate rate={rates.gold24K * 10} className="text-primary" /></div>
  <div>सोना-22K <IndianRupeeRate rate={rates.gold22K * 10} className="text-primary" /></div>
  <div>चाँदी(पाठ) <IndianRupeeRate rate={rates.silver * 1000} className="text-primary" /></div>
  <div>चाँदी(जेवर) <IndianRupeeRate rate={rates.silver * 1000 * 0.92} className="text-primary" /></div>
</div>

        </div>
      </div>
    </nav>
  );
}
