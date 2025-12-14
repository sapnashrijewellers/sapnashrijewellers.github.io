"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";

function safeReadWishlist(): string[] {
  try {
    const raw = localStorage.getItem("wishlist");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function WishlistButton({
  slug,
  size = 20,
}: {
  slug: string;
  size?: number;
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);

  // Stable function to update internal UI state
  const refreshStatus = useCallback(() => {
    const stored = safeReadWishlist();
    setIsWishlisted(stored.includes(slug));
  }, [slug]);

  //
  // 1️⃣ INITIAL LOAD
  //
  useEffect(() => {
    // Defer setState to avoid "setState inside effect" warning
    queueMicrotask(() => {
      refreshStatus();
    });
  }, [refreshStatus]);

  //
  // 2️⃣ LISTEN TO LOCALSTORAGE + CUSTOM EVENT
  //
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "wishlist") refreshStatus();
    };

    const onCustom = () => refreshStatus();

    window.addEventListener("storage", onStorage);
    window.addEventListener("wishlist-updated", onCustom);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("wishlist-updated", onCustom);
    };
  }, [refreshStatus]);

  //
  // 3️⃣ REFRESH WHEN BUTTON BECOMES VISIBLE
  //
  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    if (ref.current && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) refreshStatus();
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(ref.current);
    }

    const onVisibility = () => refreshStatus();
    const onFocus = () => refreshStatus();

    window.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    return () => {
      if (observer && ref.current) observer.unobserve(ref.current);
      window.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    };
  }, [refreshStatus]);

  //
  // 4️⃣ TOGGLE WISHLIST
  //
  const toggleWishlist = () => {
    const stored = safeReadWishlist();
    const exists = stored.includes(slug);

    const next = exists
      ? stored.filter((s) => s !== slug)
      : [...stored, slug];

    localStorage.setItem("wishlist", JSON.stringify(next));
    setIsWishlisted(!exists);

    window.dispatchEvent(new CustomEvent("wishlist-updated"));
  };

  return (
    <button
      ref={ref}
      onClick={toggleWishlist}
      className="p-1 rounded-full bg-white/80 hover:bg-white transition shadow-sm"
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        size={size}
        className={`transition-all ${
          isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
        }`}
      />
    </button>
  );
}
