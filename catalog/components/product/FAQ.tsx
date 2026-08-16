import { Product } from "@/types/catalog";
import faqs from "@/data/faqs.json";

export function FAQ({ product }: { product: Product }) {
  const hasHighlights = product.highlights?.length > 0;
  if (!hasHighlights) return null;
  const pfaqs = faqs.filter(f => f.productId === product.id);
  return (
      <section
      className="relative rounded-2xl p-5 mb-6"
      style={{
        background: `linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-primary) 12%, transparent),
      color-mix(in srgb, var(--color-primary) 4%, transparent)
    )`,
      }}
    >
      <h3 className="mb-4 uppercase tracking-[0.2em] text-primary-dark">
        FAQs
      </h3>
        <div className="space-y-4">
          {pfaqs.map((f) => (
            <div key={f.q} className="border border-theme rounded-2xl bg-surface shadow-md p-5">
              <strong>{f.q}</strong>
              <p className="mt-2 text-sm">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
  );
}
export default FAQ;