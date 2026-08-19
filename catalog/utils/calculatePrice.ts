import { Product, Rates, Cart, PaymentMethod, PriceSummaryType } from "@/types/catalog";

export function calculatePrice({
  product,
  rates,
}: {  
  product: Product;
  rates: Rates;
}): Product | null {

  if (!rates || !product) return null;

  const productRate: number = product.purity === "gold" ? rates.gold : rates.silver;

  if (!productRate) return null;
  if (!product.makingCharges && product.makingCharges < 0)
    return null;
  
  const basePrice = (product.weight || 0) * productRate;
  const making = ((basePrice) * (product.makingCharges || 0)) / 100;
  const subtotal = basePrice + making;
  const gst = subtotal * 0.03;

  const mrp = Math.round(subtotal + gst);

  const hikedPrice: number = (product.discount && product.discount > 0) ?
    mrp / (1 - (product.discount / 100))
    :
    mrp;
  const finalPrice = Math.round(mrp);

  // Return the updated object
  return {
    ...product,
    price: finalPrice,
    MRP: Math.round(hikedPrice)
  };
}

export function calculateFinal(cart: Cart, rates: Rates) {
  // 1. Calculate the total by iterating through cart items
  const totalAmount = cart.items.reduce((accumulator, item) => {
    // Find the product data
    const productData = item.product;
    
    // Safety check: if product doesn't exist, don't add to total
    if (!productData) return accumulator;

    // 2. Calculate price for the specific variant
    const vPop = calculatePrice({       
      product: productData, 
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