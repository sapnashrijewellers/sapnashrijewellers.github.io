"use client";

import { useEffect, useState, useId, useTransition, useMemo } from "react";
import ProductCard from "@/components/product/ProductCard";
import productsData from "@/data/products.json";
import type { Product } from "@/types/catalog";
import { Heart } from "lucide-react";

export default function WishlistBar() {
  const [wishlistSlugs, setWishlistSlugs] = useState<string[]>([]);
  const [, startTransition] = useTransition();
  const sectionTitleId = useId();

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const stored = localStorage.getItem("wishlist");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            startTransition(() => {
              setWishlistSlugs(parsed);
            });
          }
        } else {
          startTransition(() => {
            setWishlistSlugs([]);
          });
        }
      } catch (e) {
        console.error("Failed to parse wishlist from localStorage:", e);
      }
    };

    // Initial load on mount
    loadWishlist();

    const onStorage = (e: StorageEvent) => {
      if (e.key === "wishlist") loadWishlist();
    };

    const onCustomUpdate = () => loadWishlist();

    window.addEventListener("storage", onStorage);
    window.addEventListener("wishlist-updated", onCustomUpdate);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("wishlist-updated", onCustomUpdate);
    };
  }, []);

  const wishlistProducts = useMemo(() => {
    if (wishlistSlugs.length === 0) return [];
    const slugSet = new Set(wishlistSlugs);
    return (productsData as Product[]).filter((p) => slugSet.has(p.slug));
  }, [wishlistSlugs]);

  const hasItems = wishlistProducts.length > 0;

  return (
    <section
      aria-labelledby={sectionTitleId}
      className={`
        relative w-full transition-[opacity,transform] duration-200 ease-out will-change-[opacity,transform]
        ${hasItems ? "my-8 opacity-100 visible" : "opacity-0 invisible pointer-events-none hidden"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 mb-3 border-b border-theme/20 pb-2">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary fill-primary" aria-hidden="true" />
          <h2
            id={sectionTitleId}
            className="text-lg sm:text-xl font-bold text-foreground"
          >
            मेरी पसंद (My Wish List)
          </h2>
        </div>
        <span className="text-xs text-muted-foreground font-medium">
          {wishlistProducts.length} {wishlistProducts.length === 1 ? "आइटम (Item)" : "आइटम (Items)"}
        </span>
      </div>

      {/* Screen reader context for crawlers & assistive tech */}
      <div className="sr-only" aria-live="polite">
        {hasItems
          ? `Your wishlist contains ${wishlistProducts.length} saved jewellery products.`
          : "Your wishlist is currently empty."}
      </div>

      {/* Horizontally Scrollable Product Track */}
      <div
        role="region"
        aria-label="Wishlisted products horizontal carousel"
        tabIndex={0}
        className="
          flex gap-3 sm:gap-4 overflow-x-auto px-2 sm:px-4 pb-3 pt-1
          scrollbar-hide snap-x snap-mandatory
          focus:outline-none focus:ring-1 focus:ring-primary/40 rounded-2xl
        "
      >
        {wishlistProducts.map((p) => (
          <article
            key={p.id}
            aria-label={`${p.name} wishlisted item`}
            className="
              shrink-0 w-[160px] sm:w-[200px] lg:w-[220px] snap-start
              transition-transform duration-150 will-change-transform
            "
          >
            <ProductCard product={p} />
          </article>
        ))}
      </div>
    </section>
  );
}