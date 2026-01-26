import { Cart } from "@/types/catalog";
import ProductCard from "../product/ProductCard";
import { Dispatch, SetStateAction } from "react";
import { QuantityControl } from "./QuantityControl";


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

  return (
    <>
      <h2 className="text-xl mb-4 font-yatra">Your Cart</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3  gap-4">
        {cart.items.map(item => {

          return (
            <div
              key={`${item.productId}-${item.variantIndex}`}
              className="bg-surface border border-theme rounded-lg p-2"
            >
              <ProductCard
                product={item.product}
                variant={item.variantIndex}
              />
              {setCart && (<QuantityControl
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
              />)}
              {!setCart && (
                <p>Quantity: {item.qty}</p>
              )}

            </div>
          );
        })}
      </div>

      {onNext && (
        <button className="ssj-btn w-full mt-6" onClick={onNext}>
          Continue
        </button>
      )
      }
    </>
  );
}
