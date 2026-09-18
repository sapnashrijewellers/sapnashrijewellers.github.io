import { Cart } from '@/types/catalog';
import ProductCard from '@/components/product/ProductCard';
import { Dispatch, SetStateAction } from 'react';
import { QuantityControl } from './QuantityControl';
import { Trash2, Check } from 'lucide-react';

type CartStepProps = {
  cart: Cart;
  setCart?: Dispatch<SetStateAction<Cart>>;
  onNext?: () => void;
};

export default function CartStep({ cart, setCart, onNext }: CartStepProps) {
  function updateCartQtyInState(cart: Cart, productId: number, qty: number): Cart {
    return {
      ...cart,
      items: cart.items.map((item) =>
        item.productId === productId ? { ...item, qty: Math.max(1, Math.min(10, qty)) } : item,
      ),
    };
  }

  function removeItemFromCart(cart: Cart, productId: number): Cart {
    return {
      ...cart,
      items: cart.items.filter((item) => !(item.productId === productId)),
    };
  }

  const isEmpty = cart.items.length === 0;

  return (
    <>
      <h2 className="">Your Cart</h2>

      {isEmpty ? (
        <div className="text-muted py-12 text-center">
          <p className="mb-2 text-lg">Your cart is empty</p>
          <p className="text-sm opacity-70">Add some products to continue</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {cart.items.map((item) => (
            <div key={`${item.productId}`} className="bg-surface border-theme relative rounded-lg border p-2">
              {/* Delete button */}
              {setCart && (
                <button
                  className="text-muted absolute right-4 bottom-4 hover:text-red-600"
                  onClick={() => setCart((prev) => removeItemFromCart(prev, item.productId))}
                  aria-label="Remove item from the cart"
                >
                  <Trash2 size={22} />
                </button>
              )}

              <ProductCard product={item.product} />

              {setCart ? (
                <QuantityControl
                  qty={item.qty}
                  onChange={(newQty) => {
                    setCart((prev) => updateCartQtyInState(prev, item.productId, newQty));
                  }}
                />
              ) : (
                <p>Quantity: {item.qty}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Continue button only when cart has items */}
      {!isEmpty && onNext && (
        <button className="ssj-btn mt-6 w-full" onClick={onNext}>
          <Check size={16} strokeWidth={3} />
          Continue
        </button>
      )}
    </>
  );
}
