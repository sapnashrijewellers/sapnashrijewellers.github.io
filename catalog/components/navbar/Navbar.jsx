"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import IndianRupeeRate from "../common/IndianRupeeRate";
import Image from "next/image";
import ResponsiveNavbar from "@/components/navbar/ResponsiveNavbar"

const RATES_URL = `${process.env.BASE_URL}/rate/rates.json`;

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
    <nav className="p-2 shadow-md bg-highlight">
      
      <div className="flex justify-between items-center ">
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
          {/* <DesktopTopLinks /> */}
          <ResponsiveNavbar/>
          {/* Bottom rates section */}
          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-1 text-right justify-end font-cinzel text-xs font-semibold">
            <div className="flex justify-end" title={new Date(rates.asOn).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
              timeZone: "Asia/Kolkata",
            })}>Gold 24K:&nbsp;
              <IndianRupeeRate rate={rates.gold24K * 10} className="text-primary-dark  text-sm" itemName="Gold 24K" itemTitle="10g" />
            </div>

            <div className="flex justify-end">
              Gold 22K:&nbsp;
              <IndianRupeeRate rate={rates.gold22K * 10} className="text-primary-dark text-sm" itemName="Gold 22K" itemTitle="10g" />
            </div>

            <div className="flex justify-end">
              Silver 999:&nbsp;
              <IndianRupeeRate rate={rates.silver * 1000} className="text-primary-dark text-sm" itemName="Silver 99.9%" itemTitle="1kg" />
            </div>

            <div className="flex justify-end">
              Silver Jewelry:&nbsp;
              <IndianRupeeRate rate={rates.silver * 1000 * 0.92} className="text-primary-dark text-sm" itemName="Silver Jewelry" itemTitle="1kg" />
            </div>
          </div>


        </div>
      </div>
    </nav>
  );
}
