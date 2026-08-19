import type { Product } from "@/types/catalog";
import faqsData from "@/data/faqs.json";
import { HelpCircle } from "lucide-react";

interface FAQItem {
  id?: string | number;
  productId: string | number;
  q: string;
  a: string;
}

interface FAQProps {
  product: Product;
  className?: string;
}

export default function FAQ({ product, className = "" }: FAQProps) {
  const hasHighlights = Array.isArray(product.highlights) && product.highlights.length > 0;
  if (!hasHighlights) return null;

  const productFaqs = (faqsData as FAQItem[]).filter(
    (f) => String(f.productId) === String(product.id)
  );

  if (productFaqs.length === 0) return null;

  // Schema.org FAQPage structured data for Search Engines & LLM crawling
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: productFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q.replace(/[\r\n\t]+/g, " ").trim(),
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a.replace(/[\r\n\t]+/g, " ").trim(),
      },
    })),
  };

  return (
    <section
      aria-labelledby="faq-section-heading"
      className={`relative rounded-2xl p-5 sm:p-6 mb-6 border border-theme/40 bg-surface/90 shadow-sm ${className}`}
      style={{
        background: `linear-gradient(
          180deg,
          color-mix(in srgb, var(--color-primary, #b8860b) 10%, transparent),
          color-mix(in srgb, var(--color-primary, #b8860b) 3%, transparent)
        )`,
      }}
    >
      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-theme/20">
        <HelpCircle className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
        <h3
          id="faq-section-heading"
          className="text-base sm:text-lg font-bold tracking-wide uppercase text-primary font-yatra"
        >
          अक्सर पूछे जाने वाले प्रश्न (FAQs)
        </h3>
      </div>

      {/* LLM & Screen Reader Context */}
      <div className="sr-only">
        Frequently asked questions and purchase guidance for {product.name}.
      </div>

      {/* Semantic Question/Answer List */}
      <dl className="space-y-3.5">
        {productFaqs.map((f, index) => (
          <div
            key={`${f.q}-${index}`}
            className="border border-theme/50 rounded-2xl bg-surface/95 p-4 sm:p-5 shadow-sm transition-[transform,box-shadow] duration-150 ease-out will-change-[transform]"
          >
            <dt className="text-sm sm:text-base font-semibold text-foreground leading-snug flex items-start gap-2">
              <span className="text-primary font-bold select-none" aria-hidden="true">
                Q.
              </span>
              <span>{f.q}</span>
            </dt>
            <dd className="mt-2.5 text-xs sm:text-sm text-foreground/85 leading-relaxed pl-5 sm:pl-6 border-l-2 border-primary/30">
              {f.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}