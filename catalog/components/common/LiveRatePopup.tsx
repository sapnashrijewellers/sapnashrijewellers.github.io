"use client";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { X, Activity } from "lucide-react";
import IndianRupeeRate from "@/components/common/IndianRupeeRate";

const HIDE_KEY = "ssj_rate_popup_hidden_until";
const ONE_HOUR = 60 * 60 * 1000;

interface Rates {
  asOn: string;
  gold24K: number;
  gold22K: number;
  silver: number;
}

export default function LiveRatePopup({ rates }: { rates: Rates }) {
  const [open, setOpen] = useState(false);

  const canAutoOpen = () => {
    const until = localStorage.getItem(HIDE_KEY);
    return !until || Date.now() > Number(until);
  };

  const close = () => {
    localStorage.setItem(HIDE_KEY, String(Date.now() + ONE_HOUR));
    setOpen(false);
  };

  const openManually = () => setOpen(true);

  useEffect(() => {
    if (canAutoOpen()) {
      setOpen(true);
    }

    const handler = () => openManually();
    window.addEventListener("open-live-rates", handler);
    return () => window.removeEventListener("open-live-rates", handler);
  }, []);

  if (!open) return null;

  return createPortal(
    <div
  className="
    fixed top-1/2 left-1/2
    -translate-x-1/2 -translate-y-1/2
    z-[60]
    w-screen h-screen
    flex items-center justify-center
    bg-black/80 backdrop-blur-sm
  "
>

    {/* <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"> */}
      <div className="bg-surface border border-theme rounded-xl shadow-xl w-[92%] max-w-md p-5 relative">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="animate-pulse" size={18} />
            <span className="text-sm font-semibold tracking-wide">
              Gold & Silver Rates
            </span>
          </div>
          <button onClick={close} className="ssj-btn cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Rates */}
        <div className="space-y-2 text-sm">
          <RateRow label="Gold 24K (10g)" value={rates.gold24K * 10} />
          <RateRow label="Gold 22K (10g)" value={rates.gold22K * 10} />
          <RateRow label="Gold 18K (10g)" value={rates.gold24K * 10 * 0.75} />
          <RateRow label="Silver 999 (1kg)" value={rates.silver * 1000} />
        </div>

        {/* Footer */}
        <div className="mt-4 text-xs opacity-70 text-right">
          As on{" "}
          {new Date(rates.asOn).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "Asia/Kolkata",
          })}
        </div>
      </div>
    </div>,document.body
  );
}

function RateRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>
      <IndianRupeeRate
        rate={value}
        className="font-semibold"
      />
    </div>
  );
}
