import { Product, Rates } from "@/types/catalog";

type PriceResult = {
  price: number;
  basePrice: number;
  making: number;
  gst: number;
};

export function calculatePrice({
  product,
  rates,
}: {
  product: Product;
  rates?: Rates;
}): PriceResult | null {

  
  // ⛔ Guard: rates not ready
  if (!rates) return null;
  
  let productRate: number = 0;
  
  switch (product.purity) {    
    case 'gold24K':
      productRate = rates.gold24K;
      break;    
    case 'gold22K':
      productRate = rates.gold22K;
      break;    
    case 'gold18K':
      productRate = rates.gold18K;
      break;    
    default:      
      productRate = rates.silver;
  }

  
  if (!productRate) return null;
  

  const basePrice = product.weight * productRate;
  const making = (basePrice * product.makingCharges) / 100;
  const subtotal = basePrice + making;
  const gst = subtotal * 0.03;

  return {
    basePrice: Math.round(basePrice),
    making: Math.round(making),
    gst: Math.round(gst),
    price: Math.round(subtotal + gst),
  };
}
