"use client";

import { useMemo, useState } from "react";
import type { Product, SearchFilters } from "@/types/catalog";
import FilterNSort from "@/components/common/FilterNSort";
import ProductCard from "@/components/product/ProductCard";

interface JewelryTypeClientProps {
  products: Product[];
  pFilters?: SearchFilters;
}

const PRODUCTS_PER_PAGE = 20; // Show 20 products per page to reduce initial HTML size

export default function JewelryTypeClient({ products, pFilters }: JewelryTypeClientProps) {
  const [filters, setFilters] = useState<SearchFilters>(pFilters ||  { material: "Silver" });
  const [sortBy, setSortBy] = useState("best-match");
  const [currentPage, setCurrentPage] = useState(1);

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

  // Reset to page 1 when filters change
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return visibleProducts.slice(startIdx, startIdx + PRODUCTS_PER_PAGE);
  }, [visibleProducts, currentPage]);

  const totalPages = Math.ceil(visibleProducts.length / PRODUCTS_PER_PAGE);

  // Reset to page 1 when filter/sort changes
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
        {/* Screen-reader and visually friendly result count */}
        <div
          role="status"
          aria-live="polite"
          className="text-sm font-medium text-muted-foreground"
        >
          {visibleProducts.length}{" "}
          {visibleProducts.length === 1 ? "product found" : "products found"}
          {totalPages > 1 && ` • Showing page ${currentPage} of ${totalPages}`}
        </div>

        {/* Filter and Sort controls */}
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
                  priority={idx < 4 && currentPage === 1} // ✅ Critical LCP boost for first-row images on page 1
                />
              </li>
            ))}
          </ul>

          {/* Pagination Controls - Responsive */}
          {totalPages > 1 && (
            <nav 
              aria-label="Product pagination" 
              className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 mt-8 py-4 sm:py-6 px-2"
            >
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 whitespace-nowrap"
                aria-label="Previous page"
              >
                ← <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Mobile: Page Info Only */}
              <div className="flex sm:hidden items-center justify-center px-2 py-1 text-xs text-muted-foreground whitespace-nowrap">
                {currentPage} of {totalPages}
              </div>

              {/* Tablet & Desktop: Page Numbers */}
              <div className="hidden sm:flex gap-1">
                {/* Generate page numbers to show */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // On desktop (md+): show all pages
                    // On tablet (sm-md): show current ± 1
                    if (totalPages <= 10) return true; // Show all if 10 or fewer
                    if (page === 1 || page === totalPages) return true; // Always show first/last
                    return Math.abs(page - currentPage) <= 1; // Show current ± 1
                  })
                  .reduce((acc: number[], page, idx, arr) => {
                    // Add ellipsis if there's a gap
                    if (idx > 0 && arr[idx - 1] && page - arr[idx - 1] > 1) {
                      acc.push(-1); // Use -1 as ellipsis placeholder
                    }
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((page, idx) =>
                    page === -1 ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-1 py-1 text-muted-foreground"
                        aria-hidden="true"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm rounded-lg border transition-colors ${
                          currentPage === page
                            ? "bg-primary text-white border-primary"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                        aria-label={`Go to page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    )
                  )}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 whitespace-nowrap"
                aria-label="Next page"
              >
                <span className="hidden sm:inline">Next</span> →
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}