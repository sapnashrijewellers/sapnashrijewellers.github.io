import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Product, Category } from "@/types/catalog";
import products from "@/data/products.json";
import categories from "@/data/categories.json";
import Breadcrumb from "@/components/navbar/BreadcrumbItem";
import { buildCategoryPageJsonLd } from "@/utils/buildCategoryPageJsonLd";
import JsonLd from "@/components/common/JsonLd";
import RotatingBanner from "@/components/banners/RotatingBanner";
import SEO from "@/components/common/SEO";
import JewelryTypeClient from "../../jt/[id]/JewelryTypeClient";

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://sapnashrijewellers.in";
const driveURL = `${baseURL}/static/img/products/optimized/`;

export async function generateStaticParams() {
  return categories
    .filter((c) => c.active)
    .map((cat: Category) => ({
      id: cat.id.toString(),
    }));
}

// ---- METADATA (Search Engines & Social Crawlers) ----
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { id } = await params;  
  const category = categories.find((cat: Category) => cat.id === Number(id));

  if (!category) return {};

  const filtered = products.filter(
    (p: Product) => p.category === category.name);

  const title = `${category.name} - ${category.title}`;
  const description = category.description;

  const imageUrl =
    filtered.length > 0 && filtered[0].images?.[0]
      ? `${driveURL}${filtered[0].images[0]}`
      : `${baseURL}/icon-512x512.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseURL}/c/${id}`,
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
      canonical: `${baseURL}/c/${id}`,
    },
  };
}

// ---- MAIN CATEGORY PAGE ----
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const category = categories.find(
    (cat: Category) => cat.id === Number(id) && cat.active
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
        <RotatingBanner key={category.id} page={String(category.id)} />
      </section>

      {/* 5. Product Grid / Catalog listing */}
      {/* 4. Client-side Interactive Filter & Grid */}
      <JewelryTypeClient products={filtered} />
      {/* 6. Contextual SEO Content */}
      <aside aria-label="Related category searches and information">
        <SEO slug={`/categories/${id}`} />
      </aside>
    </main>
  );
}