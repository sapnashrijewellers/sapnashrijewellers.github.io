import { LucideIcon } from "lucide-react";

/** Represents a single jewelry product item */
export interface Product {
  id: number;
  name: string;
  weight: number;
  purity: string;
  images: string[];
  highlights: string[];
  newArrival: boolean;
  category: string;
  type: string[],
  for: string,
  keywords: string,
  slug: string  
}

export interface Category {
  name: string;
  category: string,
  rank: number,
  slug: string,
  keywords: string,
  marketing_text: string
}

export interface SearchFilters {    
    minWeight?: number;
    maxWeight?: number;
    forWhom?: string;
}

export interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon | string; // JSON uses string
  textColor?: string;
  bgType: "solid" | "gradient" | "dual";
  bgColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  dualLeft?: string;
  dualRight?: string;
  link: string;
}

/** Represents categorized product data keyed by category name */
export type CategorizedProducts = Record<string, Product[]>;


/** Root data structure for data.json */
export interface CatalogData {
  categorizedProducts: CategorizedProducts;
  ticker?: string[];
  sub_categories: string[];
}

export interface NewCatalog {
  products: Product[];
  ticker?: string[];
  categories: Category[];
}
export interface Rates {
  asOn: Date;
  gold24K: number;
  gold22K: number;
  gold18K: number;
  silver: number;
  silverJewelry: number;
}
