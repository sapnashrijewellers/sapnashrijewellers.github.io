"use client";

import { calculatePrice } from "@/utils/calculatePrice";
import { Product } from "@/types/catalog";

export default function ProductCardPrice({ product }: { product: Product }) {
  
  if(!product.variants[0].makingCharges)
    return null;
  const popV = calculatePrice({ purity: product.purity, variant: product.variants[0] });
  
  if (popV?.price && popV?.price === null) return null;

  const isAvailable = product.variants[0].available;
  const formattedFinal = popV?.price?.toLocaleString("en-IN");
  const formattedMRP = popV?.MRP?.toLocaleString("en-IN");

  return (
    <div className="space-y-3">
      {/* Discounted pricing */}
      {popV?.price != null &&
        popV.MRP != null &&
        popV.discount != null &&
        popV.discount > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="line-through text-gray-500">
              ₹{formattedMRP}
            </span>
            {popV.discount && popV.discount > 0 && (
              <span className="rounded-full bg-accent text-surface px-2 py-0.5 text-xs font-semibold">
                {popV.discount}% OFF
              </span>
            )}
          </div>
        )}

      {/* Final price */}
      <div className="font-semibold text-primary-dark">
        {!isAvailable && ""}
        ₹{formattedFinal}

      </div>
    </div>
  );
}
