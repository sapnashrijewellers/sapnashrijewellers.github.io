import { LucideIcon } from "lucide-react";

/** Represents a single jewelry product item */
export interface ProductVariant {
  SKU: string;
  productId: number;
  weight: number;
  active: boolean;
  makingCharges: number;
  available?: boolean;
  size: string;
  discount: number;
  price?: number;
  MRP?: number;
  priceAdjustment?: number;
}

export interface Product {
  id: number;
  name: string;
  purity: string;
  images: string[];
  highlights: string[];
  englishHighlights: string[];
  newArrival: boolean;
  category: string;
  type: string[];
  for: string;
  slug: string;
  active: boolean;
  description: string;
  available?: boolean;
  rating: number;
  ratingCount: number;
  brandText: string;
  hindiName: string;
  HUID: boolean;
  weight: number;
  variants: ProductVariant[]
}

export interface Category {
  name: string;
  englishName: string,
  rank: number,
  slug: string,
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

export type CartItem = {
  productId: number;
  product:Product
  variantIndex: number;
  variant:string;
  qty: number;
  
};

export type Cart = {
  items: CartItem[];      
};



export class Address {
  uid!: string;
  name!: string;
  email!: string;
  mobile!: string;
  address!: string;
  city!: string;
  pin!: string;
}

export type PriceSummaryType = {
  productTotal: number,
  shipping: number,
  finalPrice: number,  
}

export type PaymentMethod = "UPI" | "COD";

// export type Cart = {
//   items: CartItem[];

//   address?: Address;

//   paymentMethod: PaymentMethod;

//   priceSummary: {
//     productTotal: number;
//     shipping: number;
//     grandTotal: number;
//   };
// };
