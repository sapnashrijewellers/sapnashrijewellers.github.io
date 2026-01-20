"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import MiniSearch from "minisearch";
import ProductCard from "@/components/product/ProductCard";
import Breadcrumb from "@/components/navbar/BreadcrumbItem";
import { miniSearchIndexOptions, miniSearchQueryOptions } from "@/search/shared";
import { Product } from "@/types/catalog";
import FilterNSort from "@/components/common/FilterNSort";
import { SearchFilters } from "@/types/catalog";
import rawQueryMap from "@/data/queryMap.json";

export default function JewelrySearch() {
  const searchParams = useSearchParams();
  const queryMap: Record<string, string> = rawQueryMap;

  const query = useMemo(() => {
    const raw = decodeURIComponent(searchParams.get("q") || "");
    return raw.replace(/^web\+ssj:(\/\/)?/i, "").trim();
  }, [searchParams]);

  const [filters, setFilters] = useState<SearchFilters>({ material: "Silver" });
  const [sortBy, setSortBy] = useState("best-match");

  const [products, setProducts] = useState<Product[]>([]);
  const [searchIndex, setSearchIndex] = useState<MiniSearch | null>(null);
  const [results, setResults] = useState<{ id: number; score: number }[]>([]);
  const [loading, setLoading] = useState(true);


  const normalizeQuery = (q: string) =>
    q
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .map(t => queryMap[t] || t)
      .join(" ");

  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      try {
        setLoading(true);

        const [indexRes, productRes] = await Promise.all([
          fetch("/data/search-index.json"),
          fetch("/data/products.json"),
        ]);

        const indexJSON = await indexRes.text();
        const productJSON = await productRes.json();

        if (cancelled) return;

        setSearchIndex(MiniSearch.loadJSON(indexJSON, miniSearchIndexOptions));
        setProducts(productJSON ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    return () => { cancelled = true; };
  }, []);



  /* -----------------------------------------
   Run search
  ------------------------------------------ */
  useEffect(() => {
    if (!searchIndex || !query) {
      setResults([]);
      return;
    }

    const cleaned = normalizeQuery(query);

    const r = searchIndex.search(cleaned, miniSearchQueryOptions);

    setResults(
      r.map(x => ({
        id: x.id,
        score: x.score,
      }))
    );
  }, [query, searchIndex]);

  /* -----------------------------------------
   Hydrate services from search results
  ------------------------------------------ */
  const hydratedProducts = useMemo(() => {
    if (!results.length) return [];

    const map = new Map(products.map(p => [p.id, p]));

    return results
      .map(r => map.get(r.id))
      .filter((p): p is Product => Boolean(p));
  }, [results, products]);

  const filteredProducts = useMemo(() => {
    let items = [...hydratedProducts]; // clone

    const minWeight = filters.minWeight;
    if (minWeight !== undefined) {
      items = items.filter(p => p.weight >= minWeight);
    }

    const maxWeight = filters.maxWeight;
    if (maxWeight !== undefined) {
      items = items.filter(p => p.weight <= maxWeight);
    }
    if (filters.forWhom) items = items.filter(p => p.for === filters.forWhom);
    if (filters.material) items = items.filter(p => p.purity.startsWith(filters.material.toLowerCase()));
    items = items.filter(p => p.active);

    switch (sortBy) {
      case "name-asc": items.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-desc": items.sort((a, b) => b.name.localeCompare(a.name)); break;
      case "weight-asc": items.sort((a, b) => a.weight - b.weight); break;
      case "weight-desc": items.sort((a, b) => b.weight - a.weight); break;
      // best-match = keep MiniSearch order
    }

    return items;
  }, [hydratedProducts, filters, sortBy]);

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
          {loading
            ? <span className="opacity-60">Searching…</span>
            : <span>{hydratedProducts.length} products found</span>
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
      {loading && (
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
      {!loading && query && filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(p => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && query && filteredProducts.length === 0 && (
        <div className="text-center py-20 opacity-70">
          No results found.
        </div>
      )}

      {!loading && !query && (
        <div className="py-20 text-center opacity-60">
          Start typing to search jewellery…
        </div>
      )}
    </div>
  );
}
