import ProductCard from "@/components/product/ProductCard";
import type { Product } from "@/types/catalog";
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

  return (
    <section
      aria-labelledby="new-arrivals-heading" 
      className={`relative w-full py-2 ${className}`}    >

      <h2 id="new-arrivals-heading"
        title="Explore recently launched gold and silver jewellery designs and latest hallmark collections.">
        New Arrivals
      </h2>


      {/* Screen Reader & LLM Structured Context */}
      <div className="sr-only">
        Explore recently launched gold and silver jewellery designs and latest hallmark collections.
      </div>

      {/* Horizontally Scrollable Snap Track with Hardware-Accelerated Transforms */}
      <div
        role="region"
        aria-label="New arrivals jewellery carousel"
        tabIndex={0}
        className="flex gap-3 sm:gap-4 overflow-x-auto p-2
          scrollbar-hide snap-x snap-mandatory
          focus:outline-none focus:ring-1 focus:ring-primary/40 rounded-2xl">
        {filteredArrivals.map((p, index) => (
          <ProductCard product={p} key={p.id}
            priority={index < 4}
            className="shrink-0 w-[160px] sm:w-[180px] lg:w-[220px] 
            snap-start snap-x snap-mandatory
              transition-transform duration-150 ease-out will-change-transform"/>
        ))}
      </div>
    </section>
  );
}