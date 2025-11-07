import CategoryCard from "../components/CategoryCard";
import data from "../data/data.json";

const title = `Sapna Shri Jewellers`;
const description = `Explore out latest products at Sapna Shri Jewellers Nagda. High-quality gold & silver jewellery with BIS 916 certification.`;
const baseURL = "https://sapnashrijewellers.github.io";
const driveURL = `${baseURL}/static/img/optimized/`;
const imageUrl = `${baseURL}/logo.png`;
const keywords = data.sub_categories.slice(0, 10).join(", ");

export async function generateMetadata() {


  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: baseURL,
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
      canonical: baseURL,
    },
  };

}

export default function Home() {
  const ldjson = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Sapna Shri Jewellers`,
    "description": description,
    "url": baseURL,
    "mainEntity": Object.values(data.categorizedProducts)
      .flat()
      .slice(0, 20) // optionally limit for performance
      .map(product => ({
        "@type": "Product",
        "name": product.name,
        "image": `${driveURL}${product.images[0]}`,
        "url": `${baseURL}/product/${product.id}`
      }))
  };
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* ✅ JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ldjson) }}
      />
      <p className="text-center mb-6">
        Discover our exclusive categories of gold & silver jewellery.
        High-quality craftsmanship with BIS 916 certification.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {data.sub_categories.map(categoryName => {
          const productsForCategory = data.categorizedProducts[categoryName] || [];
          if (productsForCategory.length === 0) {
            return null;
          }

          return (
            <CategoryCard
              key={categoryName}
              category={categoryName}
              products={productsForCategory}
            />
          );
        })}
      </div>
    </div>
  );
}