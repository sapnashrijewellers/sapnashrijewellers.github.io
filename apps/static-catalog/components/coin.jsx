"use client";
import React from "react";

/**
 * Reusable Coin component
 * Props:
 *  - text: string (e.g. "22K", "24K", "99.9%", "JEWELLERY")
 *  - type: "gold" | "silver" (default: "gold")
 *  - size: number (in px, optional, default: 120)
 */
export default function Coin({ text = "22K", type = "gold", size = 120, title="" }) {
  const baseStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: `${size / 3.5}px`,
    letterSpacing: "1px",
    border: "4px solid",
    boxShadow: "inset 0 2px 5px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.25)",
    transition: "transform 0.2s ease",
  };

  const typeStyles =
    type === "silver"
      ? {
          background: "radial-gradient(circle at 30% 30%, #f4f4f4, #c0c0c0)",
          color: "#555",
          borderColor: "#bbb",
        }
      : {
          background: "radial-gradient(circle at 30% 30%, #ffd700, #b8860b)",
          color: "#603000",
          borderColor: "#d4af37",
        };

  return (
    <div
      style={{ ...baseStyle, ...typeStyles }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      title={title}
    >
      {text}
    </div>
  );
}
