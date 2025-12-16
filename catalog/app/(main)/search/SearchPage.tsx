"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MiniSearch from "minisearch";
import ProductCard from "@/components/ProductCard";
import { Product, SearchFilters } from "@/types/catalog";
import SearchBar from "@/components/search/SearchBar";
import { useSearch } from "@/components/search/useSearch";
import { miniSearchOptions } from "@/shared/searchConfig";

export default function JewelrySearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // RAW input (never trimmed)
  const [inputQuery, setInputQuery] = useState(
    decodeURIComponent(searchParams.get("q") || "")
  );

  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState("best-match");

  const [searchIndex, setSearchIndex] = useState<MiniSearch<Product> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync URL → input (NO trim)
  useEffect(() => {
    setInputQuery(decodeURIComponent(searchParams.get("q") || ""));
  }, [searchParams]);

  const handleQueryChange = (value: string) => {
    setInputQuery(value);
    router.replace(`/search?q=${encodeURIComponent(value)}`, { scroll: false });
  };

  // Load index
  useEffect(() => {
    async function loadIndex() {
      setIsLoading(true);
      const res = await fetch("/data/search-index.json");
      const json = await res.text();

      const mini = MiniSearch.loadJSON<Product>(json,miniSearchOptions);
      setSearchIndex(mini);
      setIsLoading(false);
    }
    loadIndex();
  }, []);

  const results = useSearch(searchIndex, inputQuery, filters, sortBy);

  return (
    <div className="container mx-auto">
      <SearchBar
        query={inputQuery}
        onQueryChange={handleQueryChange}
        filters={filters}
        onFilterChange={(k, v) => setFilters(p => ({ ...p, [k]: v }))}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onMicClick={()=>{}}
      />

      <div className="m-4 font-medium">
        {inputQuery && <span className="text-primary">Search: “{inputQuery}” — </span>}
        {results.length} products found
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map(p => <ProductCard key={p.id} product={p} />)}
      </div>

      {!isLoading && results.length === 0 && (
        <div className="text-center py-20">No results found.</div>
      )}
    </div>
  );
}
