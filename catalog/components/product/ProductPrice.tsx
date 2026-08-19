import { calculatePrice } from "@/utils/calculatePrice";
import OrderViaWhatsappButton from "@/components/product/OrderViaWhatsappButton";
import BuyNowButton from "./BuyNowButton";
import type { Product } from "@/types/catalog";
import Tooltip from "@/components/common/Tooltip";
import rates from "@/data/rates.json";

interface ProductPriceProps {
  product: Product;
  className?: string;
}

export default function ProductPrice({
  product,
  className = "",
}: ProductPriceProps) {
  
  const popV = calculatePrice({ product, rates });

  if (popV?.price == null) return null;

  const isAvailable = Boolean(product.available);
  const hasMakingCharges = Number(product.makingCharges || 0) > 0;
  const canDirectCheckout = isAvailable && hasMakingCharges;

  const formattedFinalPrice = popV.price.toLocaleString("en-IN");
  const formattedMRP = popV.MRP?.toLocaleString("en-IN");
  const hasDiscount = Boolean(
    popV.MRP && popV.discount && popV.discount > 0 && popV.MRP > popV.price
  );

  return (
    <section
      aria-label="Product price and ordering options"
      className={`space-y-3.5 ${className}`}
    >     

      {/* 1. Price Breakdown & Formatting */}
      {hasMakingCharges && (
        <div className="space-y-1">
          {/* MRP & Discount Pill */}
          {hasDiscount && (
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="line-through text-muted-foreground">
                <span className="sr-only">Original Price: </span>₹{formattedMRP}
              </span>
              <span
                className="inline-flex items-center rounded-full bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-600/20 px-2 py-0.5 text-xs font-bold"
                aria-label={`${popV.discount}% discount`}
              >
                {popV.discount}% OFF
              </span>
            </div>
          )}

          {/* Current / Final Live Calculated Price */}
          <div className="flex items-baseline flex-wrap gap-2">
            <span
              className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
              aria-label={`${!isAvailable ? "Estimated price" : "Price"}: ${popV.price} Indian Rupees`}
            >
              {!isAvailable && (
                <span className="text-sm sm:text-base font-normal text-muted-foreground mr-1.5">
                  Estimated Price
                </span>
              )}
              <span>₹{formattedFinalPrice}</span>
            </span>

            {!isAvailable && (
              <Tooltip
                text="On customized orders, final product weight and making charges may vary slightly due to handcrafting tolerances."
                href="/policies/disclaimer/"
                label="Read pricing and manufacturing tolerance disclaimer"
              />
            )}
          </div>
        </div>
      )}

      {/* 2. Made to Order Badge */}
      {(!isAvailable || !hasMakingCharges) && <MadeToOrderBadge />}

      {/* 3. Primary Purchase CTAs */}
      <div className="pt-1">
        {canDirectCheckout ? (
          <BuyNowButton product={product} className="w-full sm:w-auto" />
        ) : (
          <OrderViaWhatsappButton
            product={product}
            title="Order via WhatsApp"
            className="w-full sm:w-auto"
          />
        )}
      </div>
    </section>
  );
}

function MadeToOrderBadge() {
  return (
    <div
      role="status"
      aria-label="Made to order item: available on request"
      className="inline-flex items-center gap-2 rounded-full bg-surface border border-theme/40 text-foreground px-3 py-1 text-xs font-medium shadow-2xs"
    >
      <span
        className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0"
        aria-hidden="true"
      />
      <span>Made to Order &bull; Available on Request</span>
    </div>
  );
}