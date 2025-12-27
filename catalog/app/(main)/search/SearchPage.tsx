"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MiniSearch from "minisearch";
import ProductCard from "@/components/product/ProductCard";
import { SearchFilters } from "@/types/catalog";
import SearchBar from "@/search/SearchBar";
import { useSearch } from "@/search/useSearch";
import { miniSearchIndexOptions } from "@/search/shared";
import Breadcrumb from "@/components/navbar/BreadcrumbItem";
import FilterNSort from "@/components/common/FilterNSort";

export default function JewelrySearch() {
  const searchParams = useSearchParams();
  const rawQuery = decodeURIComponent(searchParams.get("q") || "");
  const initialQuery = rawQuery.replace(/^web\+ssj:(\/\/)?/i, "");

  // 🔹 Typing state
  const [inputQuery, setInputQuery] = useState(initialQuery);

  // 🔹 Submitted (actual search) state
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);

  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState("best-match");
  const [searchIndex, setSearchIndex] = useState<MiniSearch<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ----------------------------
     Load MiniSearch index
  ----------------------------- */
  useEffect(() => {
    let cancelled = false;

    async function loadIndex() {
      setIsLoading(true);
      const res = await fetch("/data/search-index.json");
      const indexJSON = await res.text();
      if (cancelled) return;

      setSearchIndex(
        MiniSearch.loadJSON(indexJSON, miniSearchIndexOptions)
      );
      setIsLoading(false);
    }

    loadIndex();
    return () => { cancelled = true };
  }, []);

  /* ----------------------------
     Search runs ONLY on submit
  ----------------------------- */
  const results = useSearch(
    searchIndex,
    submittedQuery,
    filters,
    sortBy
  );

  const handleSearchSubmit = () => {
    setSubmittedQuery(inputQuery.trim());
  };

  return (
    <div className="container mx-auto">
      <Breadcrumb items={[
        { name: "Home", href: "/" },
        { name: "Search" }
      ]} />

      <SearchBar
        query={inputQuery}
        onQueryChange={setInputQuery}
        onSearch={handleSearchSubmit}
      />
      <div className="flex items-center gap-3 m-4">
        {/* LEFT: takes remaining space */}
        <div className="flex-1 font-medium truncate">
          {submittedQuery && (
            <span className="text-primary">
              {" "}
            </span>
          )}
          {results.length} products found
        </div>

        {/* RIGHT: fixed / intrinsic width */}
        <div className="shrink-0">
          <FilterNSort
            filters={filters}
            onFilterChange={(k, v) =>
              setFilters(p => ({ ...p, [k]: v }))
            }
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map(p => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      {!isLoading && results.length === 0 && (
        <div className="text-center py-20">
          No results found.
        </div>
      )}
    </div>
  );
}
