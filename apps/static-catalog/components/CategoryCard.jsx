// components/CategoryCard.jsx
import Link from "next/link";
import { toSlugKeepUnicode } from "../utils/slug";

export default function CategoryCard({ category, products }) {
  if (!products || products.length === 0) return null;

  const driveURL = "https://sapnashrijewellers.github.io/static/img/thumbnail/";
  const firstProduct = products[0]; // use static first product for SSG / SEO

  // Highlight if the first product is a new arrival
  const cardHighlightClass = firstProduct.newArrival
    ? "border-2 border shadow-md hover:shadow-xl bg-accent text-primary-dark"
    : "border border-border shadow hover:shadow-lg";

  return (
    <Link      
      href={`/category/${toSlugKeepUnicode(category)}`}
      className="block transition-transform duration-300 hover:scale-105"
      prefetch={false} // optional: skip prefetch for large catalogs
    >
      <div
        className={`rounded-2xl flex flex-col h-full bg-card text-primary ${cardHighlightClass}`}
      >
        {/* Category Name */}
        <h2 className="p-3 text-center">
          {category}
        </h2>

        {/* Static image area */}
        <div className="relative w-full overflow-hidden flex-grow pt-[100%]">
          {firstProduct.newArrival && (
            <div
              className="
                absolute top-2 left-2 z-10 bg-accent
                text-primary text-xs px-2 py-1
                rounded-full shadow-lg transform -rotate-3
              "
            >
              ✨ NEW ARRIVAL
            </div>
          )}

          {/* Use only first product image for SSG & SEO */}
          <img
            src={`${driveURL}${firstProduct.images[0]}`}
            alt={firstProduct.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Static info */}
        <div className="p-3">
          <div className="flex justify-between text-normal text-sm">
            <span>{firstProduct.purity}</span>
            <span className="">{firstProduct.weight} gm</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
