"use client";
import React from "react";
import { FaShareAlt } from "react-icons/fa";

export default function NativeShare({ 
  productName = "Beautiful Jewellery", 
  productUrl, 
  phone = "8234042231" 
}) {

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: `Check out this jewellery from Sapna Shri Jewellers 💎`,
          url: productUrl || `https://wa.me/${phone}`,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      alert("Native sharing is not supported on this device.");
    }
  };

  return (
    <button
      onClick={handleNativeShare}
      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl transition"
    >
      <FaShareAlt /> 
      <span>Share</span>
    </button>
  );
}
