import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Type } from '@/types/catalog';
import products from '@/data/products.json';
import types from '@/data/types.json';
import Breadcrumb from '@/components/navbar/BreadcrumbItem';
import JewelryTypeClient from './JewelryTypeClient';
import { buildJewelryTypePageJsonLd } from '@/utils/json-ld/buildJewelryTypePageJsonLd';
import JsonLd from '@/components/common/JsonLd';
import SEO from '@/components/common/SEO';
import FeaturedJewellery from '@/components/common/FeaturedJewellery';
import RecentlyViewedBar from '@/components/common/RecentlyViewedBar';
import WishlistBar from '@/components/common/WishlistBar';

interface JewelryTypePageProps {
  params: Promise<{ id: string }>;
}

const baseURL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://sapnashrijewellers.in').replace(/\/+$/, '');
const driveURL = `${baseURL}/static/img/products/optimized/`;

export async function generateStaticParams() {
  return types
    .filter((t) => t.active)
    .map((t) => ({
      id: t.id.toString(),
    }));
}

// ---- METADATA (Search Engines & Social Crawlers) ----
export async function generateMetadata({ params }: JewelryTypePageProps): Promise<Metadata> {
  const { id } = await params;
  const t = types.find((typeItem) => typeItem.id === Number(id));
  if (!t) return {};

  const matchingProducts = products.filter((p) => p.type?.includes(t.type) && p.active && p.images?.length > 0);

  const title = `${t.type}`;
  const description =
    t.description ||
    `Explore handcrafted ${t.type} jewelry in gold and silver with authentic BIS hallmark certification at Sapna Shri Jewellers Nagda.`;

  const imageUrl =
    matchingProducts.length > 0 && matchingProducts[0].images?.[0]
      ? `${driveURL}${matchingProducts[0].images[0]}`
      : `${baseURL}/icons/icon-512x512.png`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseURL}/jt/${id}/`,
    },
    openGraph: {
      title,
      description,
      url: `${baseURL}/jt/${id}/`,
      type: 'website',
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
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

// ---- MAIN PAGE COMPONENT ----
export default async function JewelryTypePage({ params }: JewelryTypePageProps) {
  const { id } = await params;
  const t = types.find((typeItem: Type) => typeItem.id === Number(id) && typeItem.active);

  if (!t) {
    notFound();
  }

  // Filter and sort items (available items prioritized first)
  const baseProducts = products
    .filter((p) => p.type?.includes(t.type) && p.active)
    .sort((a, b) => Number(b.available) - Number(a.available));

  const JsonLdObj = buildJewelryTypePageJsonLd(baseProducts, t);

  return (
    <main className="container mx-auto max-w-7xl px-4 py-4">
      <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: t.type }]} />

      <JsonLd json={JsonLdObj} />

      <header className="border-primary/70 my-6 border-l-4 pl-4">
        <h2 className="">{t.type}</h2>
        {t.description && (
          <p className="text-muted-foreground/90 mt-2 max-w-4xl text-sm leading-relaxed sm:text-base">
            {t.description}
          </p>
        )}
      </header>

      <JewelryTypeClient products={baseProducts} className="py-4" />
      <FeaturedJewellery />
      <RecentlyViewedBar />
      <WishlistBar />

      <aside aria-label="Related collection searches and information">
        <SEO slug={`/jewelry-type/${id}`} />
      </aside>
    </main>
  );
}
