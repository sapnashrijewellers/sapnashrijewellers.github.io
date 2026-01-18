"use client";

import dynamic from "next/dynamic";
import LiveRatePopup from "@/components/common/LiveRatePopup";
import ResponsiveNavbar from "@/components/navbar/ResponsiveNavbar"
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
    <header className="sticky top-0 z-40 bg-surface border-b border-theme py-2">
  <LiveRatePopup rates={rates} />
  <div className="mx-auto max-w-7xl px-3 h-auto">
    <div className="flex items-center h-14 gap-4">
      {/* Logo */}
      <div className="flex-shrink-0">
        <BrandLogo />
      </div>

      {/* Search bar takes remaining space */}
      <div className="flex-1">
        <SearchBar />
      </div>

      {/* Navbar */}
      <div className="flex-shrink-0">
        <ResponsiveNavbar />
      </div>
    </div>
  </div>
</header>


  );
}
