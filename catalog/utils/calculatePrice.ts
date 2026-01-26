import { ProductVariant, Rates, Cart, PaymentMethod, PriceSummaryType } from "@/types/catalog";

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


  const adjustment = variant.priceAdjustment === undefined ? 0 : variant.priceAdjustment
  const basePrice = (variant.weight || 0) * productRate;
  const making = ((basePrice + adjustment) * (variant.makingCharges || 0)) / 100;
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

export function calculateFinal(cart: Cart, rates?: Rates) {
  // 1. Calculate the total by iterating through cart items
  const totalAmount = cart.items.reduce((accumulator, item) => {
    // Find the product data
    const productData = item.product;
    
    // Safety check: if product doesn't exist, don't add to total
    if (!productData) return accumulator;

    // 2. Calculate price for the specific variant
    const vPop = calculatePrice({ 
      purity: productData.purity, 
      variant: productData.variants[item.variantIndex], 
      rates 
    });

    // 3. Multiply by quantity and add to the running total
    // Using optional chaining and nullish coalescing to avoid NaN
    const itemTotal = (vPop?.price ?? 0) * item.qty;
    
    return accumulator + itemTotal;
  }, 0);

  // 4. Return the final sum
  return totalAmount;
}