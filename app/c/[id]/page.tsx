import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Product, Collection } from '@/types/catalog';
import products from '@/data/products.json';
import collections from '@/data/collections.json';
import Breadcrumb from '@/components/navbar/BreadcrumbItem';
import { buildCollectionPageJsonLd } from '@/utils/json-ld/buildCollectionPageJsonLd';
import JsonLd from '@/components/common/JsonLd';
import RotatingBanner from '@/components/banners/RotatingBanner';
import SEO from '@/components/common/SEO';
import JewelryTypeClient from '../../jt/[id]/JewelryTypeClient';
import RecentlyViewedBar from '@/components/common/RecentlyViewedBar';
import WishlistBar from '@/components/common/WishlistBar';
import FeaturedJewellery from '@/components/common/FeaturedJewellery';
import JewelleryTypeBar from '@/components/home/ShopByPurpose';
import ShopByCategory from '@/components/home/ShopByCategory';

interface CollectionPageProps {
  params: Promise<{ id: string }>;
}

const baseURL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://sapnashrijewellers.in').replace(/\/+$/, '');
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

  const filtered = products.filter((p: Product) => p.collection === collection.name);

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
      type: 'website',
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
      card: 'summary_large_image',
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
  const collection = collections.find((cat: Collection) => cat.id === Number(id) && cat.active);

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
    <main className="container mx-auto max-w-7xl px-4 py-4">
      <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: collection.name }]} />

      <JsonLd json={JsonLdObj} />

      <header className="my-6 border-l-4 pl-4">
        <h2 className="">
          {collection.name}{' '}
          <span className="text-muted-foreground font-sans text-xl font-normal md:text-2xl">| {collection.title}</span>
        </h2>
        {collection.description && (
          <p className="text-muted-foreground/90 mt-2 max-w-4xl text-sm leading-relaxed sm:text-base">
            {collection.description}
          </p>
        )}
      </header>

      <section aria-label={`${collection.name} featured banners`} className="mb-4">
        <RotatingBanner key={collection.id} />
      </section>

      <JewelryTypeClient products={filtered} pFilters={{ material: `${collection.material}` }} className="py-4" />

      <FeaturedJewellery className="py-2" />

      <RecentlyViewedBar />

      <WishlistBar />
      <JewelleryTypeBar />
      <ShopByCategory />
      {/* 6. Contextual SEO Content */}
      <aside aria-label="Related collection searches and information">
        <SEO slug={`/collections/${id}`} />
      </aside>
    </main>
  );
}
