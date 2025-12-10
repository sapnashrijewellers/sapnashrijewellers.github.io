"use client";

import Link from "next/link";
import { Product } from "@/types/catalog";
import WishlistButton from "@/components/WishlistButton";

export default function ProductCard({ product }: { product: Product }) {
  const driveURL = `${process.env.NEXT_PUBLIC_BASE_URL}/static/img/thumbnail/`;

  const cardHighlightClass = product.newArrival
    ? "shadow-md hover:shadow-xl"
    : "shadow hover:shadow-lg bg-card";

  return (
    <article
      className={`rounded-2xl bg-accent overflow-hidden transition-transform duration-300 hover:scale-105 ${cardHighlightClass}`}
    >
      {/* Image Section */}
      <div className="relative">
        {/* ❤️ Wishlist Component */}
        <div className="absolute top-2 right-2 z-20">
          <WishlistButton slug={product.slug} />
        </div>

        <Link
          href={`/product/${product.slug}`}
          title={`${product.category} | ${product.name}`}
          className="flex relative w-full items-center justify-center overflow-hidden rounded-t-2xl bg-muted"
          style={{ maxHeight: "220px", minHeight: "180px" }}
        >
          {product.newArrival && (
            <span
              className="
                absolute top-2 left-2 z-10
                bg-accent text-accent-foreground
                text-xs px-2 py-1 rounded-full shadow-lg
                transform -rotate-3"
            >
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
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h2 className="text-sm">{product.name}</h2>
        <div className="flex justify-between text-xs mt-1">
          <span>{product.purity}</span>
          <span>{product.weight} gm</span>
        </div>
      </div>
    </article>
  );
}
