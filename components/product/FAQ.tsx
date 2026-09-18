import type { Product } from '@/types/catalog';
import faqsData from '@/data/faqs.json';
import { HelpCircle } from 'lucide-react';
import JsonLd from '../common/JsonLd';

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

export default function FAQ({ product, className = '' }: FAQProps) {
  const hasHighlights = Array.isArray(product.highlights) && product.highlights.length > 0;
  if (!hasHighlights) return null;

  const productFaqs = (faqsData as FAQItem[]).filter((f) => String(f.productId) === String(product.id));

  if (productFaqs.length === 0) return null;

  // Schema.org FAQPage structured data for Search Engines & LLM crawling
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: productFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q.replace(/[\r\n\t]+/g, ' ').trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a.replace(/[\r\n\t]+/g, ' ').trim(),
      },
    })),
  };

  return (
    <section aria-labelledby="faq-section-heading" className={`relative mb-6 p-2 sm:p-2 ${className}`}>
      <JsonLd json={faqSchema} />

      {/* Header */}

      <h2 id="faq-section-heading" className="">
        Frequently asked questions and purchase guidance for {product.name}.
      </h2>

      {/* LLM & Screen Reader Context */}
      <div className="sr-only">Frequently asked questions and purchase guidance for {product.name}.</div>

      {/* Semantic Question/Answer List */}
      <dl className="space-y-3.5">
        {productFaqs.map((f, index) => (
          <div
            key={`${f.q}-${index}`}
            className="bg-surface/95 rounded-2xl p-4 shadow-sm transition-[transform,box-shadow] duration-150 ease-out will-change-transform sm:p-5"
          >
            <dt className="text-foreground flex items-start gap-2 text-sm leading-snug font-semibold sm:text-base">
              <span className="font-bold select-none" aria-hidden="true">
                Q.
              </span>
              <span>{f.q}</span>
            </dt>
            <dd className="text-foreground/85 mt-2.5 border-l-2 pl-5 text-xs leading-relaxed sm:pl-6 sm:text-sm">
              {f.a}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
