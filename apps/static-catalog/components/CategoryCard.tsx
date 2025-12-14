import type { Category, Product } from "@/types/catalog";
import Link from "next/link";
import Image from "next/image";




export default function CategoryCard({
  category,
  products,
}: {
  category: Category;
  products: Product[];
}) {
  
  if (!products || products.length === 0) return null;

  const driveURL = `${process.env.NEXT_PUBLIC_BASE_URL}/img/products/thumbnail/`;
  const firstProduct = products[0]; // use static first product for SSG / SEO
//console.log("products:",firstProduct.images[0]);
  // Highlight if the first product is a new arrival
  const cardHighlightClass = firstProduct.newArrival
    ? "shadow-md hover:shadow-xl bg-accent text-primary-dark"
    : "shadow hover:shadow-lg";

  return (
    <Link
      href={`/category/${category.slug}`} title={`${category.name}`}
      className="block transition-transform duration-300 hover:scale-105"
      prefetch={false} // optional: skip prefetch for large catalogs
    >
      <div
        className={` flex flex-col h-full bg-card text-primary ${cardHighlightClass}`}
      >
        {/* Category Name */}
        <h2 className="p-3 text-center text-normal">
          {category.name}
        </h2>

        {/* Static image area */}
        <div className="relative w-full overflow-hidden flex-grow pt-[100%]">
          {
            
          firstProduct.newArrival && (
            <div
              className="
                absolute top-2 left-2 z-10 bg-accent
                text-normal text-xs px-2 py-1 
                rounded-full shadow-lg transform -rotate-3">
              ✨ NEW ARRIVAL
            </div>
          )}

          {/* Use only first product image for SSG & SEO */}
          <Image
            src={`/img/products/thumbnail/${firstProduct.images[0]}`}
            alt={firstProduct.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"            
            title={firstProduct.name}
            fill
          />
        </div>
      </div>
    </Link>
  );
}
