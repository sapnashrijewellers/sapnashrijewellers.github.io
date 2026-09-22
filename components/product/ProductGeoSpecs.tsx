import type { Product } from '@/types/catalog';
import { ShieldCheck, Truck, Sparkles, Scale, BadgePercent, Tag } from 'lucide-react';

interface ProductGeoSpecsProps {
  product: Product;
  className?: string;
}

export default function ProductGeoSpecs({ product, className = '' }: ProductGeoSpecsProps) {
  // Normalize types/occasions for human & LLM parsing
  const typeList = Array.isArray(product.type) ? product.type.join(', ') : product.type || 'Daily Wear';

  return (
    <section
      aria-label="Product Authenticity & Detailed Specifications"
      className={`bg-surface/90 text-foreground rounded-2xl p-3 shadow-sm ${className}`}
    >
      {/* 1. Header with Trust Signal */}
      <div className="border-theme/20 mb-4 flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
          <h3>Authenticity &amp; Product Details</h3>
        </div>
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800 sm:text-xs">
          Certified Genuine
        </span>
      </div>

      {/* 2. Structured Machine-Readable Definition List for LLMs/Crawlers */}
      <dl className="grid grid-cols-1 gap-x-6 gap-y-3.5 text-xs sm:grid-cols-2 sm:text-sm">
        {/* Metal & Purity */}
        <div className="flex items-start gap-2.5">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div>
            <dt className="text-muted-foreground font-normal">Metal &amp; Purity</dt>
            <dd className="text-foreground font-medium">{product.brandText}</dd>
          </div>
        </div>

        {/* Approximate Weight */}
        <div className="flex items-start gap-2.5">
          <Scale className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div>
            <dt className="text-muted-foreground font-normal">Gross Weight</dt>
            <dd className="text-foreground font-medium">
              {product.weight ? `Approx. ${product.weight} grams` : 'Standard Band Weight'}
            </dd>
          </div>
        </div>

        {/* Collection & Ideal For */}
        <div className="flex items-start gap-2.5">
          <Tag className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div>
            <dt className="text-muted-foreground font-normal">Ideal For</dt>
            <dd className="text-foreground font-medium capitalize">
              {product.for ? `${product.for} • ` : ''}
              {product.collection}
            </dd>
          </div>
        </div>

        {/* Suitable Occasions */}
        <div className="flex items-start gap-2.5">
          <BadgePercent className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div>
            <dt className="text-muted-foreground font-normal">Recommended For</dt>
            <dd className="text-foreground font-medium">{typeList}</dd>
          </div>
        </div>

        {/* Pan-India Delivery */}
        <div className="flex items-start gap-2.5 sm:col-span-2">
          <Truck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div>
            <dt className="text-muted-foreground font-normal">Logistics &amp; Delivery</dt>
            <dd className="text-foreground font-medium">
              Insured Pan-India Transit from Nagda Showroom • ₹60 Flat Shipping (5–7 Business Days)
            </dd>
          </div>
        </div>
      </dl>

      {/* 3. Deterministic Entity Grounding Paragraph (Extracted directly by RAG engines) */}
      <div className="border-theme/20 text-muted-foreground mt-4 border-t pt-3 text-xs leading-relaxed">
        {/* Optimized: Natural entity reinforcement */}
        <p>
          The <strong className="text-foreground font-medium">{product.name}</strong> is handcrafted by{' '}
          <strong className="text-foreground font-medium">Sapna Shri Jewellers</strong> (Nagda, Madhya Pradesh) using{' '}
          {product.brandText || '92.5% pure sterling silver'}. Every piece includes our purity stamp and insured
          pan-India delivery.
        </p>
      </div>
    </section>
  );
}
