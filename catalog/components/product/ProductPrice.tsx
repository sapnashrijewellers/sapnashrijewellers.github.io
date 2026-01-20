"use client";


import { useRates } from "@/context/RateContext";
import { calculatePrice } from "@/utils/calculatePrice";
import WhatsappClick from "@/components/product/WhatAppClick";
import AddToCartButton from "./AddToCartButton";
import CalculatePriceButton from "@/components/product/CalculatePriceButton";
import { Product } from "@/types/catalog";
import DisclaimerTooltip from "@/components/common/DisclaimerTooltip"

export default function ProductPrice({ product, activeVariant = 0 }: { product: Product, activeVariant?: number }) {
  const rates = useRates();

  const popV = calculatePrice({ purity: product.purity, variant: product.variants[activeVariant], rates });

  if (popV?.price === null) return null;

  const isAvailable = product.variants[activeVariant].available;
  const hasMakingCharges = product.variants[activeVariant].makingCharges > 0;
  const formattedPrice = popV?.price?.toLocaleString("en-IN");

  return (
    <div className="space-y-3">
      {/* 1. Price Display Logic */}
      {hasMakingCharges && (
        <div className="text-2xl font-semibold">
          {!isAvailable && "Estimated Price "}₹{formattedPrice}
          {!product.variants[activeVariant].available && (
            <DisclaimerTooltip
              text="On order, product weight may vary slightly due to manufacturing tolerance."
              href="/policies/disclaimer"
            />
          )}
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
          title="Order via WhatsApp"
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
