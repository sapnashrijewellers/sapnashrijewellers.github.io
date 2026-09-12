import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Product, Collection } from "@/types/catalog";
import products from "@/data/products.json";
import collections from "@/data/collections.json";
import Breadcrumb from "@/components/navbar/BreadcrumbItem";
import { buildCollectionPageJsonLd } from "@/utils/json-ld/buildCollectionPageJsonLd";
import JsonLd from "@/components/common/JsonLd";
import RotatingBanner from "@/components/banners/RotatingBanner";
import SEO from "@/components/common/SEO";
import JewelryTypeClient from "../../jt/[id]/JewelryTypeClient";

interface CollectionPageProps {
  params: Promise<{ id: string }>;
}

const baseURL = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://sapnashrijewellers.in"
).replace(/\/+$/, "");
const driveURL = `${baseURL}/static/img/products/optimized/`;

export async function generateStaticParams() {
  return collections
    .filter((c) => c.active)
    .map((cat: Collection) => ({
      id: cat.id.toString(),
    }));
}

// ---- METADATA (Search Engines & Social Crawlers) ----
export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { id } = await params;  
  const collection = collections.find((cat: Collection) => cat.id === Number(id));

  if (!collection) return {};

  const filtered = products.filter(
    (p: Product) => p.collection === collection.name);

  const title = `${collection.name} - ${collection.title}`;
  const description = collection.description;

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
      url: `${baseURL}/c/${id}/`,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: `${collection.name} collection at Sapna Shri Jewellers`,
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
      canonical: `${baseURL}/c/${id}/`,
    },
  };
}

// ---- MAIN collection PAGE ----
export default async function collectionPage({ params }: CollectionPageProps) {
  const { id } = await params;
  const collection = collections.find(
    (cat: Collection) => cat.id === Number(id) && cat.active
  );

  if (!collection) {
    notFound();
  }

  // Sort available products first for better UX & immediate availability signals
  const filtered = products
    .filter((p: Product) => p.collection === collection.name && p.active)
    .sort((a: Product, b: Product) => {
      if (a.available && !b.available) return -1;
      if (!a.available && b.available) return 1;
      return 0;
    });

  const JsonLdObj = buildCollectionPageJsonLd(filtered, collection);

  return (
    <main className="container mx-auto px-4 py-4 max-w-7xl">
      {/* 1. Breadcrumbs */}
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: collection.name },
        ]}
      />

      {/* 2. Structured Data Schema */}
      <JsonLd json={JsonLdObj} />

      {/* 3. collection Header Information */}
      <header className="pl-4 border-l-4 border-primary/70 my-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-yatra font-bold">
          {collection.name} <span className="font-sans text-xl md:text-2xl font-normal text-muted-foreground">| {collection.title}</span>
        </h1>
        {collection.description && (
          <p className="mt-2 text-sm sm:text-base text-muted-foreground/90 leading-relaxed max-w-4xl">
            {collection.description}
          </p>
        )}
      </header>

      {/* 4. Promotional/collection Rotating Banner */}
      <section aria-label={`${collection.name} featured banners`} className="mb-8">
        <RotatingBanner key={collection.id}/>
      </section>

      {/* 5. Product Grid / Catalog listing */}
      {/* 4. Client-side Interactive Filter & Grid */}
      <JewelryTypeClient products={filtered} pFilters={{ material: `${collection.material}` }} />
      {/* 6. Contextual SEO Content */}
      <aside aria-label="Related collection searches and information">
        <SEO slug={`/collections/${id}`} />
      </aside>
    </main>
  );
}