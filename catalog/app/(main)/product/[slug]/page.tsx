import { Metadata } from "next";
import type { Product } from "@/types/catalog";
import products from "@/data/products.json";
import categories from "@/data/categories.json";
import { notFound } from "next/navigation";
import ProductShare from "@/components/product/ProductShare";
import { HighlightsTabs } from "@/components/product/Highlights";
import ProductGallery from "@/components/product/ProductGallery";
import WhatsappClick from "@/components/product/WhatAppClick";
import CalculatePrice from "@/components/product/CalculatePriceButton";
import Image from "next/image"
import Breadcrumb from "@/components/navbar/BreadcrumbItem";
import WishlistButton from "@/components/common/WishlistButton";


const baseURL = process.env.BASE_URL;
const driveURL = `${baseURL}/img/products/optimized/`;

export async function generateStaticParams() {
  return products
    .filter((p: Product) => p.active && p.slug.length >= 5
      && p.active
      && p.weight > 0)
    .map((p: Product) => ({
      slug: p.slug
    }));
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = await params;
  const product = products.find(
    (p: Product) => p.slug === slug.slug
  );

  if (!product) return {};

  const baseProductUrl = `${baseURL}/product/${product.slug}`;
  const title = `${product.name} by Sapna Shri Jewellers`;
  const description = `${product.description}`;
  const imageUrl = `${driveURL}${product.images?.[0]}`;
  const keywords = product.keywords;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: baseProductUrl,
      type: "website",
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: baseProductUrl,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find(
    (p: Product) => p.slug === slug && p.active
  );

  if (!product) {
    return notFound();
  }

  const baseProductUrl = `${baseURL}/product/${product.slug}`;


  const ldjson = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images[0],
    description: `${product.description}`,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Sapna Shri Jewellers",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: 10,
      availability: "https://schema.org/InStock",
      url: baseProductUrl,
    },
  };
  const category = categories.find(c => c.name === product.category);
  return (
    <div>
  <Breadcrumb
    items={[
      { name: "Home", href: "/" },
      { name: product.category, href: `/category/${category?.slug}` },
      { name: product.name },
    ]}
  />

  <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-6 py-6 px-3">
    {/* SEO */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ldjson) }}
    />

    {/* ---------------- Product Gallery ---------------- */}
    <div className="relative">
      <ProductGallery product={product} />

      {/* ❤️ Wishlist — overlay */}
      <div className="absolute top-3 right-3 z-10">
        <WishlistButton slug={product.slug} />
      </div>
    </div>

    {/* ---------------- Product Details ---------------- */}
    <div className="p-2 space-y-4">
      {/* Title + Share */}
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-cinzel text-primary-dark font-semibold">
          {product.name}
        </h1>

        
      </div>
<ProductShare product={product} />
      {/* Description */}
      <p className="text-muted-foreground">
        {product.description}
      </p>

      {/* Key Specs */}
      <div className="text-sm space-y-1">
        <p><span className="font-medium">Purity:</span> {product.purity}</p>
        <p><span className="font-medium">Weight:</span> {product.weight} g</p>
      </div>

      {/* Primary Actions */}
      <div className="space-y-3 pt-2">
        <WhatsappClick product={product} />
        <CalculatePrice product={product} />
      </div>

      {/* Highlights */}
      <HighlightsTabs product={product} />
    </div>
  </div>

  {/* ---------------- Trust Banner (Moved Below) ---------------- */}
  <div className="max-w-6xl mx-auto px-3 pb-6">
    <Image
      src={`${process.env.BASE_URL}/static/img/before-buy-banner.png`}
      alt="Points to consider before you buy jewellery"
      title="Points to consider before you buy jewellery"
      className="object-cover w-full rounded-lg"
      loading="lazy"
      width={1200}
      height={400}
    />
  </div>
</div>

  );
}
