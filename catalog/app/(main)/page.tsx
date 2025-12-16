import CategoryCard from "@/components/CategoryCard";
import categories from "@/data/categories.json";
import products from "@/data/products.json";
import RotatingBanner from "@/components/banners/RotatingBanner";


//const categories = dataRaw as NewCatalog;

const title = `Sapna Shri Jewellers`;
const description = `Explore out latest products at Sapna Shri Jewellers Nagda. High-quality gold & silver jewellery with BIS 916 certification.`;
const baseURL = process.env.BASE_URL;
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
      <div className="mb-6">
        <RotatingBanner />
      </div>      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {categories.sort((a, b) => a.rank - b.rank).map(cat => {
          const productsForCategory = products.filter(p => p.category == cat.name) || [];
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