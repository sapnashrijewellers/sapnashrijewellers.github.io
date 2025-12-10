"use client";

import { useEffect, useRef, useState } from "react";
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

  const refreshStatus = () => {
    const stored = safeReadWishlist();
    setIsWishlisted(stored.includes(slug));
  };

  // initial load + when slug changes
  useEffect(() => {
    refreshStatus();
  }, [slug]);

  // Listen for cross-tab 'storage' event & in-tab custom event
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "wishlist") refreshStatus();
    };
    const onCustom = (e: Event) => {
      // optionally, could read detail if you dispatch it
      refreshStatus();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("wishlist-updated", onCustom);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("wishlist-updated", onCustom);
    };
  }, [slug]);

  // IntersectionObserver to refresh when visible + fallbacks
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let didObserve = false;

    if (ref.current && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              didObserve = true;
              refreshStatus();
            }
          });
        },
        { threshold: 0.1, rootMargin: "50px" }
      );
      observer.observe(ref.current);
    }

    const onVisibility = () => {
      // Called when tab visibility changes or window focus - useful fallback
      if (document.visibilityState === "visible") refreshStatus();
    };

    window.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onVisibility);

    return () => {
      if (observer && ref.current) observer.unobserve(ref.current);
      window.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onVisibility);
    };
  }, [slug]);

  // Toggle wishlist (updates localStorage + notify)
  const toggleWishlist = () => {
    const stored = safeReadWishlist();
    const exists = stored.includes(slug);
    let next: string[];
    if (exists) {
      next = stored.filter((s) => s !== slug);
      setIsWishlisted(false);
    } else {
      next = [...stored, slug];
      setIsWishlisted(true);
    }

    try {
      localStorage.setItem("wishlist", JSON.stringify(next));
    } catch (err) {
      console.error("Failed to write wishlist to localStorage", err);
    }

    // dispatch custom event for same-tab listeners (use CustomEvent)
    window.dispatchEvent(new CustomEvent("wishlist-updated", { bubbles: true }));
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
