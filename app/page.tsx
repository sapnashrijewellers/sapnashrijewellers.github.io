import type { Metadata } from 'next';
import RotatingBanner from '@/components/banners/RotatingBanner';
import JewelleryTypeBar from '@/components/home/ShopByPurpose';
import SignatureCollections from '@/components/home/SignatureCollections';
import buildBusinessJsonLd from '@/utils/json-ld/buildBusinessJsonLd';
import TrustSignalsRibbon from '@/components/product/TrustSignalsRibbon';
import HomeCategoryBar from '@/components/home/ShopByCategory';
import HomeFaq from '@/components/home/HomeFaq';
import FeaturedJewellery from '@/components/common/FeaturedJewellery';
import WishlistBar from '@/components/common/WishlistBar';
import TestimonialScroller from '@/components/common/Testimonials';
import RecentlyViewedBar from '@/components/common/RecentlyViewedBar';
import JsonLd from '@/components/common/JsonLd';
const baseURL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://sapnashrijewellers.in').replace(/\/+$/, '');
const imageUrl = `${baseURL}/icon-512x512.png`;

const title = 'Sapna Shri Jewellers Nagda | Latest Gold & Silver Jewellery Collection';
const description =
  'Explore the latest handcrafted gold and silver jewellery at Sapna Shri Jewellers Nagda. 35+ years of trust with 100% BIS 916 Hallmark certified purity.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: baseURL,
    type: 'website',
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: 'Sapna Shri Jewellers Nagda - Official Store',
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
    canonical: `${baseURL}/`,
  },
};

export default function Home() {
  const jsonLd = buildBusinessJsonLd();

  return (
    <main className="container mx-auto max-w-7xl px-4 py-4">
      <JsonLd json={jsonLd} />
      <RotatingBanner />
      <JewelleryTypeBar />
      <HomeCategoryBar />
      <WishlistBar />
      <FeaturedJewellery />
      <TrustSignalsRibbon />
      <SignatureCollections />
      <RecentlyViewedBar />
      <TestimonialScroller />

      <HomeFaq />
    </main>
  );
}
