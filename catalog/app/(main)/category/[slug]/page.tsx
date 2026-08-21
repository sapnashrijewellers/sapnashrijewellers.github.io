import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Product, Category } from "@/types/catalog";
import products from "@/data/products.json";
import categories from "@/data/categories.json";
import ProductCard from "@/components/product/ProductCard";
import Breadcrumb from "@/components/navbar/BreadcrumbItem";
import { buildCategoryPageJsonLd } from "@/utils/buildCategoryPageJsonLd";
import JsonLd from "@/components/common/JsonLd";
import RotatingBanner from "@/components/banners/RotatingBanner";
import SEO from "@/components/common/SEO";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://sapnashrijewellers.in";
const driveURL = `${baseURL}/static/img/products/optimized/`;

export async function generateStaticParams() {
  return categories
    .filter((c) => c.active)
    .map((cat: Category) => ({
      slug: cat.slug,
    }));
}

// ---- METADATA (Search Engines & Social Crawlers) ----
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((cat: Category) => cat.slug === slug);

  if (!category) return {};

  const filtered = products.filter(
    (p: Product) => p.category === category.name);

  const title = `${category.name} - ${category.title} | Sapna Shri Jewellers Nagda`;
  const description = category.description;

  const imageUrl =
    filtered.length > 0 && filtered[0].images?.[0]
      ? `${driveURL}${filtered[0].images[0]}`
      : `${baseURL}/android-chrome-512x512.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseURL}/category/${slug}`,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: `${category.name} collection at Sapna Shri Jewellers`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseURL}/category/${slug}`,
    },
  };
}

// ---- MAIN CATEGORY PAGE ----
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categories.find(
    (cat: Category) => cat.slug === slug && cat.active
  );

  if (!category) {
    notFound();
  }

  // Sort available products first for better UX & immediate availability signals
  const filtered = products
    .filter((p: Product) => p.category === category.name && p.active)
    .sort((a: Product, b: Product) => {
      if (a.available && !b.available) return -1;
      if (!a.available && b.available) return 1;
      return 0;
    });

  const JsonLdObj = buildCategoryPageJsonLd(filtered, category);

  return (
    <main className="container mx-auto px-4 py-4 max-w-7xl">
      {/* 1. Breadcrumbs */}
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: category.name },
        ]}
      />

      {/* 2. Structured Data Schema */}
      <JsonLd json={JsonLdObj} />

      {/* 3. Category Header Information */}
      <header className="pl-4 border-l-4 border-primary/70 my-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-yatra font-bold text-primary">
          {category.name} <span className="font-sans text-xl md:text-2xl font-normal text-muted-foreground">| {category.title}</span>
        </h1>
        {category.description && (
          <p className="mt-2 text-sm sm:text-base text-muted-foreground/90 leading-relaxed max-w-4xl">
            {category.description}
          </p>
        )}
      </header>

      {/* 4. Promotional/Category Rotating Banner */}
      <section aria-label={`${category.name} featured banners`} className="mb-8">
        <RotatingBanner key={category.slug} page={category.slug} />
      </section>

      {/* 5. Product Grid / Catalog listing */}
      <section
        aria-label={`${category.name} collection`}
        className="my-8"
      >
        {filtered.length === 0 ? (
          <div
            role="status"
            aria-live="polite"
            className="py-16 text-center text-muted-foreground text-lg bg-surface/50 rounded-2xl border border-dashed border-theme"
          >
            <p>इस श्रेणी में वर्तमान में कोई उत्पाद उपलब्ध नहीं है।</p>
          </div>
        ) : (
          <ul
            role="list"
            aria-label={`${category.name} products list`}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 list-none p-0"
          >
            {filtered.map((p: Product, idx: number) => (
              <li key={p.id || p.slug || idx} className="flex justify-stretch">
                <ProductCard product={p} priority={idx < 4} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 6. Contextual SEO Content */}
      <aside aria-label="Related category searches and information">
        <SEO slug={`/categories/${slug}`} />
      </aside>
    </main>
  );
}