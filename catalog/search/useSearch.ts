// import MiniSearch from "minisearch";
// import rawQueryMap from "@/data/queryMap.json";
// import { Product, SearchFilters } from "@/types/catalog";
// import { miniSearchQueryOptions } from "@/search/shared";

// const queryMap: Record<string, string> = rawQueryMap;

// const normalizeQuery = (q: unknown): string => {
//   if (typeof q !== "string") return "";

//   return q
//     .toLowerCase()
//     .trim()
//     .split(/\s+/)
//     .map(t => queryMap[t] || t)
//     .join(" ");
// };

// export function useSearch(
//   searchIndex: MiniSearch<Product> | null,
//   rawQuery: string,
//   filters: SearchFilters,
//   sortBy: string
// ) {
//   if (!searchIndex) return [];

//   const cleanedQuery = normalizeQuery(rawQuery);
//   let items: Product[];

  
//     const results = searchIndex.search(
//       cleanedQuery,
//       miniSearchQueryOptions
//     );

    
  

//   /* filters */
//   if (filters.minWeight) items = items.filter(p => p.weight >= filters.minWeight!);
//   if (filters.maxWeight) items = items.filter(p => p.weight <= filters.maxWeight!);
//   if (filters.forWhom) items = items.filter(p => p.for === filters.forWhom);
//   if (filters.material) items = items.filter(p => p.purity.startsWith(filters.material.toLowerCase()));

//   /* sorting */
//   switch (sortBy) {
//     case "name-asc": items.sort((a, b) => a.name.localeCompare(b.name)); break;
//     case "name-desc": items.sort((a, b) => b.name.localeCompare(a.name)); break;
//     case "weight-asc": items.sort((a, b) => a.weight - b.weight); break;
//     case "weight-desc": items.sort((a, b) => b.weight - a.weight); break;
//   }
//   items = items.filter(
//     p => p.active    
//   );
//   return items;
// }
