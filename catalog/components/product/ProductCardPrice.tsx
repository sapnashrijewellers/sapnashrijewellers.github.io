"use client";


import { useRates } from "@/context/RateContext";
import { calculatePrice } from "@/utils/calculatePrice";
import { Product } from "@/types/catalog";

export default function ProductCardPrice({ product }: { product: Product }) {
  const rates = useRates();

  const priceResult = calculatePrice({ purity:product.purity, variant: product.variants[0],  rates });

  if (!priceResult) return null;  
  const hasMakingCharges = priceResult.makingCharges > 0;
  const formattedPrice = priceResult?.price?.toLocaleString("en-IN");

  return (
    <div className="space-y-3">
      {/* 1. Price Display Logic */}
      {hasMakingCharges && (
        <div className="text-lh text-highlight">          
          ₹{formattedPrice}
        </div>
      )}
    </div>
  );
}
