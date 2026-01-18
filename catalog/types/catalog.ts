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
  description: string;
  makingCharges: number;  
  available?: boolean;
  rating: number;
  ratingCount: number;
  brandText:string;
  size:string;
  hindiName:string;
}

export interface Category {
  name: string;
  englishName: string,
  rank: number,
  slug: string,
  keywords: string,
  description: string,
  active: boolean
}

export interface SearchFilters {
  material: string;
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
  description: string,
  icon: string,
  active: boolean
}

export interface CalculatorForm {
  purity: string;
  weight: number;
  makingCharges: number | ""; // ← key fix
  gst: number;
}

export interface CalcRates {
  gold24K: number;
  gold22K: number;
  gold18K: number;
  silver: number;
  silverJewellery: number;
}
type NavItem = {
  label: string;
  href: string;
  title: string;
  icon: React.ReactNode;
};

type Review = {
  rating: number;
  review: string;
  createdAt: Date;
  productId: number;
  status: string;
}
