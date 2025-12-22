import { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Type } from "@/types/catalog";
import products from "@/data/products.json";
import types from "@/data/types.json";
import Breadcrumb from "@/components/navbar/BreadcrumbItem";
import JewelryTypeClient from "./JewelryTypeClient";
import { buildJewelryTypePageJsonLd } from "@/utils/buildJewelryTypePageJsonLd";
import JsonLd from "@/components/common/JsonLd";

const baseURL = process.env.BASE_URL!;


export async function generateStaticParams() {
  return types.filter(t => t.active).map(t => ({
    slug: t.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = types.find(t => t.slug === slug);
  if (!t) return {};  

  const imageUrl = `${baseURL}/logo.png`;
  
  return {
    title: `${t.type} jewelry collection by Sapna Shri Jewellers`,
    description: t.description,
    keywords: t.keywords,
    alternates: {
      canonical: `${baseURL}/jewelry-type/${slug}`,
    },
    openGraph: {
      title: t.type,
      description: t.description,
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
 
  const JsonLdObj = buildJewelryTypePageJsonLd(
      baseProducts,
      t      
    );

  return (
    <div className="container mx-auto">
      <Breadcrumb items={[
        { name: "Home", href: "/" },
        { name: t.type }
      ]} />

      <JsonLd json={JsonLdObj} />

      <div className="pl-4 border-l-4 border-primary/70 mb-4">
        <h1 className="text-3xl font-yatra font-bold">
          {t.type} jewellery collection
        </h1>
        <p className="font-playfair text-muted-foreground">
          {t.description}
        </p>
      </div>

      <JewelryTypeClient products={baseProducts} />
    </div>
  );
}
