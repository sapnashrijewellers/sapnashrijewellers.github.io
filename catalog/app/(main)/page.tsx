import type { Metadata } from "next";
import RotatingBanner from "@/components/banners/RotatingBanner";
import JewelleryTypeBar from "@/components/home/JewelleryType";
import TestimonialScroller from "@/components/common/Testimonials";
import SignatureCollections from "@/components/home/SignatureCollections";
import NewArrivals from "@/components/product/NewArrivals";
import WishlistBar from "@/components/common/WishlistBar";

import categories from "@/data/categories.json";
import products from "@/data/products.json";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://sapnashrijewellers.in";
const imageUrl = `${baseURL}/android-chrome-512x512.png`;

const title = "Sapna Shri Jewellers Nagda | Latest Gold & Silver Jewellery Collection";
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
    canonical: baseURL,
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "JewelryStore",
        "@id": `${baseURL}/#store`,
        name: "Sapna Shri Jewellers",
        alternateName: "सपना श्री ज्वेलर्स",
        url: baseURL,
        logo: imageUrl,
        image: imageUrl,
        description,
        telephone: "+91-8234042231",
        priceRange: "₹₹₹",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Railway Station Main Road, Near Jain Mandir",
          addressLocality: "Nagda",
          addressRegion: "Madhya Pradesh",
          postalCode: "456335",
          addressCountry: "IN",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${baseURL}/#website`,
        url: baseURL,
        name: "Sapna Shri Jewellers",
        potentialAction: {
          "@type": "SearchAction",
          target: `${baseURL}/search/?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <main className="container mx-auto px-4 py-4 max-w-7xl">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Accessible Screen-Reader Page Heading */}
      <h1 className="sr-only">
        सपना श्री ज्वेलर्स नागदा - सोने एवं चांदी के आभूषण (Sapna Shri Jewellers Nagda)
      </h1>

      {/* 1. Hero Promotional Rotating Banner (Top LCP Element) */}
      <section aria-label="Featured promotions and announcements" className="mb-6">
        <RotatingBanner page="home" />
      </section>

      {/* 2. Quick Category / Jewellery Type Navigation */}
      <section aria-label="Jewellery categories by type" className="my-6">
        <JewelleryTypeBar home={false} />
      </section>

      {/* 3. User Wishlist Bar */}
      <WishlistBar />

      {/* 4. New Arrivals Showcase */}
      <section aria-label="New jewellery arrivals" className="my-8">
        <NewArrivals products={products} />
      </section>

      {/* 5. Customer Testimonials & Social Proof */}
      <section aria-label="Customer reviews and ratings" className="my-8">
        <TestimonialScroller />
      </section>

      {/* 6. Signature Curated Collections */}
      <section aria-label="Signature jewellery collections" className="my-8">
        <SignatureCollections categories={categories} products={products} />
      </section>
    </main>
  );
}