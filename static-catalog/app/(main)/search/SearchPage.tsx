"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MiniSearch from "minisearch";
import ProductCard from "@/components/ProductCard";
import { Product, SearchFilters } from "@/types/catalog";
import SearchBar from "@/components/search/SearchBar";
import { useSearch } from "@/components/search/useSearch";

export default function JewelrySearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initial query from URL
  const initialUrlQuery = decodeURIComponent(searchParams.get("q") || "").trim();
  const [query, setQuery] = useState(initialUrlQuery);

  // Filters + Sorting
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState("best-match");

  // Search index loading
  const [searchIndex, setSearchIndex] = useState<MiniSearch<Product> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync query whenever URL changes
  useEffect(() => {
    const q = decodeURIComponent(searchParams.get("q") || "").trim();
    setQuery(q);
  }, [searchParams]);

  // Update URL → Search query
  const handleQueryChange = (value: string) => {
    const cleaned = value.trim();
    setQuery(cleaned);

    router.replace(`/search?q=${encodeURIComponent(cleaned)}`);
  };

  // Load search index JSON
  useEffect(() => {
    async function loadIndex() {
      try {
        setIsLoading(true);

        const response = await fetch("/data/search-index.json");
        const indexString = await response.text();

        const mini = MiniSearch.loadJSON<Product>(indexString, {
          fields: ["name", "keywords", "type", "category", "for", "purity", "highlights"],
        });

        setSearchIndex(mini);
      } finally {
        setIsLoading(false);
      }
    }

    loadIndex();
  }, []);

  // Memoized search results
  const results = useSearch(searchIndex, query, filters, sortBy);

  // ------------------------------------------------------
  // RENDER
  // ------------------------------------------------------
  return (
    <div className="">
      <div className="container mx-auto">

        {/* CENTERED Search Bar */}
        <div className="flex justify-center">
          <div className="w-full ">
            <SearchBar
              query={query}
              onQueryChange={handleQueryChange}
              onMicClick={() => console.log("mic clicked")}
              filters={filters}
              onFilterChange={(key, val) =>
                setFilters(prev => ({ ...prev, [key]: val }))
              }
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>

        {/* Results Summary */}
        <div className="m-4 text-normal font-medium">
          {query && <span className="text-primary">Search: “{query}” — </span>}
          {results.length} products found
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && results.length === 0 && (
          <div className="text-center py-20 text-normal">
            No results found.
          </div>
        )}
      </div>
    </div>
  );
}
