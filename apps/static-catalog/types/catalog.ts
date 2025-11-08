// /types/catalog.ts

/** Represents a single jewelry product item */
export interface Product {
  id: number;
  name: string;
  weight: number;
  purity: string;
  images: string[];
  highlights: string[];
  newArrival: boolean;
  sub_category: string;
}



/** Represents categorized product data keyed by category name */
export type CategorizedProducts = Record<string, Product[]>;


/** Root data structure for data.json */
export interface CatalogData {
  categorizedProducts: CategorizedProducts;  
  ticker?: string[];
  sub_categories: string[];
}
export interface Rates {
  asOn: Date;
  gold24K: number;
  gold22K: number;
  gold18K: number;
  silver: number;
  silverJewelry: number;
}
