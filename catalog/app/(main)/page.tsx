import CategoryCard from "@/components/home/CategoryCard";
import categories from "@/data/categories.json";
import RotatingBanner from "@/components/banners/RotatingBanner";
import JewelleryTypeBar from "@/components/home/JewelleryType"
import type { Product } from "@/types/catalog";
import products from "@/data/products.json";
import ProductCard from "@/components/product/ProductCard";

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

const newArrivals = products
  .filter(p => p.active && p.newArrival)
  .sort((a, b) => Number(b.available) - Number(a.available))
  .slice(0.15);
export default function Home() {
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <RotatingBanner />
      </div>
      <div>
        <h2 className="text-2xl p-2">Jewellery for Every Occasion</h2>
        <JewelleryTypeBar />
      </div>
      <div>
        {newArrivals.length > 0 ? (
          <div className="relative">
            <h2 className="text-2xl p-2">New Arrivals</h2>
            <div className=" flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
              {newArrivals.map((p: Product) => (
                <div key={p.id} className="flex-shrink-0 w-[160px] sm:w-[200px] lg:w-[220px] snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>) : <div></div>}
      </div>
      <div>
        <h2 className="text-2xl p-2">Our Signature Collections</h2>
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
    </div>
  );
}