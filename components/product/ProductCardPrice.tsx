import type { Product } from '@/types/catalog';

interface ProductCardPriceProps {
  product: Product;
  className?: string;
}

export default function ProductCardPrice({ product, className = '' }: ProductCardPriceProps) {
  // Products without making charges are "Made to Order" / price-on-request
  const hasMakingCharges = Number(product.makingCharges || 0) > 0;
  if (!hasMakingCharges) return null;

  if (!product || product.price == null) return null;

  const isAvailable = Boolean(product.available);
  const formattedFinal = product.price.toLocaleString('en-IN');
  const formattedMRP = product.MRP?.toLocaleString('en-IN');
  const hasDiscount = Boolean(product.MRP && product.discount && product.discount > 0 && product.MRP > product.price);

  return (
    <div className={`flex gap-2 space-y-0.5 select-none ${className}`}>
      {/* MRP & Discount Badge */}
      {hasDiscount && (
        <div className="flex items-start gap-1.5 text-[11px] sm:text-xs">
          <span className="text-muted-foreground line-through">
            <span className="sr-only">Original Price: </span>₹{formattedMRP}
          </span>
          <span
            className="py-0.2 inline-flex items-center rounded-full border border-emerald-600/20 bg-emerald-600/10 px-1.5 text-[10px] font-bold text-emerald-700 sm:text-[11px]"
            aria-label={`${product.discount}% discount`}
          >
            {product.discount}% OFF
          </span>
        </div>
      )}

      {/* Current / Estimated Final Calculated Price */}
      <div
        id="finalPrice"
        className="text-foreground ml-auto items-end text-right tracking-tight"
        aria-label={`${!isAvailable ? 'Estimated price' : 'Price'}: ₹${formattedFinal}`}
      >
        {!isAvailable && (
          <span className="text-muted-foreground mr-1 text-[11px] font-normal sm:text-xs">On Order</span>
        )}
        {isAvailable && <span className="text-lg font-bold">₹{formattedFinal}</span>}
      </div>
    </div>
  );
}
