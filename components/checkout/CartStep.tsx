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
  function updateCartQtyInState(currentCart: Cart, productId: number, qty: number): Cart {
    return {
      ...currentCart,
      items: currentCart.items.map((item) =>
        item.productId === productId ? { ...item, qty: Math.max(1, Math.min(10, qty)) } : item,
      ),
    };
  }

  function removeItemFromCart(currentCart: Cart, productId: number): Cart {
    return {
      ...currentCart,
      items: currentCart.items.filter((item) => item.productId !== productId),
    };
  }

  const isEmpty = cart.items.length === 0;

  return (
    <>
      <h2>Your Cart</h2>

      {isEmpty ? (
        <div className="text-muted py-12 text-center">
          <p className="mb-2 text-lg">Your cart is empty</p>
          <p className="text-sm opacity-70">Add some products to continue</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cart.items.map((item) => (
            <div
              key={item.productId}
              className="bg-surface border-theme flex h-full min-w-0 flex-col rounded-lg border p-2"
            >
              {/* Product content */}
              <div className="min-w-0 flex-1">
                <ProductCard product={item.product} />
              </div>

              {/* Cart controls - dedicated footer */}
              {setCart ? (
                <div className="border-theme relative z-10 mt-3 flex min-h-12 w-full shrink-0 items-center justify-between gap-3 border-t pt-3">
                  {/* Quantity control - Left */}
                  <div className="flex min-w-0 items-center">
                    <QuantityControl
                      qty={item.qty}
                      onChange={(newQty) => {
                        setCart((prev) => updateCartQtyInState(prev, item.productId, newQty));
                      }}
                    />
                  </div>

                  {/* Delete button - Right */}
                  <button
                    type="button"
                    onClick={() => {
                      setCart((prev) => removeItemFromCart(prev, item.productId));
                    }}
                    aria-label="Remove item from cart"
                    title="Remove item"
                    className="text-muted inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={21} />
                  </button>
                </div>
              ) : (
                <div className="border-theme mt-3 border-t pt-3">
                  <p>Quantity: {item.qty}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Continue button */}
      {!isEmpty && onNext && (
        <button type="button" className="ssj-btn mt-6 w-full" onClick={onNext}>
          <Check size={16} strokeWidth={3} />
          Continue
        </button>
      )}
    </>
  );
}
