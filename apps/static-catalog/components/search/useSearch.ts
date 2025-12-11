import MiniSearch from "minisearch";
import queryMap from "@/data/query-map.json";
import {Product} from "@/types/catalog"
import { SearchFilters } from "@/types/catalog";

export function useSearch(searchIndex: MiniSearch<Product> | null, query: string, filters: SearchFilters, sortBy: string) {
  
    const normalizeQuery = (userQuery: string) => {
    const terms = userQuery.toLowerCase().split(/\s+/).map(t => queryMap[t] || t);
    return terms.join(" ");
  };

  const results = () => {
    if (!searchIndex) return [];
    let items: Product[] = [];
    if (query.trim()) {
      const correctedQuery = normalizeQuery(query);
      const res = searchIndex.search(correctedQuery, { prefix: true, fuzzy: 0.2 });
      items = res.map(r => ({
                id: r.id as number,
                name: r.name as string,
                weight: r.weight as number,
                purity: r.purity as string,
                images: r.images as string[],
                category: r.category as string,
                slug: r.slug as string,
                for: r.for as string,
                type: r.type as string[],
                newArrival: r.newArrival as boolean,
                highlights: ["", ""],
                keywords: ""
            }));
    }

    // Apply filters
    if (filters.minWeight) items = items.filter(p => p.weight >= filters.minWeight!);
    if (filters.maxWeight) items = items.filter(p => p.weight <= filters.maxWeight!);
    if (filters.forWhom) items = items.filter(p => p.for === filters.forWhom);

    // Apply sorting
    switch(sortBy) {
      case "name-asc": items.sort((a,b) => a.name.localeCompare(b.name)); break;
      case "name-desc": items.sort((a,b) => b.name.localeCompare(a.name)); break;
      case "weight-asc": items.sort((a,b) => a.weight - b.weight); break;
      case "weight-desc": items.sort((a,b) => b.weight - a.weight); break;
    }

    return items;
  }

  return results();
}
