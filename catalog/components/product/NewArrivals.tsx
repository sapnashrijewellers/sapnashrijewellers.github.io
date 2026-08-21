import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types/catalog";
import { Sparkles } from "lucide-react";
import newArrivalsData from "@/data/newArrivals.json";

interface NewArrivalsProps {
  product?: Product;
  className?: string;
}

export default function NewArrivals({
  product,
  className = "",
}: NewArrivalsProps) {
  // Exclude the current product upfront so count and list stay synchronized
  const filteredArrivals = product
    ? (newArrivalsData as Product[]).filter((p) => p.id !== product.id)
    : (newArrivalsData as Product[]);

  // If nothing remains to show, unmount gracefully
  if (filteredArrivals.length === 0) return null;

  const count = filteredArrivals.length;

  return (
    <section
      aria-labelledby="new-arrivals-heading"
      className={`relative w-full py-4 my-6 ${className}`}
    >
      {/* Header with Bilingual Support for Search Engines and Screen Readers */}
      <div className="flex items-baseline justify-between px-2 sm:px-4 mb-3 border-b border-theme/20 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
          <h2
            id="new-arrivals-heading"
            className={`font-semibold text-foreground tracking-tight ${
              !product ? "au-h2 text-xl sm:text-2xl" : "text-lg sm:text-xl"
            }`}
          >
            New Arrivals
          </h2>
        </div>        
      </div>

      {/* Screen Reader & LLM Structured Context */}
      <div className="sr-only">
        Explore recently launched gold and silver jewellery designs and latest hallmark collections.
      </div>

      {/* Horizontally Scrollable Snap Track with Hardware-Accelerated Transforms */}
      <div
        role="region"
        aria-label="New arrivals jewellery carousel"
        tabIndex={0}
        className="
          flex gap-3 sm:gap-4 overflow-x-auto px-2 sm:px-4 pb-3 pt-1
          scrollbar-hide snap-x snap-mandatory
          focus:outline-none focus:ring-1 focus:ring-primary/40 rounded-2xl
        "
      >
        {filteredArrivals.map((p) => (
          <article
            key={p.id}
            aria-label={`${p.name} new arrival`}
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