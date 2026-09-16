"use client";

import { useEffect, useState, useId, useTransition, useMemo } from "react";
import ProductCard from "@/components/product/ProductCard";
import productsData from "@/data/products.json";
import type { Product } from "@/types/catalog";

const STORAGE_KEY = "recently_viewed";

interface RecentlyViewedBarProps {
  currentProductId?: string | number;
}

export default function RecentlyViewedBar({ currentProductId }: RecentlyViewedBarProps) {
  const [viewedIds, setViewedIds] = useState<string[]>([]);
  const [, startTransition] = useTransition();
  const sectionTitleId = useId();

  useEffect(() => {
    const loadRecentlyViewed = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            startTransition(() => {
              setViewedIds(parsed);
            });
            return;
          }
        }
        startTransition(() => {
          setViewedIds([]);
        });
      } catch (e) {
        console.error("Failed to parse recently viewed from localStorage:", e);
      }
    };

    loadRecentlyViewed();

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) loadRecentlyViewed();
    };

    const onCustomUpdate = () => loadRecentlyViewed();

    window.addEventListener("storage", onStorage);
    window.addEventListener("recently-viewed-updated", onCustomUpdate);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("recently-viewed-updated", onCustomUpdate);
    };
  }, []);

  const recentProducts = useMemo(() => {
    if (viewedIds.length === 0) return [];

    const productMap = new Map<string, Product>();
    (productsData as Product[]).forEach((p) => {
      productMap.set(p.id.toString(), p);
    });

    const currentIdStr = currentProductId?.toString();

    return viewedIds
      .filter((id) => id !== currentIdStr) // Omit the product currently open
      .map((id) => productMap.get(id))
      .filter((p): p is Product => Boolean(p));
  }, [viewedIds, currentProductId]);

  const hasItems = recentProducts.length > 0;

  return (
    <section
      aria-labelledby={sectionTitleId}
      className={`
        relative w-full transition-[opacity,transform] duration-200 ease-out will-change-[opacity,transform]
        ${hasItems ? "my-8 opacity-100 visible" : "opacity-0 invisible pointer-events-none hidden"}
      `}
    >
      <div className="flex items-center justify-between">
        <h2 id={sectionTitleId} className="text-xl font-semibold tracking-tight">
          Recently Viewed
        </h2>
      </div>

      <div className="sr-only" aria-live="polite">
        {hasItems
          ? `You have ${recentProducts.length} recently viewed items.`
          : "No recently viewed products."}
      </div>

      <div
        role="region"
        aria-label="Recently viewed products carousel"
        tabIndex={0}
        className="
          flex gap-3 sm:gap-4 overflow-x-auto py-4
          scrollbar-hide snap-x snap-mandatory
          focus:outline-none focus:ring-1 focus:ring-primary/40 rounded-2xl"
      >
        {recentProducts.map((p, index) => (
          <ProductCard key={p.id} product={p} priority={index < 4} />
        ))}
      </div>
    </section>
  );
}