"use client";


import { useRates } from "@/context/RateContext";
import { calculatePrice } from "@/utils/calculatePrice";
import WhatsappClick from "@/components/product/WhatAppClick";
import AddToCartButton from "./AddToCartButton";
import CalculatePriceButton from "@/components/product/CalculatePriceButton";
import { Product } from "@/types/catalog";

export default function ProductPrice({ product }: { product: Product }) {
  const rates = useRates();

  const priceResult = calculatePrice({ product, rates });

  if (!priceResult) return null;

  const isAvailable = product.available;
  const hasMakingCharges = product.makingCharges > 0;
  const formattedPrice = priceResult.price.toLocaleString("en-IN");

  return (
    <div className="space-y-3">
      {/* 1. Price Display Logic */}
      {hasMakingCharges && (
        <div className="text-2xl font-semibold">
          {!isAvailable && "Estimated Price "}₹{formattedPrice}
        </div>
      )}

      {/* 2. Made to Order Logic (Shown for all except Available+Charges) */}
      {(!isAvailable || !hasMakingCharges) && <MadeToOrder />}

      {/* 3. CTA Logic */}
      {isAvailable && hasMakingCharges && (
        <AddToCartButton product={product} />
      )}
      {!(isAvailable && hasMakingCharges) && (
      <WhatsappClick
        product={product}
        title= "Order via WhatsApp"
      />

      )}
      {/* 4. Price Calculator Logic (Only when making charges are missing) */}
      {!hasMakingCharges && <CalculatePriceButton product={product} />}

    </div>
  );
}
function MadeToOrder() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-surface text-primary-dark px-3 py-1 text-xs font-medium border">
      <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
      Made to Order · Available on Request
    </div>
  )
}
