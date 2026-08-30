import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Product } from "@/types/catalog";
import products from "@/data/products.json";
import categories from "@/data/categories.json";
import ProductShare from "@/components/product/ProductShare";
import { HighlightsTabs } from "@/components/product/Highlights";
import ProductGallery from "@/components/product/ProductGallery";
import OrderViaWhatsappButton from "@/components/product/OrderViaWhatsappButton";
import Breadcrumb from "@/components/navbar/BreadcrumbItem";
import ProductRating from "@/components/product/ProductRating";
import WishListBar from "@/components/common/WishlistBar";
import ProductRatingInput from "@/components/product/ProductRatingInput";
import NewArrivals from "@/components/product/NewArrivals";
import YouMAyAlsoLike from "@/components/product/YouMayAlsoLike";
import TestimonialScroller from "@/components/common/Testimonials";
import TrustSignalsRibbon from "@/components/product/TrustSignalsRibbon";
import CareInstructions from "@/components/product/CareInstructions";
import BulkEnquiry from "@/components/product/BulkEnquiry";
import JewelleryTypeBar from "@/components/home/JewelleryType";
import Tooltip from "@/components/common/Tooltip";
import ProductSelection from "@/components/product/ProductSelection";
import StoreAvailability from "@/components/product/StoreAvailability";
import FAQ from "@/components/product/FAQ";
import buildProductJsonLd from "@/utils/buildProductJsonLd";
import ProductChatbot from "@/components/product/ProductChatbot";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://sapnashrijewellers.in";
const driveURL = `${baseURL}/static/img/products/optimized/`;

export async function generateStaticParams() {
  return products
    .map((p: Product) => ({
      id: p.id.toString(),
    }));
}

// ---- METADATA (Search Engines, Social Media & Crawlers) ----
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p: Product) => p.id === Number(id) && p.active);

  if (!product) return {};

  const baseProductUrl = `${baseURL}/p/${product.id}/`;
  const title = `${product.name}`;
  const description = product.description;

  const primaryImageUrl = product.images?.[0]
    ? `${driveURL}${product.images[0]}`
    : `${baseURL}/icons/icon-512x512.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: baseProductUrl,
      type: "website",
      images: [
        {
          url: primaryImageUrl,
          secureUrl: primaryImageUrl,
          type: "image/webp",
          width: 800,
          height: 800,
          alt: `${product.name} - Sapna Shri Jewellers`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [primaryImageUrl],
    },
    alternates: {
      canonical: baseProductUrl,
    },
  };
}

// ---- MAIN PRODUCT DETAIL PAGE ----
export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  const product = products.find((p: Product) => p.active && p.id === Number(id));

  if (!product) {
    notFound();
  }

  const category = categories.find((c) => c.name === product.category);

  // Schema.org Structured Data for LLMs and Google Rich Results
  const productSchema = buildProductJsonLd(product);

  return (
    <main className="container mx-auto px-4 py-4 max-w-7xl">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* 1. Breadcrumbs */}
      <Breadcrumb
        items={[
          { name: "Home", href: "/" },
          {
            name: product.category,
            href: `/c/${category?.id}/`,
          },
          { name: product.name },
        ]}
      />

      {/* 2. Product Hero Section (Gallery + Details) */}
      <section aria-labelledby="product-title" className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-8 py-6">
        {/* Left Column: Gallery & Instant CTA */}
        <div className="space-y-4 md:sticky md:top-20 self-start">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Product images</span>
              <Tooltip text="Product appearance may vary slightly due to photographic lighting." />
            </div>

            <ProductGallery product={product} />
            <ProductChatbot product={product} />
          </div>

          <OrderViaWhatsappButton product={product} />
        </div>

        {/* Right Column: Key Details, Customization & Highlights */}
        <div className="space-y-5">
          <header className="space-y-2">
            <h1 id="product-title" className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight">
              {product.name}
            </h1>

            <div aria-label="Customer ratings and reviews">
              <ProductRating
                rating={product.rating ?? 4.6}
                count={product.ratingCount ?? 12}
                showExpert
              />
            </div>
          </header>

          <ProductSelection product={product} />

          {product.description && (
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>
          )}

          <HighlightsTabs product={product} />

          <ProductShare product={product} />

          {/* User Review / Interactive Rating */}
          <section aria-label="Submit jewellery rating" className="pt-2 min-h-[72px] border-t border-theme/30">
            <p className="text-xs font-medium text-muted-foreground mb-1">Rate this jewellery</p>
            <ProductRatingInput productId={product.id} />
          </section>

          <StoreAvailability />
        </div>
      </section>

      {/* 3. Auxiliary Information Sections */}
      <section aria-label="Trust signals and guarantees">
        <TrustSignalsRibbon product={product} />
      </section>

      <section aria-label="Frequently asked questions about this product">
        <FAQ product={product} />
      </section>

      <section aria-label="Bulk purchase and custom order enquiry">
        <BulkEnquiry product={product} />
      </section>

      <section aria-label="Jewellery care instructions">
        <CareInstructions careKey={product.care} />
      </section>

      {/* 4. Social Proof & Recommendations */}
      <TestimonialScroller />
      <WishListBar />

      <aside aria-label="Recommended and related products">
        <YouMAyAlsoLike product={product} products={products} />
        <NewArrivals product={product} />
        <JewelleryTypeBar />
      </aside>

      {/* 5. Trust / Pre-purchase Guidance Banner
      <section aria-label="Important points before purchasing jewellery" className="max-w-6xl mx-auto py-8">
        <div className="relative w-full aspect-[3/1] overflow-hidden rounded-2xl border border-theme/40 shadow-sm">
          <Image
            src={`${baseURL}/static/img/before-buy-banner.webp`}
            alt="Important points to consider before you buy jewellery at Sapna Shri Jewellers Nagda"
            title="Points to consider before you buy jewellery"
            fill
            sizes="(max-width: 1200px) 100vw, 1152px"
            className="object-cover"
            loading="lazy"
          />
        </div>
      </section> */}
    </main>
  );
}