import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Product } from '@/types/catalog';
import products from '@/data/products.json';
import collections from '@/data/collections.json';
import ProductShare from '@/components/product/ProductShare';
import { HighlightsTabs } from '@/components/product/Highlights';
import ProductGallery from '@/components/product/ProductGallery';
import OrderViaWhatsappButton from '@/components/product/OrderViaWhatsappButton';
import Breadcrumb from '@/components/navbar/BreadcrumbItem';
import ProductRating from '@/components/product/ProductRating';
import WishListBar from '@/components/common/WishlistBar';
import ProductRatingInput from '@/components/product/ProductRatingInput';
import FeaturesJewellery from '@/components/common/FeaturedJewellery';
import YouMAyAlsoLike from '@/components/product/YouMayAlsoLike';
import TrustSignalsRibbon from '@/components/product/TrustSignalsRibbon';
import CareInstructions from '@/components/product/CareInstructions';
import BulkEnquiry from '@/components/product/BulkEnquiry';
import Tooltip from '@/components/common/Tooltip';
import StoreAvailability from '@/components/product/StoreAvailability';
import FAQ from '@/components/product/FAQ';
import buildProductJsonLd from '@/utils/json-ld/buildProductJsonLd';
import ProductGeoSpecs from '@/components/product/ProductGeoSpecs';
import ProductViewTracker from '@/components/product/ProductViewTracker';
import RecentlyViewedBar from '@/components/common/RecentlyViewedBar';
import JsonLd from '@/components/common/JsonLd';
import ProductPrice from '@/components/product/ProductPrice';

import dynamic from 'next/dynamic';

const ProductChatbot = dynamic(() => import('@/components/product/ProductChatbot'));

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

const baseURL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://sapnashrijewellers.in').replace(/\/+$/, '');

const driveURL = `${baseURL}/static/img/products/optimized/`;

export async function generateStaticParams() {
  return products.map((p: Product) => ({
    id: p.id.toString(),
  }));
}

// ---- METADATA ----

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  const product = products.find((p: Product) => p.id === Number(id) && p.active);

  if (!product) return {};

  const baseProductUrl = `${baseURL}/p/${product.id}/`;
  const title = `${product.name}`;
  const description = product.description;

  const primaryImageUrl = product.images?.[0] ? `${driveURL}${product.images[0]}` : `${baseURL}/icon-512x512.png`;

  return {
    title,
    description,

    openGraph: {
      title,
      description,
      url: baseProductUrl,
      type: 'article',
      images: [
        {
          url: primaryImageUrl,
          secureUrl: primaryImageUrl,
          type: 'image/webp',
          width: 800,
          height: 800,
          alt: `${product.name} - ${product.brandText} - Sapna Shri Jewellers`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
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

  const collection = collections.find((c) => c.name === product.collection);

  const productSchema = buildProductJsonLd(product);

  return (
    <main className="container mx-auto max-w-7xl px-4 py-4">
      <JsonLd json={productSchema} />

      {/* ------------------------------------------------------------
          1. BREADCRUMB
      ------------------------------------------------------------ */}

      <Breadcrumb
        items={[
          { name: 'Home', href: '/' },
          {
            name: product.collection,
            href: `/c/${collection?.id}/`,
          },
          { name: product.name },
        ]}
      />

      {/* ------------------------------------------------------------
          2. MOBILE PRODUCT IDENTITY
          Name + Rating + PRICE are intentionally together at the top.
      ------------------------------------------------------------ */}

      <header className="block space-y-2 pt-3 pb-2 md:hidden">
        <h1 id="product-title-mobile" className="text-foreground text-xl leading-tight font-semibold sm:text-2xl">
          {product.name}
        </h1>

        <div aria-label="Customer ratings and reviews">
          <ProductRating rating={product.rating ?? 4.6} count={product.ratingCount ?? 12} showExpert />
        </div>

        {/* PRICE DISCOVERY — immediately after product identity */}
        <ProductPrice product={product} />
      </header>

      {/* ------------------------------------------------------------
          3. PRODUCT HERO
      ------------------------------------------------------------ */}

      <section
        aria-labelledby="product-title-desktop"
        className="mx-auto grid w-full max-w-6xl gap-6 py-3 md:grid-cols-2 md:gap-8 md:py-6"
      >
        {/* ============================================================
            LEFT COLUMN
            Gallery
        ============================================================ */}

        <div className="space-y-4 self-start md:sticky md:top-20">
          <div className="space-y-2">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <span>Product images</span>

              <Tooltip text="Product appearance may vary slightly due to photographic lighting." />
            </div>

            <ProductGallery product={product} />
          </div>
        </div>

        {/* ============================================================
            RIGHT COLUMN
            Product decision / qualification area
        ============================================================ */}

        <div className="space-y-5">
          {/* ----------------------------------------------------------
              DESKTOP PRODUCT IDENTITY + PRICE
          ---------------------------------------------------------- */}

          <header className="hidden space-y-2 md:block">
            <h1 id="product-title-desktop" className="text-foreground text-2xl leading-tight font-semibold sm:text-3xl">
              {product.name}
            </h1>

            <div aria-label="Customer ratings and reviews">
              <ProductRating rating={product.rating ?? 4.6} count={product.ratingCount ?? 12} showExpert />
            </div>

            {/* PRICE IMMEDIATELY AFTER PRODUCT IDENTITY */}
            <ProductPrice product={product} />
          </header>

          {/* ----------------------------------------------------------
              PRIMARY PURCHASE SUPPORT
          ---------------------------------------------------------- */}

          <OrderViaWhatsappButton product={product} />

          {/* ----------------------------------------------------------
              PRODUCT QUALIFICATION
          ---------------------------------------------------------- */}

          <ProductGeoSpecs product={product} />

          <TrustSignalsRibbon product={product} />

          <HighlightsTabs product={product} />

          {/* ----------------------------------------------------------
              PRODUCT DESCRIPTION
          ---------------------------------------------------------- */}

          <section aria-label="Product description">
            <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">{product.description}</p>
          </section>

          {/* ----------------------------------------------------------
              SHARE + RATING
          ---------------------------------------------------------- */}

          <ProductShare product={product} />

          <section aria-label="Submit jewellery rating" className="border-theme/30 min-h-[72px] border-t pt-2">
            <p className="text-muted-foreground mb-1 text-xs font-medium">Rate this jewellery</p>

            <ProductRatingInput productId={product.id} />
          </section>
        </div>
      </section>

      {/* ==============================================================
          4. SECONDARY PRODUCT INFORMATION
      ============================================================== */}

      <section aria-label="Bulk purchase and custom order enquiry" className="m-2">
        <BulkEnquiry product={product} />
      </section>

      <section aria-label="Jewellery care instructions" className="m-2">
        <CareInstructions careKey={product.care} />
      </section>

      <section aria-label="Frequently asked questions about this product" className="m-2">
        <FAQ product={product} />
      </section>

      {/* ==============================================================
          5. USER PERSONALIZATION
      ============================================================== */}

      <WishListBar />

      <ProductViewTracker productId={product.id} />

      <RecentlyViewedBar />

      {/* ==============================================================
          6. LOW-PRIORITY SUPPORT / STORE INFORMATION
          These remain available but no longer interrupt the
          primary purchase decision.
      ============================================================== */}

      <section
        aria-label="Store availability and product assistance"
        className="mx-auto mt-6 grid max-w-6xl gap-4 md:grid-cols-2"
      >
        <StoreAvailability />

        <ProductChatbot product={product} />
      </section>

      {/* ==============================================================
          7. PRODUCT DISCOVERY
          Kept intact, but deliberately pushed to the bottom.
      ============================================================== */}

      <aside aria-label="Recommended and related products" className="mt-8">
        <YouMAyAlsoLike product={product} products={products} />

        <FeaturesJewellery />
      </aside>
    </main>
  );
}
