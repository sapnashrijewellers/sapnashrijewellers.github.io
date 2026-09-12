"use client";

import { useState, useId, useMemo } from "react";
import CollectionCard from "./CollectionCard";
import type { Collection, Product } from "@/types/catalog";

type Material = "Gold" | "Silver";

interface SignatureCollectionsProps {
  collections: Collection[];
  products: Product[];
  className?: string;
}

const MATERIALS: readonly Material[] = ["Silver", "Gold"] as const;

export default function SignatureCollections({
  collections,
  products,
  className = "",
}: SignatureCollectionsProps) {
  const [material, setMaterial] = useState<Material>("Silver");
  const sectionTitleId = useId();

  // Filter active categories for the selected metal type
  const filteredCategories = useMemo(() => {
    return collections
      .filter((c) => c.active && c.material === material)
      .sort((a, b) => a.rank - b.rank);
  }, [collections, material]);

  // Pre-group products by collection name for O(1) grid lookups
  const productsByCollection = useMemo(() => {
    const map = new Map<string, Product[]>();
    products.forEach((p) => {
      if (!p.collection) return;
      const list = map.get(p.collection) || [];
      list.push(p);
      map.set(p.collection, list);
    });
    return map;
  }, [products]);

  const visibleCategories = useMemo(() => {
    return filteredCategories.filter((cat) => {
      const items = productsByCollection.get(cat.name);
      return items && items.length > 0;
    });
  }, [filteredCategories, productsByCollection]);

  return (
    <section
      id="shop-by-collection"
      aria-labelledby={sectionTitleId}
      className={`relative w-full my-8 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center px-4 mb-6">
        <h2
          id={sectionTitleId}
          className="au-h2 text-2xl sm:text-3xl font-bold text-foreground tracking-tight"
        >
          Our Signature Collections
        </h2>        
      </div>

      {/* Material Selector Toggle */}
      <div className="flex justify-center mb-8">
        <div
          role="tablist"
          aria-label="Filter signature collections by metal type"
          className="inline-flex p-1 rounded-full bg-surface border border-theme/60 shadow-sm"
        >
          {MATERIALS.map((m) => {
            const isSelected = material === m;
            const hindiLabel = m === "Gold" ? "सोना (Gold)" : "चांदी (Silver)";

            return (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`Show ${m} jewellery collections (${hindiLabel})`}
                onClick={() => setMaterial(m)}
                className={`
                  px-6 py-2 text-sm font-medium rounded-full
                  transition-[background-color,color,transform] duration-150 ease-out will-change-[transform]
                  focus:outline-none focus:ring-2 focus:ring-primary
                  ${
                    isSelected
                      ? "bg-accent text-accent-foreground font-bold shadow-sm scale-100"
                      : "text-foreground/80 hover:text-foreground hover:bg-theme/10 cursor-pointer"
                  }
                `}
              >
                {m === "Gold" ? "सोना (Gold)" : "चांदी (Silver)"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Screen Reader & Agentic Context */}
      <div className="sr-only" aria-live="polite">
        Showing {visibleCategories.length} {material} jewellery categories.
      </div>

      {/* Uniform Width Collection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 w-full items-stretch">
        {visibleCategories.map((cat, index) => {
          const collectionProducts = productsByCollection.get(cat.name) || [];

          return (
            <div key={cat.name} className="w-full flex">
              <CollectionCard
                collection={cat}
                products={collectionProducts}
                priority={index < 4}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}