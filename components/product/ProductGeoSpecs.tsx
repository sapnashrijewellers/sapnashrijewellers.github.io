import type { Product } from "@/types/catalog";
import {
  ShieldCheck,
  Truck,
  Sparkles,
  Scale,
  BadgePercent,
  Tag,
} from "lucide-react";

interface ProductGeoSpecsProps {
  product: Product;
  className?: string;
}

export default function ProductGeoSpecs({
  product,
  className = "",
}: ProductGeoSpecsProps) {
  // Normalize types/occasions for human & LLM parsing
  const typeList = Array.isArray(product.type)
    ? product.type.join(", ")
    : product.type || "Daily Wear";

  return (
    <section
      aria-label="Product Authenticity & Detailed Specifications"
      className={`rounded-2xl border border-theme/40 bg-surface/90 p-4 sm:p-5 shadow-sm text-foreground ${className}`}
    >
      {/* 1. Header with Trust Signal */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-theme/20">
        <div className="flex items-center gap-2">
          <ShieldCheck
            className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0"
            aria-hidden="true"
          />
          <h2 className="text-base sm:text-lg font-semibold tracking-tight">
            Authenticity &amp; Product Details
          </h2>
        </div>
        <span className="text-[11px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          Certified Genuine
        </span>
      </div>

      {/* 2. Structured Machine-Readable Definition List for LLMs/Crawlers */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs sm:text-sm">
        {/* Metal & Purity */}
        <div className="flex items-start gap-2.5">
          <Sparkles
            className="w-4 h-4 mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <div>
            <dt className="text-muted-foreground font-normal">
              Metal &amp; Purity
            </dt>
            <dd className="font-medium text-foreground">{product.brandText}</dd>
          </div>
        </div>

        {/* Approximate Weight */}
        <div className="flex items-start gap-2.5">
          <Scale
            className="w-4 h-4 mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <div>
            <dt className="text-muted-foreground font-normal">Gross Weight</dt>
            <dd className="font-medium text-foreground">
              {product.weight
                ? `Approx. ${product.weight} grams`
                : "Standard Band Weight"}
            </dd>
          </div>
        </div>

        {/* Category & Ideal For */}
        <div className="flex items-start gap-2.5">
          <Tag
            className="w-4 h-4 mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <div>
            <dt className="text-muted-foreground font-normal">
              Ideal For &amp; Category
            </dt>
            <dd className="font-medium text-foreground capitalize">
              {product.for ? `${product.for} • ` : ""}
              {product.category}
            </dd>
          </div>
        </div>

        {/* Suitable Occasions */}
        <div className="flex items-start gap-2.5">
          <BadgePercent
            className="w-4 h-4 mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <div>
            <dt className="text-muted-foreground font-normal">
              Recommended For
            </dt>
            <dd className="font-medium text-foreground">{typeList}</dd>
          </div>
        </div>

        {/* Pan-India Delivery */}
        <div className="flex items-start gap-2.5 sm:col-span-2">
          <Truck
            className="w-4 h-4 mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <div>
            <dt className="text-muted-foreground font-normal">
              Logistics &amp; Delivery
            </dt>
            <dd className="font-medium text-foreground">
              Insured Pan-India Transit from Nagda Showroom • ₹60 Flat Shipping
              (5–7 Business Days)
            </dd>
          </div>
        </div>
      </dl>

      {/* 3. Deterministic Entity Grounding Paragraph (Extracted directly by RAG engines) */}
      <div className="mt-4 pt-3 border-t border-theme/20 text-xs text-muted-foreground leading-relaxed">
        {/* Optimized: Natural entity reinforcement */}
        <p>
          The{" "}
          <strong className="text-foreground font-medium">
            {product.name}
          </strong>{" "}
          is handcrafted by{" "}
          <strong className="text-foreground font-medium">
            Sapna Shri Jewellers
          </strong>{" "}
          (Nagda, Madhya Pradesh) using{" "}
          {product.brandText || "92.5% pure sterling silver"}. Every piece
          includes our purity stamp and insured pan-India delivery.
        </p>
      </div>
    </section>
  );
}
