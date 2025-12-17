import { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Product, Type } from "@/types/catalog";
import products from "@/data/products.json";
import types from "@/data/types.json";
import Breadcrumb from "@/components/navbar/BreadcrumbItem";
import JewelryTypeClient from "./JewelryTypeClient";

const baseURL = process.env.BASE_URL!;
const driveURL = `${baseURL}/static/img/products/thumbnail/`;

export async function generateStaticParams() {
  return types.filter(t => t.active).map(t => ({
    slug: t.slug,
  }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const t = types.find(t => t.slug === params.slug);
  if (!t) return {};

  const filtered = products.filter(p => p.type.includes(t.type));

  const imageUrl =
    filtered.length > 0
      ? `${driveURL}${filtered[0].images[0]}`
      : `${baseURL}/logo.png`;

  return {
    title: `${t.type} jewelry collection by Sapna Shri Jewellers`,
    description: t.metaDescription,
    keywords: t.keywords,
    alternates: {
      canonical: `${baseURL}/jewelry-type/${params.slug}`,
    },
    openGraph: {
      title: t.type,
      description: t.metaDescription,
      images: [{ url: imageUrl }],
    },
  };
}

export default async  function JewelryTypePage(
  { params }: { params: { slug: string } }
) {
    const { slug } = await params;
    const t = types.find(
        (t: Type) => t.slug === slug && t.active
    );
     if (!t) notFound();

  const baseProducts = products
    .filter(p => p.type.includes(t.type) && p.active)
    .sort((a, b) =>
      Number(b.available) - Number(a.available)
    );

  const ldjson = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${t.type} by Sapna Shri Jewellers`,
    description: t.metaDescription,
    url: `${baseURL}/jewelry-type/${params.slug}`,
    mainEntity: baseProducts.map(p => ({
      "@type": "Product",
      name: p.name,
      image: `${driveURL}${p.images[0]}`,
      url: `${baseURL}/product/${p.slug}`,
    })),
  };

  return (
    <div className="container mx-auto">
      <Breadcrumb items={[
        { name: "Home", href: "/" },
        { name: t.type }
      ]} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldjson) }}
      />

      <div className="pl-4 border-l-4 border-primary/70 mb-4">
        <h1 className="text-3xl font-yatra font-bold">
          {t.type} collection
        </h1>
        <p className="font-playfair text-muted-foreground">
          {t.metaDescription}
        </p>
      </div>

      <JewelryTypeClient products={baseProducts} />
    </div>
  );
}
