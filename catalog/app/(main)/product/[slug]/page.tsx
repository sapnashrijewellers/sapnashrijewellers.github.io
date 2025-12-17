import { Metadata } from "next";
import type { Product } from "@/types/catalog";
import products from "@/data/products.json";
import categories from "@/data/categories.json";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/product/ProductGallery";
import ProductShare from "@/components/product/ProductShare";
import { HighlightsTabs } from "@/components/product/Highlights";
import WhatsappClick from "@/components/product/WhatAppClick";
import Image from "next/image"
import Breadcrumb from "@/components/navbar/BreadcrumbItem";


const baseURL = process.env.BASE_URL;
const driveURL = `${baseURL}/img/products/optimized/`;

export async function generateStaticParams() {
  return products
    .filter((p: Product) => p.active && p.slug.length >= 5)
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
  const title = `${product.name} | ${product.metaDescription} by Sapna Shri Jewellers`;
  const description = `${product.metaDescription}`;
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
    description: `${product.metaDescription}`,
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
const category = categories.find(c=> c.name===product.category);
  return (
<div>
<Breadcrumb items={[{ name: "Home", href: "/" }, { name: product.category, href:`/category/${category?.slug}` },{name:product.name}]} />
   <Image
        src={`${process.env.BASE_URL}/static/img/before-buy-banner.png`}
        alt="Points to consider before you buy jewellery"
        className="object-cover text-center items-center justify-center w-full h-full"
        loading="eager"
        title="Points to consider before you buy jewellery"
        height="500"
        width="500"
      />
    <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-6 py-6 px-3">
     
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldjson) }}
      />
      {/* ✅ Client-side gallery */}
      <ProductGallery product={product} />

      {/* ✅ Product Details */}
      <div className="p-2">
        <h1 className="text-2xl md:text-3xl mb-2 font-cinzel text-primary-dark font-semibold">{product.name}</h1>

        <div className="space-y-1 mb-4">
          <p>
            Purity: {product.purity}
          </p>
          <p>
            Weight: {product.weight} g
          </p>
        </div>

        {/* Contact */}
        <WhatsappClick product={product} />
        {/* Highlights Tabs */}
        <HighlightsTabs product={product} />



      </div>

      {/* Share */}
      <ProductShare product={product} />
    </div>
    </div>
  );
}
