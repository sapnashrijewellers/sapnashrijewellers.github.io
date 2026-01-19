"use client";

import dynamic from "next/dynamic";
import LiveRatePopup from "@/components/common/LiveRatePopup";
import ResponsiveNavbar from "@/components/navbar/ResponsiveNavbar";
import { useRates } from "@/context/RateContext";
import BrandLogo from "../common/BrandLogo";

const SearchBar = dynamic(
  () => import("@/components/common/SearchBar"),
  {
    ssr: false,
    loading: () => (
      <div className="h-10 w-full rounded-xl bg-surface animate-pulse" />
    ),
  }
);

export default function Navbar() {
  const rates = useRates();

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-theme">
      <LiveRatePopup rates={rates} />

      <div className="mx-auto max-w-7xl px-3 py-2">
        {/* TOP ROW */}
        <div className="flex items-center gap-4">
          {/* LEFT: Logo */}
          <div className="flex-shrink-0">
            <BrandLogo />
          </div>

          {/* CENTER (md+ only): Search */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="w-full max-w-xl">
              <SearchBar />
            </div>
          </div>

          {/* RIGHT: Nav */}
          <div className="ml-auto flex-shrink-0">
            <ResponsiveNavbar />
          </div>
        </div>

        {/* SECOND ROW (mobile only): Search */}
        <div className="mt-3 md:hidden">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
