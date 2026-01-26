import {Cart , CartItem} from "@/types/catalog"

const CART_KEY = "ssj_cart";

export function getCart(): Cart {
  if (typeof window === "undefined") return { items: [] };
  return JSON.parse(localStorage.getItem(CART_KEY) || '{"items":[]}');
}


export function addToCart(item: CartItem) {
  const cart = getCart();
  const existing = cart.items.find(
    i => i.productId === item.productId && i.variantIndex === item.variantIndex
  );

  if (existing) existing.qty += item.qty;
  else cart.items.push(item);

  saveCart(cart);
}
export function saveCart(cart: Cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function updateCartQty(
  productId: number,
  variantIndex: number,
  qty: number
): Cart {
  const cart = getCart();

  const item = cart.items.find(
    i => i.productId === productId && i.variantIndex === variantIndex
  );

  if (!item) return cart;

  item.qty = Math.max(1, Math.min(10, qty));
  saveCart(cart);
  return cart;
}

