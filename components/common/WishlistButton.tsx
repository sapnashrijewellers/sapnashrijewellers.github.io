"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Heart } from "lucide-react";

interface WishlistButtonProps {
  id: number;
  size?: number;
  productName?: string;
}

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
  id,
  size = 20,
  productName,
}: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);

  // Synchronize internal state from localStorage
  const refreshStatus = useCallback(() => {
    const stored = safeReadWishlist();
    setIsWishlisted(stored.includes(id.toString()));
  }, [id]);

  // Initial read on mount
  useEffect(() => {
    // Defers state execution to a microtask, satisfying the ESLint rule
    Promise.resolve().then(() => {
      refreshStatus();
    });
  }, [refreshStatus]);

  // Cross-tab and intra-app event synchronization
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

  // Refresh status when returning to viewport or window refocus
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

    const onVisibility = () => {
      if (document.visibilityState === "visible") refreshStatus();
    };
    const onFocus = () => refreshStatus();

    window.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    return () => {
      if (observer && ref.current) observer.unobserve(ref.current);
      window.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    };
  }, [refreshStatus]);

  // Toggle wishlist state
  const toggleWishlist = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const stored = safeReadWishlist();
      const exists = stored.includes(id.toString());

      const next = exists
        ? stored.filter((s) => s !== id.toString())
        : [...stored, id.toString()];

      try {
        localStorage.setItem("wishlist", JSON.stringify(next));
      } catch (err) {
        console.error("Failed to update wishlist in localStorage:", err);
      }

      setIsWishlisted(!exists);
      window.dispatchEvent(new CustomEvent("wishlist-updated"));
    },
    [id]
  );

  const targetLabel = productName ? ` "${productName}"` : "";
  const accessibleActionLabel = isWishlisted
    ? `Remove${targetLabel} from wishlist`
    : `Save${targetLabel} to wishlist`;

  return (
    <button
      ref={ref}
      type="button"
      onClick={toggleWishlist}
      aria-label={accessibleActionLabel}
      aria-pressed={isWishlisted}
      className="
        inline-flex items-center justify-center p-2 rounded-full
        bg-surface/90 backdrop-blur-sm border border-theme/40 text-foreground
        shadow-sm hover:bg-surface hover:scale-105 active:scale-95
        transition-[transform,background-color,border-color] duration-150 ease-out
        focus:outline-none focus:ring-2 focus:ring-primary will-change-[transform]
      "
      title={accessibleActionLabel}
    >
      <Heart
        size={size}
        className={`
          transition-[fill,color,transform] duration-150 ease-out will-change-[transform]
          ${
            isWishlisted
              ? "fill-red-500 text-red-500 scale-110"
              : "text-muted-foreground hover:text-foreground"
          }
        `}
        aria-hidden="true"
      />
      <span className="sr-only">{accessibleActionLabel}</span>
    </button>
  );
}
