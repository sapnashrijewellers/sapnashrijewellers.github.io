// ✅ Server Component
import Calculator from "@/components/Calculator";
import Breadcrumb from "@/components/navbar/BreadcrumbItem";
import { Suspense } from "react";


const title = `ज्वेलरी प्राइस कैलकुलेटर`;
const description = `ज्वेलरी प्राइस कैलकुलेटर | online Jewellery Price Calculator by Sapna Shri Jewellers`;
const baseURL = process.env.BASE_URL;
const imageUrl = `${baseURL}/icons/android-chrome-512x512.png`;
const ldjson = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": title,
  "url": `${baseURL}/calculator`,
  "description": description,
  "publisher": {
    "@type": "JewelryStore",
    "name": "Sapna Shri Jewellers Nagda",
    "image": `${baseURL}/icons/android-chrome-512x512.png`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Railway Station Main Road, Near Jain Mandir",
      "addressLocality": "Nagda",
      "addressRegion": "Ujjain",
      "postalCode": "456335",
      "addressCountry": "IN"
    },
    "telephone": "+91-8234042231"
  },
  "mainEntity": {
    "@type": "ComputeAction",
    "name": "Estimate Jewellery Price",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${baseURL}/calculator`
    }
  }
};

export async function generateMetadata() {
  return {
    title,
    description,    
    openGraph: {
      title,
      description,
      url: `${baseURL}/calculator`,
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
      canonical: `${baseURL}/calculator`,
    },
  };

}
function CalculatorSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-muted rounded w-1/3" />
      <div className="h-64 bg-muted rounded" />
      <div className="h-10 bg-muted rounded" />
    </div>
  );
}

export default async function CalculatorPage() {
  return (
    <div className="">
      <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Calculator" }]} />
      {/* ✅ JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldjson) }}
      />

      <h1 className="text-2xl mb-6 text-primary-dark font-cinzel ">
        Estimate Jewellery Price
      </h1>

      <Suspense fallback={<CalculatorSkeleton />}>
        <Calculator />
      </Suspense>
    </div>
  );
}
