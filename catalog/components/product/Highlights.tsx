import { Product } from "@/types/catalog";

export function HighlightsTabs({ product }: { product: Product }) {
  const hasHighlights = product.highlights?.length > 0;
  if (!hasHighlights) return null;
  return (
    <div className="mt-4">
      <ul className="list-disc space-y-1 text-sm mb-4 px-4">
        {product.highlights.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>
    </div>
  );
}
