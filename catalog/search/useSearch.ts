import MiniSearch from "minisearch";
import rawQueryMap from "@/data/queryMap.json";
import { Product, SearchFilters } from "@/types/catalog";
import { miniSearchQueryOptions } from "@/search/shared";

const queryMap: Record<string, string> = rawQueryMap;

const normalizeQuery = (q: unknown): string => {
  if (typeof q !== "string") return "";

  return q
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map(t => queryMap[t] || t)
    .join(" ");
};

export function useSearch(
  searchIndex: MiniSearch<Product> | null,
  rawQuery: string,
  filters: SearchFilters,
  sortBy: string
) {
  if (!searchIndex) return [];

  const cleanedQuery = normalizeQuery(rawQuery);
  let items: Product[];

  if (!cleanedQuery) {
    // ✅ Return full catalog
    items = [];
  } else {
    const results = searchIndex.search(
      cleanedQuery,
      miniSearchQueryOptions
    );

    items = results.map(p => ({
      id: p.id,
      name: (p.name),
      slug: p.slug,
      images: p.images,
      category: (p.category),
      purity: (p.purity),
      weight: p.weight,
      for: (p.for),
      type: p.type,
      newArrival: p.newArrival,
      highlights: [],
      englishHighlights: [],
      active: true,
      keywords: "",
      description: "",
      makingCharges: 0,
      gst: 0,
      rating: p.rating,
      ratingCount: p.ratingCount

    }));
  }

  /* filters */
  if (filters.minWeight) items = items.filter(p => p.weight >= filters.minWeight!);
  if (filters.maxWeight) items = items.filter(p => p.weight <= filters.maxWeight!);
  if (filters.forWhom) items = items.filter(p => p.for === filters.forWhom);

  /* sorting */
  switch (sortBy) {
    case "name-asc": items.sort((a, b) => a.name.localeCompare(b.name)); break;
    case "name-desc": items.sort((a, b) => b.name.localeCompare(a.name)); break;
    case "weight-asc": items.sort((a, b) => a.weight - b.weight); break;
    case "weight-desc": items.sort((a, b) => b.weight - a.weight); break;
  }
  items = items.filter(
    p => p.active
    //&& p.weight > 0
    //&& p.slug.length > 4
  );
  return items;
}
