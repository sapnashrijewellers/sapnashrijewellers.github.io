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
import ProductRating from "@/components/product/ProductRating";
import WishListBar from "@/components/product/WishlistBar";
import ProductRatingInput from "@/components/product/ProductRatingInput";
import JsonLd from "@/components/common/JsonLd";
import { buildProductJsonLd } from "@/utils/buildProductJsonLd";
import formatPurity from "@/utils/utils.js";
import NewArrivals from "@/components/product/NewArrivals";
import YouMAyAlsoLike from "@/components/product/YouMayAlsoLike";

const baseURL = process.env.BASE_URL;
const driveURL = `${baseURL}/img/products/optimized/`;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = await params;
  const product = products.find((p: Product) => p.slug === slug.slug && p.active);

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


export async function generateStaticParams() {
  return products
    .filter((p: Product) => p.active
      && p.slug.length >= 5
      && p.category.length > 3
      && p.active
      && p.weight > 0)
    .map((p: Product) => ({
      slug: p.slug
    }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = products.find(
    (p: Product) =>
      p.active &&
      p.slug === slug
  );

  if (!product) notFound();
  
  const productJsonLd = buildProductJsonLd(
    product
  );
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
        <JsonLd json={productJsonLd} />

        {/* ---------------- Product Gallery ---------------- */}
        <div className="relative">
          <ProductGallery product={product} />

          {/* ❤️ Wishlist — overlay */}
          <div className="absolute top-3 right-3 z-10">
            <WishlistButton slug={product.slug} />
          </div>
        </div>

        {/* ---------------- Product Details ---------------- */}
        <div className="">
          {/* Title + Share */}
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl md:text-3xl font-cinzel text-primary-dark font-semibold mb-1">
              {product.name}
            </h1>
          </div>
          <ProductRating
            rating={product.rating ?? 4.6}
            count={product.ratingCount ?? 12}
            showExpert={true}
          />

          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              Rate this jewellery
            </p>
            <ProductRatingInput
              productId={product.id}
            />
          </div>
          {!product.available && (
            <div className="inline-flex items-center gap-2 rounded-full bg-surface text-primary-dark px-3 py-1 my-2 text-xs font-medium border ">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Made to Order · Available on Request
            </div>
          )}


          <ProductShare product={product} />
          {/* Description */}
          <p className="text-muted-foreground py-2">
            {product.description}
          </p>

          {/* Key Specs + Hallmark */}
          <div className="flex items-center justify-between mt-3 mb-3">
            {/* Left: Key Specs */}
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Purity:</span> {formatPurity(product.purity)}
              </p>
              <p><span className="font-medium">Weight:</span> {product.weight} g</p>
            </div>

            {/* Right: Hallmark Certification */}
            {product.purity.toLowerCase().startsWith("gold") && product.weight > 2 && (
              <div className="flex flex-col items-center w-30" title="100% Hallmark certified!!">
                <Image
                  src={`${baseURL}/static/img/hallmark.png`}
                  height={60}
                  width={60}
                  alt="BIS Hallmark"
                />
                <span className="text-xs mt-1 text-center">BIS Hallmark Certified</span>
              </div>
            )}
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
      <NewArrivals products={products} />
      <YouMAyAlsoLike product={product} products={products} />

      <WishListBar />

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
