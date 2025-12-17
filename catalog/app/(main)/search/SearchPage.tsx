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

export default function JewelrySearch() {
  const searchParams = useSearchParams();

  // 🔹 Read URL query ONCE
  const initialQuery = decodeURIComponent(searchParams.get("q") || "");

  // 🔹 Local, uncontrolled-by-URL input
  const [inputQuery, setInputQuery] = useState(initialQuery);

  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState("best-match");
  const [searchIndex, setSearchIndex] = useState<MiniSearch<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ----------------------------
     Load MiniSearch index ONLY
  ----------------------------- */
  useEffect(() => {
    let cancelled = false;

    async function loadIndex() {
      setIsLoading(true);

      const res = await fetch("/data/search-index.json");
      const indexJSON = await res.text();

      if (cancelled) return;

      const mini = MiniSearch.loadJSON(indexJSON, miniSearchIndexOptions);
      setSearchIndex(mini);
      setIsLoading(false);
    }

    loadIndex();
    return () => { cancelled = true };
  }, []);

  /* ----------------------------
     Search execution
  ----------------------------- */
  const results = useSearch(
    searchIndex,
    inputQuery,
    filters,
    sortBy
  );

  return (
    <div className="container mx-auto">
      <Breadcrumb items={[
        { name: "Home", href: "/" },
        { name: "Search" }
      ]} />

      <SearchBar
        query={inputQuery}
        onQueryChange={setInputQuery}   
        filters={filters}
        onFilterChange={(k, v) =>
          setFilters(p => ({ ...p, [k]: v }))
        }
        sortBy={sortBy}
        onSortChange={setSortBy}
        onMicClick={() => {}}
      />

      <div className="m-4 font-medium">
        {inputQuery && (
          <span className="text-primary">
            Search: “{inputQuery}” —{" "}
          </span>
        )}
        {results.length} products found
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
