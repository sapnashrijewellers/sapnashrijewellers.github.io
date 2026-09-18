'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, useCallback } from 'react';
import MiniSearch from 'minisearch';
import ProductCard from '@/components/product/ProductCard';
import Breadcrumb from '@/components/navbar/BreadcrumbItem';
import { miniSearchIndexOptions, miniSearchQueryOptions } from '@/utils/search/shared';
import type { Product, SearchFilters } from '@/types/catalog';
import FilterNSort from '@/components/common/FilterNSort';
import rawQueryMap from '@/data/queryMap.json';

export default function JewelrySearch() {
  const searchParams = useSearchParams();
  const queryMap: Record<string, string> = rawQueryMap;

  const query = useMemo(() => {
    const raw = decodeURIComponent(searchParams.get('q') || '');
    return raw.replace(/^web\+ssj:(\/\/)?/i, '').trim();
  }, [searchParams]);

  const [filters, setFilters] = useState<SearchFilters>({ material: 'Silver' });
  const [sortBy, setSortBy] = useState('best-match');

  const [products, setProducts] = useState<Product[]>([]);
  const [searchIndex, setSearchIndex] = useState<MiniSearch | null>(null);
  const [loading, setLoading] = useState(true);

  const normalizeQuery = useCallback(
    (q: string) =>
      q
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .map((t) => queryMap[t] || t)
        .join(' '),
    [queryMap],
  );

  /* -----------------------------------------
      Fetch Search Index & Catalog Data
  ------------------------------------------ */
  useEffect(() => {
    let cancelled = false;

    async function loadAll() {
      try {
        setLoading(true);

        const [indexRes, productRes] = await Promise.all([
          fetch('/data/search-index.json'),
          fetch('/data/products.json'),
        ]);

        const indexJSON = await indexRes.text();
        const productJSON = await productRes.json();

        if (cancelled) return;

        setSearchIndex(MiniSearch.loadJSON(indexJSON, miniSearchIndexOptions));
        setProducts(productJSON ?? []);
      } catch (e) {
        console.error('Failed to load search index:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, []);

  /* -----------------------------------------
      Execute Search Query (Derived with useMemo)
  ------------------------------------------ */
  const results = useMemo(() => {
    if (!searchIndex || !query) {
      return [];
    }

    const cleaned = normalizeQuery(query);
    const r = searchIndex.search(cleaned, miniSearchQueryOptions);

    return r.map((x) => ({
      id: x.id,
      score: x.score,
    }));
  }, [query, searchIndex, normalizeQuery]);

  /* -----------------------------------------
      Hydrate Search Results
  ------------------------------------------ */
  const hydratedProducts = useMemo(() => {
    if (!results.length) return [];

    const map = new Map(products.map((p) => [p.id, p]));

    return results.map((r) => map.get(r.id)).filter((p): p is Product => Boolean(p));
  }, [results, products]);

  /* -----------------------------------------
      Filter & Sort Applied Products
  ------------------------------------------ */
  const filteredProducts = useMemo(() => {
    let items = [...hydratedProducts];

    // Filter by criteria
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
      items = items.filter((p) => p.metal?.toLowerCase().startsWith(filters.material!.toLowerCase()));
    }

    // Apply Sorting
    switch (sortBy) {
      case 'name-asc':
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        items.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      default:
        // Default keep MiniSearch relevance order, placing available products first
        items.sort((a, b) => {
          if (a.available && !b.available) return -1;
          if (!a.available && b.available) return 1;
          return 0;
        });
        break;
    }

    return items;
  }, [hydratedProducts, filters, sortBy]);

  return (
    <main className="container mx-auto max-w-7xl px-4 py-4">
      {/* 1. Breadcrumb Navigation */}
      <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Search' }]} />

      {/* 2. Header & Controls */}
      <header className="my-6">
        <h2 className="sr-only">Jewellery Search Results</h2>

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Accessible Live Counter */}
          <div
            role="status"
            aria-live="polite"
            className="text-muted-foreground truncate text-sm font-medium md:text-base"
          >
            {loading ? (
              <span className="opacity-70">Searching…</span>
            ) : query ? (
              <span>
                <strong className="text-foreground font-semibold">{filteredProducts.length}</strong> result(s) for
                &ldquo;{query}&rdquo;
              </span>
            ) : (
              <span>Enter a search term to find jewellery...</span>
            )}
          </div>

          {/* Filter & Sort Bar */}
          <div className="ml-auto flex justify-end">
            <FilterNSort
              filters={filters}
              onFilterChange={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>
      </header>

      {/* 3. Skeleton Loading State */}
      {loading && (
        <section aria-label="Loading search results" className="my-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-surface border-theme/40 aspect-square animate-pulse rounded-2xl border" />
            ))}
          </div>
        </section>
      )}

      {/* 4. Results Grid */}
      {!loading && query && filteredProducts.length > 0 && (
        <section aria-label="Search results product listing" className="my-8">
          <ul
            role="list"
            aria-label="Jewellery search results"
            className="grid list-none grid-cols-2 gap-4 p-0 sm:grid-cols-3 md:gap-6 lg:grid-cols-4"
          >
            {filteredProducts.map((p, idx) => (
              <li key={p.id} className="flex justify-stretch">
                <ProductCard
                  product={p}
                  priority={idx < 4} // ✅ Fast LCP boost for first-row images
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 5. Empty State (Query found no matching products) */}
      {!loading && query && filteredProducts.length === 0 && (
        <div
          role="status"
          aria-live="polite"
          className="bg-surface/50 border-theme mx-auto my-16 max-w-2xl rounded-2xl border border-dashed px-4 py-16 text-center"
        >
          <p className="text-foreground mb-2 text-lg font-medium">No Results Found</p>
          <p className="text-muted-foreground text-sm">Please check the spelling or try other keywords and filters.</p>
        </div>
      )}

      {/* 6. Initial State (Prompt to search) */}
      {!loading && !query && (
        <div className="text-muted-foreground my-16 px-4 py-20 text-center">
          <p className="text-lg">Please enter a search term to find jewellery...</p>
        </div>
      )}
    </main>
  );
}
