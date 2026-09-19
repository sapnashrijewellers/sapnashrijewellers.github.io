import Image from 'next/image';
import ProductPrice from './ProductPrice';
import type { Product } from '@/types/catalog';
import { ShieldCheck } from 'lucide-react';

interface ProductSelectionProps {
  product: Product;
  className?: string;
}

export default function ProductSelection({ product, className = '' }: ProductSelectionProps) {
  const baseImageURL = (process.env.NEXT_PUBLIC_BASE_IMAGE_URL || 'https://sapnashrijewellers.in/static/img/').replace(
    /\/+$/,
    '',
  );

  const isHallmarked = (product.metal == 'gold' && (product.weight || 0) > 2) || Boolean(product.HUID);

  const hallmarkImageUrl = `${baseImageURL}/hallmark.webp`;

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* 1. Price Engine Section */}
      <ProductPrice product={product} />

      {/* 2. Specs, Brand Text & BIS Hallmark Certification */}
      <div className="border-theme/40 flex items-center justify-between gap-4 border-t pt-4">
        {/* Left Side: Brand Text / Artisan Note */}
        <div className="min-w-0 flex-1 space-y-1.5 text-sm">
          {product.brandText && product.brandText.trim().length > 2 ? (
            <p className="text-foreground/90 text-xs leading-relaxed font-medium sm:text-sm">{product.brandText}</p>
          ) : (
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>100% Certified Purity Guaranteed</span>
            </div>
          )}
        </div>

        {/* Right Side: BIS Hallmark Trust Badge */}
        {isHallmarked && (
          <aside
            aria-label="BIS Hallmark certification"
            className="bg-surface border-theme/40 flex w-24 shrink-0 flex-col items-center justify-center rounded-xl border p-2 text-center shadow-xs sm:w-28"
          >
            <div className="relative h-12 w-12 sm:h-14 sm:w-14">
              <Image
                src={hallmarkImageUrl}
                alt="Govt-Approved BIS Hallmark Certification"
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                sizes="56px"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-foreground mt-1 flex items-center justify-center gap-0.5 text-[11px] leading-tight font-semibold sm:text-xs">
              {/* <Award className="hidden h-3 w-3 shrink-0 sm:inline" aria-hidden="true" /> */}
              <span>BIS Hallmark</span>
            </span>
          </aside>
        )}
      </div>
    </div>
  );
}
