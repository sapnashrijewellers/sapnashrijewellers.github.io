import { Cart } from "@/types/catalog";


export function calculateFinal(cart: Cart) {
  // 1. Calculate the total by iterating through cart items
  const totalAmount = cart.items.reduce((accumulator, item) => {
    // Find the product data
    const productData = item.product;
    
    // Safety check: if product doesn't exist, don't add to total
    if (!productData) return accumulator;

    
    // 3. Multiply by quantity and add to the running total
    // Using optional chaining and nullish coalescing to avoid NaN
    const itemTotal = (productData.price ?? 0) * item.qty;
    
    return accumulator + itemTotal;
  }, 0);

  // 4. Return the final sum
  return totalAmount;
}