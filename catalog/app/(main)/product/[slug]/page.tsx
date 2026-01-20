import { Metadata } from "next";
import type { Product } from "@/types/catalog";
import products from "@/data/products.json";
import categories from "@/data/categories.json";
import { notFound } from "next/navigation";
import ProductShare from "@/components/product/ProductShare";
import { HighlightsTabs } from "@/components/product/Highlights";
import ProductGallery from "@/components/product/ProductGallery";
import WhatsappClick from "@/components/product/WhatAppClick";
import Image from "next/image"
import Breadcrumb from "@/components/navbar/BreadcrumbItem";
import ProductRating from "@/components/product/ProductRating";
import WishListBar from "@/components/common/WishlistBar";
import ProductRatingInput from "@/components/product/ProductRatingInput";
import JsonLd from "@/components/common/JsonLd";
import buildProductJsonLd from "@/utils/buildProductJsonLd";
import formatPurity from "@/utils/utils.js";
import NewArrivals from "@/components/product/NewArrivals";
import YouMAyAlsoLike from "@/components/product/YouMayAlsoLike";
import TestimonialScroller from "@/components/common/Testimonials"
import TrustSignalsRibbon from "@/components/product/TrustSignalsRibbon";
import CareInstructions from "@/components/product/CareInstructions";
import ProductSizeSelector from "@/components/product/ProductSizeSelector";
import BulkEnquiry from "@/components/product/BulkEnquiry";
import ProductPrice from "@/components/product/ProductPrice";
import JewelleryTypeBar from "@/components/home/JewelleryType";
import DisclaimerTooltip from "@/components/common/DisclaimerTooltip";
import ProductSelection from "@/components/product/ProductSelection"




const baseURL = process.env.BASE_URL;
const driveURL = `${baseURL}/static/img/products/thumbnail/`;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = await params;
  const product = products.find((p: Product) => p.slug === slug.slug && p.active);

  if (!product) return {};

  const baseProductUrl = `${baseURL}/product/${product.slug}`;
  const title = `${product.name} | ${product.hindiName} | by Sapna Shri Jewellers`;
  const description = `${product.description}`;
  const imageUrl = `${driveURL}${product.images?.[0]}`;  

  return {
    title,
    description,    
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
    <div className="container mx-auto">
      <JsonLd json={productJsonLd} />
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          { name: product.category, href: `/category/${category?.slug}` },
          { name: `${product.name} | ${product.hindiName}` },
        ]}
      />

      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-6 py-6 px-3">
        <div className="space-y-3 md:sticky md:top-20 self-start">
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs text-muted">
              <span>Product images</span>
              <DisclaimerTooltip
                text="Product appearance may vary slightly due to lighting and photography."
              />
            </div>

            <ProductGallery product={product} />
          </div>

          <WhatsappClick product={product} />
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-semibold">
            {product.name} | {product.hindiName}
          </h1>
          <ProductRating
            rating={product.rating ?? 4.6}
            count={product.ratingCount ?? 12}
            showExpert
          />
          <ProductSelection product={product} />

          {/* Specs + Hallmark */}
          <div className="flex items-center justify-between border-t border-theme pt-3">
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Purity:</span>{" "}
                {formatPurity(product.purity)}
              </p>

              <div className="flex items-center gap-1">
                <span className="font-medium">Weight:</span>
                <span>{product.weight} g</span>

                
              </div>

              {product.brandText && product.brandText.length > 2 && (
                <p>
                  <span className="font-medium">Brand:</span> {product.brandText}
                </p>
              )}
            </div>
            {((product.purity.toLowerCase().startsWith("gold") && product.weight > 2) || (product.HUID)) && (
              <div className="flex flex-col items-center w-28">
                <Image
                  src={`${baseURL}/static/img/hallmark.png`}
                  height={56}
                  width={56}
                  alt="BIS Hallmark"
                />
                <span className="text-xs mt-1 text-center">BIS Hallmark</span>
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {product.description}
          </p>
          
          <HighlightsTabs product={product} />

          <ProductShare product={product} />

          <div className="pt-2 min-h-[72px]">
            <p className="text-xs text-muted-foreground">Rate this jewellery</p>
            <ProductRatingInput productId={product.id} />
          </div>
        </div>
      </div>

      <TrustSignalsRibbon product={product} />
      <BulkEnquiry product={product} />
      <CareInstructions careKey={product.care} />

      <TestimonialScroller />
      <WishListBar />
      <YouMAyAlsoLike product={product} products={products} />
      <NewArrivals products={products} product={product} />
      <JewelleryTypeBar />

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
          sizes="100vw"
        />
      </div>
    </div>

  );
}
