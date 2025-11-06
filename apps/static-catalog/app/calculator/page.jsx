// ✅ Server Component
import Calculator from "@/components/Calculator";
import IndianRupeeRate from "@/components/IndianRupeeRate";
import { renderSEOTags } from "@/utils/SEO";

export default async function CalculatorPage() {
  const res = await fetch("https://sapnashrijewellers.github.io/static/rates.json", {
    next: { revalidate: 60 },
  });
  const rates = await res.json();

  const title = `ज्वेलरी प्राइस कैलकुलेटर`;
const description = `ज्वेलरी प्राइस कैलकुलेटर | online Jewellery Price Calculator by Sapna Shri Jewellers`;
const baseURL = "https://sapnashrijewellers.github.io";
const imageUrl = `${baseURL}/logo.png`;
const ldjson = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": title,
  "url": `${baseURL}/calculator`,
  "description": description,
  "publisher": {
    "@type": "JewelryStore",
    "name": "Sapna Shri Jewellers Nagda",
    "image": `${baseURL}/logo.png`,
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
    "name": "Jewellery Price Calculator",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${baseURL}/calculator`
    }
  }
};

  return (
    <div className="max-w-lg mx-auto p-6 bg-card text-card-foreground shadow-lg rounded-2xl">
      {renderSEOTags(
        title,
        description,
        imageUrl,
        `${baseURL}/calculator`,
        "ज्वेलरी प्राइस कैलकुलेटर, Jewellery price calculator, 22K gold jewellery price calculator, Silver jewellery price",
        ldjson
      )}

      <h2 className="text-2xl font-bold mb-6 text-center text-accent">
        ज्वेलरी प्राइस कैलकुलेटर
      </h2>

      <Calculator rates={rates} />
    </div>
  );
}
