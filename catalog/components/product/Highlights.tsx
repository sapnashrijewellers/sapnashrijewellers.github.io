import type { Product } from "@/types/catalog";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface HighlightsTabsProps {
  product: Product;
  className?: string;
}

export function HighlightsTabs({ product, className = "" }: HighlightsTabsProps) {
  const highlights = Array.isArray(product.highlights) ? product.highlights : [];
  if (highlights.length === 0) return null;

  return (
    <section
      aria-labelledby="product-highlights-heading"
      className={`relative rounded-2xl border border-theme/40 bg-surface/80 p-4 sm:p-5 shadow-sm transition-[transform,box-shadow] duration-150 ease-out will-change-[transform] ${className}`}
    >
      {/* Header with Bilingual Metadata */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-theme/20">
        <Sparkles className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
        <h3
          id="product-highlights-heading"
          className="text-sm sm:text-base font-semibold text-foreground tracking-tight"
        >
          उत्पाद की मुख्य विशेषताएं (Product Highlights)
        </h3>
      </div>

      {/* Screen Reader & LLM Structured Context */}
      <div className="sr-only">
        Key specifications, metal authenticity, and design features for {product.name}.
      </div>

      {/* Semantic List of Highlight Points */}
      <ul
        role="list"
        aria-label={`Key features for ${product.name}`}
        className="space-y-2 text-xs sm:text-sm text-foreground/90"
      >
        {highlights.map((point, i) => (
          <li
            key={`${product.id || product.id}-highlight-${i}`}
            className="flex items-start gap-2.5 leading-relaxed"
          >
            <CheckCircle2
              className="w-4 h-4 text-primary mt-0.5 shrink-0 select-none"
              aria-hidden="true"
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default HighlightsTabs;