"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/catalog";
import WishlistButton from "@/components/common/WishlistButton";
import ProductRating from "@/components/product/ProductRating";
import formatPurity from "@/utils/utils.js"

export default function ProductCard({ product }: { product: Product }) {
  const baseURL = process.env.BASE_URL;
  const cardHighlightClass = product.newArrival
    ? "shadow-md hover:shadow-xl bg-accent"
    : "shadow hover:shadow-lg text-primary-dark";
  const rating = Number(product.rating);
  const ratingCount = Number(product.ratingCount);
  return (
    <article
      className={`rounded-2xl  overflow-hidden transition-transform duration-300 hover:scale-105 ${cardHighlightClass}`}
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

          <Image
            src={`${baseURL}/static/img/products/thumbnail/${product.images[0]}`}
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
        {/* ⭐ Rating */}
        {Number.isFinite(rating) && rating > 0 && ratingCount > 0 && (
          <div className="mt-1">
            <ProductRating
              rating={rating}
              count={ratingCount}
              size={14}
              showExpert={false}
            />
          </div>
        )}
        <div className="flex justify-between text-xs mt-1">
          <span>{formatPurity(product.purity)}</span>
          <span>{product.weight} gm</span>
        </div>
      </div>
    </article>
  );
}
