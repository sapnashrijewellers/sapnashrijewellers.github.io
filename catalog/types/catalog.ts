import { LucideIcon } from "lucide-react";

/** Represents a single jewelry product item */
export interface Product {
  id: number;
  name: string;
  weight: number;
  purity: string;
  images: string[];
  highlights: string[];
  englishHighlights: string[];
  newArrival: boolean;
  category: string;
  type: string[];
  for: string;
  keywords: string;
  slug: string;
  active: boolean;
  metaDescription: string;
  makingCharges: number;
  gst: number;
  available?:boolean;
}

export interface Category {
  name: string;
  category: string,
  rank: number,
  slug: string,
  keywords: string,
  marketingText: string,  
  active: boolean
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
  subtitle1?: string;  
  icon?: LucideIcon | string; // JSON uses string
  textColor?: string;  
  gradientFrom?: string;
  gradientTo?: string;  
  link: string;
  fontFamily: string;
  bgImage: string;
  rank: number;
  active: boolean;  
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

export interface Type {
  type: string,
  rank: number,
  slug: string,
  keywords: string,
  metaDescription: string,
  icon: string,
  active: boolean
}
