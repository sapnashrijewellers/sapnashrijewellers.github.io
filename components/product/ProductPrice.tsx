import OrderViaWhatsappButton from '@/components/product/OrderViaWhatsappButton';
import BuyNowButton from './BuyNowButton';
import type { Product } from '@/types/catalog';
import Tooltip from '@/components/common/Tooltip';

interface ProductPriceProps {
  product: Product;
  className?: string;
}

export default function ProductPrice({ product, className = '' }: ProductPriceProps) {
  if (product.price == null) return null;

  const isAvailable = Boolean(product.available);
  const hasMakingCharges = Number(product.makingCharges || 0) > 0;
  const canDirectCheckout = isAvailable && hasMakingCharges;

  const formattedFinalPrice = product.price.toLocaleString('en-IN');
  const formattedMRP = product.MRP?.toLocaleString('en-IN');

  const hasDiscount = Boolean(product.MRP && product.discount && product.discount > 0 && product.MRP > product.price);

  return (
    <section
      aria-label="Product price and ordering options"
      className={`flex flex-wrap items-center gap-x-4 gap-y-3 ${className}`}
    >
      {/* Price */}
      {hasMakingCharges && (
        <div className="shrink-0">
          {/* MRP & Discount */}
          {hasDiscount && (
            <div className="mb-1 flex items-center gap-2 text-xs sm:text-sm">
              <span className="text-muted-foreground line-through">
                <span className="sr-only">Original Price: </span>₹{formattedMRP}
              </span>

              <span
                className="inline-flex items-center rounded-full border border-emerald-600/20 bg-emerald-600/10 px-2 py-0.5 text-xs font-bold text-emerald-700"
                aria-label={`${product.discount}% discount`}
              >
                {product.discount}% OFF
              </span>
            </div>
          )}

          {/* Current / Final Price */}
          <div className="flex items-baseline gap-2">
            <span
              className="text-foreground text-2xl font-bold tracking-tight whitespace-nowrap sm:text-3xl"
              aria-label={`${!isAvailable ? 'Estimated price' : 'Price'}: ${product.price} Indian Rupees`}
            >
              {!isAvailable && (
                <span className="text-muted-foreground mr-1.5 text-sm font-normal sm:text-base">Estimated Price</span>
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

      {/* Made to Order */}
      {(!isAvailable || !hasMakingCharges) && <MadeToOrderBadge />}

      {/* CTA */}
      <div className="shrink-0">
        {canDirectCheckout ? (
          <BuyNowButton product={product} className="w-full sm:w-auto" />
        ) : (
          <OrderViaWhatsappButton product={product} title="Order via WhatsApp" className="w-full sm:w-auto" />
        )}
      </div>
      <p>Secure checkout · Easy support · Delivery available</p>
    </section>
  );
}

function MadeToOrderBadge() {
  return (
    <div
      role="status"
      aria-label="Made to order item: available on request"
      className="bg-surface border-theme/40 text-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap shadow-2xs"
    >
      <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-amber-500" aria-hidden="true" />

      <span>Made to Order &bull; Available on Request</span>
    </div>
  );
}
