import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types/catalog";
import { Sparkles } from "lucide-react";

interface YouMayAlsoLikeProps {
  product: Product;
  products: Product[];
  className?: string;
}

export default function YouMayAlsoLike({
  product,
  products,
  className = "",
}: YouMayAlsoLikeProps) {
  // Filter matching category/type products while excluding current product & new arrivals
  const youMayAlsoLike = products
    .filter(
      (p) =>
        p.active &&
        p.id !== product.id &&
        !p.newArrival &&
        p.for === product.for &&
        Array.isArray(product.type) &&
        Array.isArray(p.type) &&
        product.type.some((t) => p.type.includes(t))
    )
    .sort((a, b) => Number(b.available) - Number(a.available))
    .slice(0, 15);

  if (youMayAlsoLike.length === 0) return null;

  return (
    <section
      aria-labelledby="you-may-also-like-heading"
      className={`relative w-full py-4 my-6 ${className}`}
    >
      {/* Header with Bilingual Metadata */}
      <div className="flex items-baseline justify-between px-2 sm:px-4 mb-3 border-b border-theme/20 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
          <h2
            id="you-may-also-like-heading"
            className="font-semibold text-lg sm:text-xl text-foreground tracking-tight"
          >
            आपको यह भी पसंद आ सकता है (You May Also Like)
          </h2>
        </div>
        <span className="text-xs text-muted-foreground font-medium hidden sm:inline-block">
          {youMayAlsoLike.length} {youMayAlsoLike.length === 1 ? "सुझाव (Item)" : "सुझाव (Items)"}
        </span>
      </div>

      {/* Screen Reader & LLM Structured Context */}
      <div className="sr-only">
        Recommended related jewellery collections matching style and audience for {product.name}.
      </div>

      {/* Horizontally Scrollable Snap Track */}
      <div
        role="region"
        aria-label="Recommended jewellery products carousel"
        tabIndex={0}
        className="
          flex gap-3 sm:gap-4 overflow-x-auto px-2 sm:px-4 pb-3 pt-1
          scrollbar-hide snap-x snap-mandatory
          focus:outline-none focus:ring-1 focus:ring-primary/40 rounded-2xl
        "
      >
        {youMayAlsoLike.map((p) => (
          <article
            key={p.id}
            aria-label={`${p.name} recommendation`}
            className="
              shrink-0 w-[160px] sm:w-[200px] lg:w-[220px] snap-start
              transition-transform duration-150 ease-out will-change-transform
            "
          >
            <ProductCard product={p} />
          </article>
        ))}
      </div>
    </section>
  );
}