import Link from "next/link";
import {toSlug} from "../utils/slug"
export default function ProductCard({ product }) {
  const driveURL = `${process.env.NEXT_PUBLIC_BASE_URL}/static/img/thumbnail/`;

  const cardHighlightClass = product.newArrival
    ? "border-2 border-accent shadow-md hover:shadow-xl bg-accent text-primary"
    : "border border-border shadow hover:shadow-lg bg-card text-primary-dark  ";

  return (
    <article
      className={`rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105 ${cardHighlightClass}`}      
    >
      
      {/* Image Section */}
      <Link
        href={`/product/${toSlug(product.sub_category)}/${product.id}`}
        title={`${product.sub_category} | ${product.name}`}
        className="flex relative w-full items-center justify-center overflow-hidden rounded-t-2xl bg-muted"
        style={{ maxHeight: "220px", minHeight: "180px" }}        
      >
        {product.newArrival && (
          <span
            className="
              absolute top-2 left-2 z-10
              bg-accent text-accent-foreground
              text-xs px-2 py-1 rounded-full shadow-lg
              transform -rotate-3
            ">
            ✨ NEW ARRIVAL
          </span>
        )}

        <img
          src={`${driveURL}${product.images[0]}`}
          loading="lazy"
          alt={product.name}
          className="w-full h-full object-cover"
          width={220}
          height={180}          
          title={product.name}
        />
      </Link>

      {/* Product Info */}
      <div className="p-3">
        <h2 className="text-lg">
          {product.name}
        </h2>
        <div className="flex justify-between text-sm mt-1 text-normal">
          <span>{product.purity}</span>
          <span>{product.weight} gm</span>
        </div>
      </div>      
    </article>
  );
}
