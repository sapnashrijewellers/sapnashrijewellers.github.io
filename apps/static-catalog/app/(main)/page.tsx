import type { NewCatalog } from "@/types/catalog";
import CategoryCard from "@/components/CategoryCard";
import dataRaw from "@/data/catalog.json";

const data = dataRaw as NewCatalog;

const title = `Sapna Shri Jewellers`;
const description = `Explore out latest products at Sapna Shri Jewellers Nagda. High-quality gold & silver jewellery with BIS 916 certification.`;
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const driveURL = `${baseURL}/static/img/optimized/`;
const imageUrl = `${baseURL}/logo.png`;
const keywords = "Sapna Shri Jewellers Nagda. High-quality gold & silver jewellery with BIS 916 certification";

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
  return (
    <div className="container mx-auto">
      <p className="text-center mb-6">
        Discover our exclusive categories of gold & silver jewellery.
        High-quality craftsmanship with BIS 916 certified gold.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {data.categories.map(cat => {
          const productsForCategory = data.products.filter(p=> p.category==cat.name) || [];
          if (productsForCategory.length === 0) {            
            return null;
          }
          

          return (
            <CategoryCard
              key={cat.name}
              category={cat}
              products={productsForCategory}
            />
          );
        })}
      </div>
    </div>
  );
}