import type { Metadata } from "next";
import RotatingBanner from "@/components/banners/RotatingBanner";
import JewelleryTypeBar from "@/components/home/JewelleryType";
import SignatureCollections from "@/components/home/SignatureCollections";
import buildBusinessJsonLd from "@/utils/json-ld/buildBusinessJsonLd";
import TrustSignalsRibbon from "@/components/product/TrustSignalsRibbon";
import HomeCategoryBar from "@/components/home/HomeCategoriesBar";
import HomeFaq from "@/components/home/HomeFaq";
import HeritageStory from "@/components/home/HeritageStory";
import FeaturedJewellery from "@/components/common/FeaturedJewellery";
import WishlistBar from "@/components/common/WishlistBar";
const baseURL = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://sapnashrijewellers.in"
).replace(/\/+$/, "");
const imageUrl = `${baseURL}/icon-512x512.png`;

const title =
  "Sapna Shri Jewellers Nagda | Latest Gold & Silver Jewellery Collection";
const description =
  "Explore the latest handcrafted gold and silver jewellery at Sapna Shri Jewellers Nagda. 35+ years of trust with 100% BIS 916 Hallmark certified purity.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: baseURL,
    type: "website",
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: "Sapna Shri Jewellers Nagda - Official Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
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
    <main className="container mx-auto px-4 py-4 max-w-7xl">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RotatingBanner />
      <JewelleryTypeBar />      
      <HomeCategoryBar />
      <WishlistBar />
      <FeaturedJewellery />            
      <TrustSignalsRibbon />
      <SignatureCollections  />
      <HeritageStory />
      <HomeFaq />
    </main>
  );
}
