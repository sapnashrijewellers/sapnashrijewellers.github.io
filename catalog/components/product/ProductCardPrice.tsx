"use client";


import { useRates } from "@/context/RateContext";
import { calculatePrice } from "@/utils/calculatePrice";
import { Product } from "@/types/catalog";

export default function ProductPrice({ product }: { product: Product }) {
  const rates = useRates();

  const priceResult = calculatePrice({ product, rates });

  if (!priceResult) return null;  
  const hasMakingCharges = product.makingCharges > 0;
  const formattedPrice = priceResult.price.toLocaleString("en-IN");

  return (
    <div className="space-y-3">
      {/* 1. Price Display Logic */}
      {hasMakingCharges && (
        <div className="text-lh text-highlight">
          {/* {!isAvailable && "Estimated Price "}₹{formattedPrice} */}
          ₹{formattedPrice}
        </div>
      )}
    </div>
  );
}
