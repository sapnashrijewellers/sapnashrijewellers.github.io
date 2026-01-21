import type { Category, Product } from "@/types/catalog";
import Link from "next/link";
import Image from "next/image";

export default function CategoryCard({ category, products, }: {
  category: Category; products: Product[];
}) {

  if (!products || products.length === 0) return null;

const baseURL = process.env.BASE_URL;

  const firstProduct = products[0];
  const cardHighlightClass = firstProduct.newArrival
    ? "shadow-md hover:shadow-xl"
    : "shadow hover:shadow-lg";

  return (
    <Link
      href={`/category/${category.slug}/`} title={`${category.name}`}
      className="block transition-transform duration-300 hover:scale-105 rounded-2xl"
      prefetch={false} // optional: skip prefetch for large catalogs
    >
      <div className={` flex flex-col h-full bg-card ${cardHighlightClass} rounded-2xl`}>
        
        <div className="relative w-full overflow-hidden grow pt-[100%]">
          {

            firstProduct.newArrival && (
              <div
                className="
                absolute top-2 left-2 z-10 bg-accent
                text-xs px-2 py-1 
                rounded-full shadow-lg transform -rotate-3">
                ✨ NEW
              </div>
            )}
          <Image
            src={`${baseURL}/static/img/products/thumbnail/${firstProduct.images[0]}`}
            alt={firstProduct.name}
            className="absolute inset-0 w-full h-full object-cover rounded-t-2xl"            
            title={firstProduct.name}
            priority={false}
            fill
          />
        </div>
        <h2 className="p-3 text-center font-yatra">
          {category.name}
        </h2>
      </div>
    </Link>
  );
}
