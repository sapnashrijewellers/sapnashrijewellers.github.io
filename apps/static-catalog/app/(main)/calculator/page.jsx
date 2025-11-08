// ✅ Server Component
import Calculator from "@/components/Calculator";

const title = `ज्वेलरी प्राइस कैलकुलेटर`;
  const description = `ज्वेलरी प्राइस कैलकुलेटर | online Jewellery Price Calculator by Sapna Shri Jewellers`;
  const baseURL = "https://sapnashrijewellers.github.io";
  const imageUrl = `${baseURL}/logo.png`;
  const keywords = "ज्वेलरी प्राइस कैलकुलेटर, Jewellery price calculator, 22K gold jewellery price calculator, Silver jewellery price";
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

  export async function generateMetadata() {
    return {
      title,
      description,
      keywords,
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

export default async function CalculatorPage() {
  const res = await fetch("https://sapnashrijewellers.github.io/static/rates.json", {
    next: { revalidate: 60 },
  });
  const rates = await res.json();

  

  return (
    <div className="max-w-lg mx-auto p-6 bg-card text-card-foreground shadow-lg rounded-2xl">
      {/* ✅ JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldjson) }}
      />     

      <h1 className="text-2xl mb-6 text-center text-primary">
        ज्वेलरी प्राइस कैलकुलेटर
      </h1>

      <Calculator rates={rates} />
    </div>
  );
}
