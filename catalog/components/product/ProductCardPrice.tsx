import type { Product } from "@/types/catalog";

interface ProductCardPriceProps {
  product: Product;  
  className?: string;
}

export default function ProductCardPrice({
  product,  
  className = "",
}: ProductCardPriceProps) {
  // Products without making charges are "Made to Order" / price-on-request
  const hasMakingCharges = Number(product.makingCharges || 0) > 0;
  if (!hasMakingCharges) return null;

  
  if (!product || product.price == null) return null;

  const isAvailable = Boolean(product.available);
  const formattedFinal = product.price.toLocaleString("en-IN");
  const formattedMRP = product.MRP?.toLocaleString("en-IN");
  const hasDiscount = Boolean(
    product.MRP &&
    product.discount &&
    product.discount > 0 &&
    product.MRP > product.price
  );

  return (
    <div className={`space-y-0.5 select-none ${className}`}>
      {/* MRP & Discount Badge */}
      {hasDiscount && (
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
          <span className="line-through text-muted-foreground">
            <span className="sr-only">Original Price: </span>₹{formattedMRP}
          </span>
          <span
            className="inline-flex items-center rounded-full bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-600/20 px-1.5 py-0.2 text-[10px] sm:text-[11px] font-bold"
            aria-label={`${product.discount}% discount`}
          >
            {product.discount}% OFF
          </span>
        </div>
      )}

      {/* Current / Estimated Final Calculated Price */}
      <div
        className="font-bold text-sm sm:text-base text-foreground tracking-tight"
        aria-label={`${!isAvailable ? "Estimated price" : "Price"}: ₹${formattedFinal}`}
      >
        {!isAvailable && (
          <span className="text-[11px] sm:text-xs font-normal text-muted-foreground mr-1">
            Est.
          </span>
        )}
        <span>₹{formattedFinal}</span>
      </div>
    </div>
  );
}