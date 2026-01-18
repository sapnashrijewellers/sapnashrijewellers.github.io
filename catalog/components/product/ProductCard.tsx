"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/catalog";
import WishlistButton from "@/components/common/WishlistButton";
import ProductRating from "@/components/product/ProductRating";
import formatPurity from "@/utils/utils";
import ProductPrice from "./ProductCardPrice";

export default function ProductCard({ product }: { product: Product }) {
  const baseURL = process.env.BASE_URL;
  const images = product.images || [];
  const hasMultipleImages = images.length > 1;

  const [activeImage, setActiveImage] = useState(0);
  const rating = Number(product.rating);
  const ratingCount = Number(product.ratingCount);

  const cardHighlightClass = product.newArrival
    ? "shadow-md hover:shadow-xl bg-accent"
    : "shadow hover:shadow-lg text-primary-dark";

  const imageSrc = `${baseURL}/static/img/products/thumbnail/${images[activeImage]}`;

  return (
    <article
      className={`rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.03] ${cardHighlightClass}`}
    >
      {/* Image */}
      <div
        className="relative"
        onMouseEnter={() => hasMultipleImages && setActiveImage(1)}
        onMouseLeave={() => hasMultipleImages && setActiveImage(0)}
      >
        {/* Wishlist */}
        <div className="absolute top-2 right-2 z-20">
          <WishlistButton slug={product.slug} />
        </div>

        {/* New badge */}
        {product.newArrival && (
          <span className="absolute top-2 left-2 z-10 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full shadow-md">
            ✨ NEW
          </span>
        )}

        {/* Image wrapper */}
        <Link
          href={`/product/${product.slug}`}
          className="block relative overflow-hidden bg-muted"
          style={{ height: 200 }}
          onClick={(e) => {
            // 📱 Mobile tap preview
            if (hasMultipleImages && activeImage === 0) {
              e.preventDefault();
              setActiveImage(1);
            }
          }}
        >
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 220px"
            className="object-cover transition-opacity duration-300"
            priority={false}
          />
        </Link>

        {/* Mobile image dots */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.slice(0, 2).map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 w-1.5 rounded-full transition ${activeImage === idx ? "bg-white" : "bg-white/50"
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <Link href={`/product/${product.slug}`} className="block">
          <h2 className={`${product.newArrival ? "bg-accent" : "text-primary-dark"} text-sm leading-tight line-clamp-2 w-full`}>
            {product.name}
          </h2>
        </Link>
        <ProductPrice product={product} />
        {rating > 0 && ratingCount > 0 && (
          <div className="mt-1">
            <ProductRating
              rating={rating}
              count={ratingCount}
              size={14}
              showExpert={false}
            />
          </div>
        )}

        <div className="flex justify-between text-xs mt-1 opacity-80">
          <span>{formatPurity(product.purity)}</span>
          <span>{product.weight} gm</span>
        </div>
      </div>
    </article>
  );
}
