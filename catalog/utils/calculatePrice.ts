import { ProductVariant, Rates } from "@/types/catalog";


export function calculatePrice({
  purity = "gold24K",
  variant,
  rates,
}: {
  purity: string
  variant: ProductVariant;
  rates?: Rates;
}): ProductVariant | null {

  if (!rates || !variant) return null;

  let productRate: number = 0;
  switch (purity) {
    case 'gold24K': productRate = rates.gold24K; break;
    case 'gold22K': productRate = rates.gold22K; break;
    case 'gold18K': productRate = rates.gold18K; break;
    default: productRate = rates.silver;
  }

  if (!productRate) return null;
  if (!variant.makingCharges && variant.makingCharges < 0)
    return null;



  const basePrice = (variant.weight || 0) * productRate;
  const making = (basePrice * (variant.makingCharges || 0)) / 100;
  const subtotal = basePrice + making;
  const gst = subtotal * 0.03;

  const mrp = Math.round(subtotal + gst);

  const hikedPrice: number = (variant.discount && variant.discount > 0) ?
    mrp / (1 - (variant.discount / 100))
    :
    mrp;
  const finalPrice = Math.round(mrp);

  // Return the updated object
  return {
    ...variant,
    price: finalPrice,
    MRP: Math.round(hikedPrice)
  };
}