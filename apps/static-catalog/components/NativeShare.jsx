"use client";
import React from "react";
import { FaShareAlt } from "react-icons/fa";

export default function NativeShare({phone = "8234042231" }) {
  

  return (
<button
                            onClick={() => alert("Native sharing not supported in static mode.")}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl transition"
                        >
                            <FaShareAlt /> <span>Share</span>
                        </button>
                        );
}