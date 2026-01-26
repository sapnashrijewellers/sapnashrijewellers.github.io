import { Cart } from "@/types/catalog";
import ProductCard from "../product/ProductCard";
import { Dispatch, SetStateAction } from "react";
import { QuantityControl } from "./QuantityControl";
import { Trash2, Save, Check } from "lucide-react";


type CartStepProps = {
  cart: Cart;
  setCart?: Dispatch<SetStateAction<Cart>>;
  onNext?: () => void;
};

export default function CartStep({
  cart,
  setCart,
  onNext,
}: CartStepProps) {

  function updateCartQtyInState(
    cart: Cart,
    productId: number,
    variantIndex: number,
    qty: number
  ): Cart {
    return {
      ...cart,
      items: cart.items.map(item =>
        item.productId === productId && item.variantIndex === variantIndex
          ? { ...item, qty: Math.max(1, Math.min(10, qty)) }
          : item
      ),
    };
  }

  function removeItemFromCart(
    cart: Cart,
    productId: number,
    variantIndex: number
  ): Cart {
    return {
      ...cart,
      items: cart.items.filter(
        item =>
          !(
            item.productId === productId &&
            item.variantIndex === variantIndex
          )
      ),
    };
  }

  const isEmpty = cart.items.length === 0;  

  return (
    <>
      <h2 className="text-xl mb-4 font-yatra">Your Cart</h2>

      {isEmpty ? (
        <div className="text-center py-12 text-muted">
          <p className="text-lg mb-2">Your cart is empty</p>
          <p className="text-sm opacity-70">Add some products to continue</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {cart.items.map(item => (
            <div
              key={`${item.productId}-${item.variantIndex}`}
              className="bg-surface border border-theme rounded-lg p-2 relative"
            >
              {/* Delete button */}
              {setCart && (
                <button
                  className="absolute bottom-4 right-4 text-muted hover:text-red-600"
                  onClick={() =>
                    setCart(prev =>
                      removeItemFromCart(
                        prev,
                        item.productId,
                        item.variantIndex
                      )
                    )
                  }
                  aria-label="Remove item"
                >
                  <Trash2 size={22} />
                </button>
              )}

              <ProductCard
                product={item.product}
                variant={item.variantIndex}
              />

              {setCart ? (
                <QuantityControl
                  qty={item.qty}
                  onChange={(newQty) => {
                    setCart(prev =>
                      updateCartQtyInState(
                        prev,
                        item.productId,
                        item.variantIndex,
                        newQty
                      )
                    );
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
        <button className="ssj-btn w-full mt-6" onClick={onNext}>
          <Check size={16} strokeWidth={3} />
          Continue
        </button>
      )}
    </>
  );
}
