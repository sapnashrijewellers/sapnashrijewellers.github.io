import MiniSearch from "minisearch";
import rawQueryMap from "@/data/queryMap.json";
import { Product, SearchFilters } from "@/types/catalog";

const queryMap: Record<string, string> = rawQueryMap;

const normalizeQuery = (q: string) =>
  q
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map(t => queryMap[t] || t)
    .join(" ");

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
    items = Object.values(
      (searchIndex as any)._documents
    ) as Product[];
  } else {
    const results = searchIndex.search(cleanedQuery, {
      prefix: true,
      fuzzy: 0.2,
      boost: {
        name: 5,
        highlights: 3.5,
        englishHighlights: 3,
        category: 2.5,
        keywords: 2.5,
        metaDescription: 2,
        type: 1.3,
        for: 1.2,
        purity: 1.1
      }
    });

    items = results.map(r =>
      searchIndex.getDocument(r.id) as Product
    );
  }

  // Filters
  if (filters.minWeight) items = items.filter(p => p.weight >= filters.minWeight!);
  if (filters.maxWeight) items = items.filter(p => p.weight <= filters.maxWeight!);
  if (filters.forWhom) items = items.filter(p => p.for === filters.forWhom);

  // Sorting
  switch (sortBy) {
    case "name-asc": items.sort((a, b) => a.name.localeCompare(b.name)); break;
    case "name-desc": items.sort((a, b) => b.name.localeCompare(a.name)); break;
    case "weight-asc": items.sort((a, b) => a.weight - b.weight); break;
    case "weight-desc": items.sort((a, b) => b.weight - a.weight); break;
  }

  return items;
}
