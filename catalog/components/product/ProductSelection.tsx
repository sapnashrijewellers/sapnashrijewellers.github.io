import Image from "next/image";
import ProductPrice from "./ProductPrice";
import type { Product } from "@/types/catalog";
import { Award, ShieldCheck } from "lucide-react";

interface ProductSelectionProps {
  product: Product;
  className?: string;
}

export default function ProductSelection({
  product,
  className = "",
}: ProductSelectionProps) {
  const baseURL = (process.env.NEXT_PUBLIC_BASE_URL || "https://sapnashrijewellers.in").replace(
    /\/+$/,
    ""
  );

  const purityLower = (product.purity || "").toLowerCase();
  const isGold = purityLower.startsWith("gold") || purityLower.includes("22k") || purityLower.includes("18k") || purityLower.includes("14k");
  const isHallmarked = (isGold && (product.weight || 0) > 2) || Boolean(product.HUID);

  const hallmarkImageUrl = `${baseURL}/static/img/hallmark.png`;

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* 1. Price Engine Section */}
      <ProductPrice product={product} />

      {/* 2. Specs, Brand Text & BIS Hallmark Certification */}
      <div className="flex items-center justify-between gap-4 border-t border-theme/40 pt-4">
        {/* Left Side: Brand Text / Artisan Note */}
        <div className="text-sm space-y-1.5 flex-1 min-w-0">
          {product.brandText && product.brandText.trim().length > 2 ? (
            <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed">
              {product.brandText}
            </p>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
              <span>100% Certified Purity Guaranteed</span>
            </div>
          )}

          {Boolean(product.HUID) && (
            <p className="text-xs font-mono text-muted-foreground flex items-center gap-1">
              <span>HUID:</span>
              <span className="font-semibold text-foreground">{product.HUID}</span>
            </p>
          )}
        </div>

        {/* Right Side: BIS Hallmark Trust Badge */}
        {isHallmarked && (
          <aside
            aria-label="BIS Hallmark certification"
            className="flex flex-col items-center justify-center shrink-0 w-24 sm:w-28 p-2 rounded-xl bg-surface border border-theme/40 shadow-xs text-center"
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14">
              <Image
                src={hallmarkImageUrl}
                alt="Govt-Approved BIS Hallmark Certification"
                width={56}
                height={56}
                loading="lazy"
                decoding="async"
                sizes="56px"
                className="object-contain w-full h-full"
              />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-foreground mt-1 flex items-center gap-0.5 justify-center leading-tight">
              <Award className="w-3 h-3 text-primary shrink-0 hidden sm:inline" aria-hidden="true" />
              <span>BIS Hallmark</span>
            </span>
          </aside>
        )}
      </div>
    </div>
  );
}