export interface Product {
  id: number;
  name: string;
  metal: string;
  images: string[];
  highlights: string[];
  newArrival: boolean;
  category: string;
  type: string[];
  for: string;  
  active: boolean;
  description: string;
  available?: boolean;
  rating: number;
  ratingCount: number;
  brandText: string;
  HUID: boolean;
  weight: number;
  makingCharges: number;
  discount: number;
  price: number;
  MRP: number;
}

export interface Category {
  id: number;
  name: string;
  title: string,
  rank: number,  
  description: string,
  active: boolean
  material:string
}

export interface SearchFilters {
  material: string;
  minPrice?: number;
  maxPrice?: number;
  forWhom?: string;
}

export interface BannerItem {
  id: string;
  link: string;
  bannerImage: string;
  rank: number;
  active: boolean;
}
export interface Rates {
  gold: number;
  silver: number;
}

export interface Type {
  id: number,
  type: string,
  rank: number,  
  description: string,
  icon: string,
  icon1: string,
  active: boolean
}

export type CartItem = {
  productId: number;
  product: Product
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
  cod: number
}

export type PaymentMethod = "UPI" | "COD";

export type OrderStatus =
  | "CREATED"
  | "CONFIRMED"
  | "CANCELLED";

export type Order = {
  orderId: string;
  userId: string;

  items: Array<{
    productId: number;    
    title: string;
    qty: number;
  }>;

  address: Address;

  payment: {
    method: PaymentMethod;
    reference: string;          // REQUIRED
  };

  priceSummary: PriceSummaryType;

  createdAt: number;
};
