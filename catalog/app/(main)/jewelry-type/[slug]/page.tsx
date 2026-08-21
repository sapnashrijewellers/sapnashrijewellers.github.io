import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Type } from "@/types/catalog";
import products from "@/data/products.json";
import types from "@/data/types.json";
import Breadcrumb from "@/components/navbar/BreadcrumbItem";
import JewelryTypeClient from "./JewelryTypeClient";
import { buildJewelryTypePageJsonLd } from "@/utils/buildJewelryTypePageJsonLd";
import JsonLd from "@/components/common/JsonLd";

interface JewelryTypePageProps {
  params: Promise<{ slug: string }>;
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://sapnashrijewellers.in";
const driveURL = `${baseURL}/static/img/products/optimized/`;

export async function generateStaticParams() {
  return types
    .filter((t) => t.active)
    .map((t) => ({
      slug: t.slug,
    }));
}

// ---- METADATA (Search Engines & Social Crawlers) ----
export async function generateMetadata({ params }: JewelryTypePageProps): Promise<Metadata> {
  const { slug } = await params;
  const t = types.find((typeItem) => typeItem.slug === slug);
  if (!t) return {};

  const matchingProducts = products.filter(
    (p) => p.type?.includes(t.type) && p.active && p.images?.length > 0
  );

  const title = `${t.type} Jewellery Collection | Sapna Shri Jewellers Nagda`;
  const description =
    t.description ||
    `Explore handcrafted ${t.type} jewelry in gold and silver with authentic BIS hallmark certification at Sapna Shri Jewellers Nagda.`;

  const imageUrl =
    matchingProducts.length > 0 && matchingProducts[0].images?.[0]
      ? `${driveURL}${matchingProducts[0].images[0]}`
      : `${baseURL}/icons/android-chrome-512x512.png`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseURL}/jewelry-type/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${baseURL}/jewelry-type/${slug}`,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: `${t.type} jewelry collection at Sapna Shri Jewellers`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

// ---- MAIN PAGE COMPONENT ----
export default async function JewelryTypePage({ params }: JewelryTypePageProps) {
  const { slug } = await params;
  const t = types.find((typeItem: Type) => typeItem.slug === slug && typeItem.active);

  if (!t) {
    notFound();
  }

  // Filter and sort items (available items prioritized first)
  const baseProducts = products
    .filter((p) => p.type?.includes(t.type) && p.active)
    .sort((a, b) => Number(b.available) - Number(a.available));

  const JsonLdObj = buildJewelryTypePageJsonLd(baseProducts, t);

  return (
    <main className="container mx-auto px-4 py-4 max-w-7xl">
      {/* 1. Breadcrumbs */}
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: t.type },
        ]}
      />

      {/* 2. Structured Data Schema */}
      <JsonLd json={JsonLdObj} />

      {/* 3. Collection Header Information */}
      <header className="pl-4 border-l-4 border-primary/70 my-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-yatra font-bold text-primary">
          {t.type} jewellery collection
        </h1>
        {t.description && (
          <p className="mt-2 text-sm sm:text-base text-muted-foreground/90 leading-relaxed max-w-4xl">
            {t.description}
          </p>
        )}
      </header>

      {/* 4. Client-side Interactive Filter & Grid */}
      <JewelryTypeClient products={baseProducts} />
    </main>
  );
}