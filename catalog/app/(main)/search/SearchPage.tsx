"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import MiniSearch from "minisearch";

import ProductCard from "@/components/product/ProductCard";
import Breadcrumb from "@/components/navbar/BreadcrumbItem";
import FilterNSort from "@/components/common/FilterNSort";

import { SearchFilters } from "@/types/catalog";
import { miniSearchIndexOptions } from "@/search/shared";
import { useSearch } from "@/search/useSearch";

export default function JewelrySearch() {
  const searchParams = useSearchParams();

  /* ----------------------------
     Query (URL = truth)
  ----------------------------- */
  const query = useMemo(() => {
    const raw = decodeURIComponent(searchParams.get("q") || "");
    return raw.replace(/^web\+ssj:(\/\/)?/i, "").trim();
  }, [searchParams]);

  /* ----------------------------
     State
  ----------------------------- */
  const [filters, setFilters] = useState<SearchFilters>({ material: "Silver" });
  const [sortBy, setSortBy] = useState("best-match");

  const [searchIndex, setSearchIndex] = useState<MiniSearch<any> | null>(null);
  const [isIndexLoading, setIsIndexLoading] = useState(true);

  /* ----------------------------
     Load index
  ----------------------------- */
  useEffect(() => {
    let cancelled = false;

    async function loadIndex() {
      setIsIndexLoading(true);
      const res = await fetch("/data/search-index.json");
      const json = await res.text();
      if (cancelled) return;

      setSearchIndex(
        MiniSearch.loadJSON(json, miniSearchIndexOptions)
      );
      setIsIndexLoading(false);
    }

    loadIndex();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ----------------------------
     Search (sync, derived)
  ----------------------------- */
  const results = useSearch(
    searchIndex,
    query,
    filters,
    sortBy
  );

  const isSearching = isIndexLoading || !searchIndex;

  /* ----------------------------
     Render
  ----------------------------- */
  return (
    <div className="container mx-auto">
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: "Search" }
        ]}
      />

      <div className="flex items-center gap-3 m-4">
        <div className="flex-1 font-medium truncate">
          {isSearching
            ? <span className="opacity-60">Searching…</span>
            : <span>{results.length} products found</span>
          }
        </div>

        <FilterNSort
          filters={filters}
          onFilterChange={(k, v) =>
            setFilters(p => ({ ...p, [k]: v }))
          }
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      {/* Skeleton */}
      {isSearching && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-lg bg-surface animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Results */}
      {!isSearching && results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map(p => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isSearching && results.length === 0 && (
        <div className="text-center py-20 opacity-70">
          No results found.
        </div>
      )}
    </div>
  );
}
