"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function ProductRatingInput({
  productId,
}: {
  productId: number;
}) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);

  async function submitRating(rating: number) {
    setLoading(true);

    try {
      await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating }),
      });

      setSelected(rating);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={20}
          className={`cursor-pointer ${
            value <= (hovered || selected)
              ? "text-amber-500"
              : "text-muted-foreground"
          }`}
          fill={value <= (hovered || selected) ? "currentColor" : "none"}
          onMouseEnter={() => setHovered(value)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => submitRating(value)}
        />
      ))}
      {loading && <span className="text-xs ml-2">Saving…</span>}
    </div>
  );
}
