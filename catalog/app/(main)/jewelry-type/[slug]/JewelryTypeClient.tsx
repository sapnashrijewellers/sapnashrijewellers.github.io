"use client";

import { useMemo, useState } from "react";
import type { Product, SearchFilters } from "@/types/catalog";
import FilterNSort from "@/components/common/FilterNSort";
import ProductCard from "@/components/product/ProductCard";

interface JewelryTypeClientProps {
  products: Product[];
}

export default function JewelryTypeClient({ products }: JewelryTypeClientProps) {
  const [filters, setFilters] = useState<SearchFilters>({ material: "Silver" });
  const [sortBy, setSortBy] = useState("best-match");

  const visibleProducts = useMemo(() => {    
    let items = products

    // 2. Multi-criteria filtering
    if (filters.minPrice !== undefined) {
      items = items.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      items = items.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.forWhom) {
      items = items.filter((p) => p.for === filters.forWhom);
    }
    if (filters.material) {
      items = items.filter((p) =>
        p.purity?.toLowerCase().startsWith(filters.material!.toLowerCase())
      );
    }

    // 3. Sorting logic
    switch (sortBy) {
      case "name-asc":
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        items.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        items.sort((a, b) => b.price - a.price);
        break;
      default:
        // Prioritize available products in default/best-match view
        items.sort((a, b) => {
          if (a.available && !b.available) return -1;
          if (!a.available && b.available) return 1;
          return 0;
        });
        break;
    }

    return items;
  }, [products, filters, sortBy]);

  return (
    <section aria-label="Product Catalog Filter and Grid" className="w-full">
      {/* Filter and Live Counter Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1">
        {/* Screen-reader and visually friendly result count */}
        <div
          role="status"
          aria-live="polite"
          className="text-sm font-medium text-muted-foreground"
        >
          {visibleProducts.length}{" "}
          {visibleProducts.length === 1 ? "उत्पाद मिला" : "उत्पाद उपलब्ध"}
        </div>

        {/* Filter and Sort controls */}
        <div className="flex justify-end ml-auto">
          <FilterNSort
            filters={filters}
            onFilterChange={(key, val) =>
              setFilters((prev) => ({ ...prev, [key]: val }))
            }
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </div>

      {/* Catalog Grid vs Empty State */}
      {visibleProducts.length === 0 ? (
        <div
          role="status"
          aria-live="polite"
          className="py-16 text-center text-muted-foreground text-lg bg-surface/40 rounded-2xl border border-dashed border-theme"
        >
          <p>चुने गए फ़िल्टर के अनुसार इस श्रेणी में कोई उत्पाद उपलब्ध नहीं है।</p>
        </div>
      ) : (
        <ul
          role="list"
          aria-label="Filtered Jewelry Products"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 list-none p-0"
        >
          {visibleProducts.map((p, idx) => (
            <li key={p.id || p.slug || idx} className="flex justify-stretch">
              <ProductCard
                product={p}
                priority={idx < 4} // ✅ Critical LCP boost for first-row images
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}