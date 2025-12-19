"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase";

export default function ProductRatingInput({
  productId,
}: {
  productId: number;
}) {
  const user = useAuth();

  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);

  async function ensureLogin() {
    if (!user) {
      await signInWithPopup(auth, googleProvider);
    }
  }

  async function submitRating(rating: number) {
    try {
      setLoading(true);

      // 1️⃣ Ensure user is logged in
      await ensureLogin();

      if (!auth.currentUser) return;

      // 2️⃣ Submit rating with UID
      await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          userId: auth.currentUser.uid,
        }),
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
          className={`cursor-pointer transition ${
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
{!user && (
  <span className="text-xs text-muted-foreground ml-2">
    Login to rate
  </span>
)}
      {loading && (
        <span className="text-xs ml-2 text-muted-foreground">
          Saving…
        </span>
      )}
    </div>
  );
}
