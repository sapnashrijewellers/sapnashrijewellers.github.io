"use client";

import useSWR from "swr";
import { calculatePrice } from "@/utils/calculatePrice";
import WhatsappClick from "@/components/product/WhatAppClick";
import CalculatePrice from "@/components/product/CalculatePriceButton";
import { Product } from "@/types/catalog";

export default function ProductPrice({ product }: { product: Product }) {
  const { data: rates, isLoading } = useSWR(
    "https://sapnashrijewellers.in/rate/rates.json",
    (url) => fetch(url).then(r => r.json()),
    { refreshInterval: 30 * 1000 }
  );

  if (isLoading || !rates) {
    return (
      <div className="text-sm animate-pulse text-muted">
        Fetching live silver rate…
      </div>
    );
  }

  const priceResult = calculatePrice({ product, rates });

  if (!priceResult) return null;

  const isAvailable = product.available;
  const hasMakingCharges = product.makingCharges > 0;
  const formattedPrice = priceResult.price.toLocaleString("en-IN");

  return (
    <div className="space-y-3">
      {/* 1. Price Display Logic */}
      {hasMakingCharges && (
        <div className="text-3xl font-bold text-primary-dark">
          {!isAvailable && "Estimated Price "}₹{formattedPrice}
        </div>
      )}

      {/* 2. Made to Order Logic (Shown for all except Available+Charges) */}
      {(!isAvailable || !hasMakingCharges) && <MadeToOrder />}

      {/* 3. CTA Logic */}
      <WhatsappClick
        product={product}
        title={isAvailable && hasMakingCharges ? "Buy Now" : "Order via WhatsApp"}
      />

      {/* 4. Price Calculator Logic (Only when making charges are missing) */}
      {!hasMakingCharges && <CalculatePrice product={product} />}
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
