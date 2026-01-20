"use client";


import { useRates } from "@/context/RateContext";
import { calculatePrice } from "@/utils/calculatePrice";
import OrderViaWhatsappButton from "@/components/product/OrderViaWhatsappButton";
import BuyNowButton from "./BuyNowButton";
import CalculatePriceButton from "@/components/product/CalculatePriceButton";
import { Product } from "@/types/catalog";
import DisclaimerTooltip from "@/components/common/DisclaimerTooltip"

export default function ProductPrice({ product, activeVariant = 0 }: { product: Product, activeVariant?: number }) {
  const rates = useRates();

  const popV = calculatePrice({ purity: product.purity, variant: product.variants[activeVariant], rates });

  if (popV?.price === null) return null;

  const isAvailable = product.variants[activeVariant].available;
  const hasMakingCharges = product.variants[activeVariant].makingCharges > 0;

  const formattedFinal = popV?.price?.toLocaleString("en-IN");
  const formattedMRP = popV?.MRP?.toLocaleString("en-IN");

  return (
    <div className="space-y-3">
      {/* 1. Price Display Logic */}
      {hasMakingCharges && (
        <div className="space-y-1">
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
          <div className="text-2xl font-semibold text-primary-dark">
            {!isAvailable && "Estimated Price "}
            ₹{formattedFinal}

            {!isAvailable && (
              <DisclaimerTooltip
                text="On order, product weight may vary slightly due to manufacturing tolerance."
                href="/policies/disclaimer"
              />
            )}
          </div>
        </div>
      )}

      {/* 2. Made to Order Logic (Shown for all except Available+Charges) */}
      {(!isAvailable || !hasMakingCharges) && <MadeToOrder />}

      {/* 3. CTA Logic */}
      {isAvailable && hasMakingCharges && (
        <BuyNowButton product={product} activeVariant={activeVariant} />
      )}
      {!(isAvailable && hasMakingCharges) && (
        <OrderViaWhatsappButton
          product={product}
          title="Order via WhatsApp"
          activeVariant={activeVariant}
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
