import { Cart } from "@/types/catalog";
import ProductCard from "../product/ProductCard";
import products from "@/data/products.json";
import { updateCartQty } from "@/utils/cart";
import { QuantityControl } from "./QuantityControl";

type CartStepProps = {
  cart: Cart;
  setCart: (cart: Cart) => void;
  onNext: () => void;
};

export default function CartStep({
  cart,
  setCart,
  onNext,
}: CartStepProps) {
  return (
    <>
      <h2 className="text-xl mb-4 font-yatra">Your Cart</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cart.items.map(item => {
          const productData = products.find(
            p => p.id === item.productId
          );
          if (!productData) return null;

          return (
            <div
              key={`${item.productId}-${item.variantIndex}`}
              className="bg-surface border border-theme rounded-lg p-2"
            >
              <ProductCard
                product={productData}
                variant={item.variantIndex}
              />

              <QuantityControl
                qty={item.qty}
                onChange={(newQty) => {
                  const updatedCart = updateCartQty(
                    item.productId,
                    item.variantIndex,
                    newQty
                  );
                  setCart(updatedCart);
                }}
              />
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
