import ProductCard from '@/components/product/ProductCard';
import type { Product } from '@/types/catalog';
import SectionHeading from '../common/SectionHeading';

interface YouMayAlsoLikeProps {
  product: Product;
  products: Product[];
  className?: string;
}

export default function YouMayAlsoLike({ product, products, className = '' }: YouMayAlsoLikeProps) {
  // Filter matching collection/type products while excluding current product & new arrivals
  const youMayAlsoLike = products
    .filter(
      (p) =>
        p.active &&
        p.id !== product.id &&
        !p.newArrival &&
        p.for === product.for &&
        Array.isArray(product.type) &&
        Array.isArray(p.type) &&
        product.type.some((t) => p.type.includes(t)),
    )
    .sort((a, b) => Number(b.available) - Number(a.available))
    .slice(0, 15);

  if (youMayAlsoLike.length === 0) return null;

  return (
    <section aria-labelledby="you-may-also-like-heading" className={`relative my-2 w-full py-2 ${className}`}>
      <SectionHeading
        heading="You May Also Like"
        punchline="More handcrafted pieces curated to match your taste and aesthetic."
      />

      {/* Screen Reader & LLM Structured Context */}
      <div className="sr-only">
        Recommended related jewellery collections matching style and audience for {product.name}.
      </div>

      {/* Horizontally Scrollable Snap Track */}
      <div
        role="region"
        aria-label="Recommended jewellery products carousel"
        tabIndex={0}
        className="scrollbar-hide focus:ring-primary/40 flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-2xl px-2 pt-1 pb-3 focus:ring-1 focus:outline-none sm:gap-4 sm:px-4"
      >
        {youMayAlsoLike.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            className="w-[160px] shrink-0 snap-start transition-transform duration-150 ease-out will-change-transform sm:w-[200px] lg:w-[220px]"
          />
        ))}
      </div>
    </section>
  );
}
