"use client";

import { useMemo, useState } from "react";
import type { Product, SearchFilters } from "@/types/catalog";
import FilterNSort from "@/components/common/FilterNSort";
import ProductCard from "@/components/product/ProductCard";
import Pagination from "@/components/common/Pagination";

interface JewelryTypeClientProps {
  products: Product[];
  pFilters?: SearchFilters;
}

const PRODUCTS_PER_PAGE = 20; // Show 20 products per page to reduce initial HTML size

export default function JewelryTypeClient({ products, pFilters }: JewelryTypeClientProps) {
  const [filters, setFilters] = useState<SearchFilters>(pFilters || { material: "Silver" });
  const [sortBy, setSortBy] = useState("best-match");
  const [currentPage, setCurrentPage] = useState(1);

  const visibleProducts = useMemo(() => {    
    let items = products;

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
        p.metal?.toLowerCase().startsWith(filters.material!.toLowerCase())
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
        items.sort((a, b) => {
          if (a.available && !b.available) return -1;
          if (!a.available && b.available) return 1;
          return 0;
        });
        break;
    }

    return items;
  }, [products, filters, sortBy]);

  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return visibleProducts.slice(startIdx, startIdx + PRODUCTS_PER_PAGE);
  }, [visibleProducts, currentPage]);

  const totalPages = Math.ceil(visibleProducts.length / PRODUCTS_PER_PAGE);

  const handleFilterChange = (key: string, val: unknown) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const handleSortChange = (newSort: string) => {
    setCurrentPage(1);
    setSortBy(newSort);
  };

  return (
    <section aria-label="Product Catalog Filter and Grid" className="w-full">
      {/* Filter and Live Counter Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1">
        <div
          role="status"
          aria-live="polite"
          className="text-sm font-medium text-muted-foreground"
        >
          {visibleProducts.length}{" "}
          {visibleProducts.length === 1 ? "product found" : "products found"}
          {totalPages > 1 && ` • Showing page ${currentPage} of ${totalPages}`}
        </div>

        <div className="flex justify-end ml-auto">
          <FilterNSort
            filters={filters}
            onFilterChange={handleFilterChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
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
          <p>No products are available based on the selected filters.</p>
        </div>
      ) : (
        <>
          <ul
            role="list"
            aria-label="Filtered Jewelry Products"
            className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 list-none p-0"
          >
            {paginatedProducts.map((p, idx) => (
              <li key={p.id || idx} className="flex justify-stretch">
                <ProductCard
                  product={p}
                  priority={idx < 4 && currentPage === 1} // ✅ Critical LCP boost
                />
              </li>
            ))}
          </ul>

          {/* Separated Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </section>
  );
}