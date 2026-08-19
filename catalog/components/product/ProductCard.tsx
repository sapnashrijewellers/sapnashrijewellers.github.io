"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/catalog";
import WishlistButton from "@/components/common/WishlistButton";
import ProductRating from "@/components/product/ProductRating";
import ProductPrice from "./ProductCardPrice";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

export default function ProductCard({
  product,
  priority = false,
  className = "",
}: ProductCardProps) {
  const baseURL =
    process.env.NEXT_PUBLIC_BASE_URL || "https://sapnashrijewellers.in";
  const images = Array.isArray(product.images) ? product.images : [];
  const hasMultipleImages = images.length > 1;

  const [activeImage, setActiveImage] = useState(0);
  const rating = Number(product.rating || 0);
  const ratingCount = Number(product.ratingCount || 0);

  const currentImageFileName =
    images[activeImage] || images[0] || "placeholder.png";
  const imageSrc = `${baseURL}/static/img/products/thumbnail/${currentImageFileName}`;

  const handleMouseEnter = useCallback(() => {
    if (hasMultipleImages) setActiveImage(1);
  }, [hasMultipleImages]);

  const handleMouseLeave = useCallback(() => {
    if (hasMultipleImages) setActiveImage(0);
  }, [hasMultipleImages]);

  const handleTouchStart = useCallback(() => {
    if (hasMultipleImages) {
      setActiveImage((prev) => (prev === 0 ? 1 : 0));
    }
  }, [hasMultipleImages]);

  return (
    <article
      aria-label={`${product.name} jewellery item`}
      className={`
        group relative flex flex-col w-full h-full min-w-0
        bg-card rounded-2xl border border-theme/40 overflow-hidden shadow-sm
        transition-[transform,box-shadow,border-color] duration-150 ease-out will-change-[transform]
        hover:-translate-y-1 hover:shadow-lg hover:border-primary/40
        ${className}
      `}
    >
      {/* 1. Top Badges & Wishlist Action (Decoupled from card navigation link) */}
      <div className="absolute top-2.5 right-2.5 z-20">
        <WishlistButton slug={product.slug} productName={product.name} />
      </div>

      {product.newArrival && (
        <span
          className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1 bg-accent text-accent-foreground text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md pointer-events-none select-none -rotate-2"
          aria-label="नवीन आगमन (New Arrival product)"
        >
          <span aria-hidden="true">✨</span>
          <span>NEW</span>
        </span>
      )}

      {/* 2. Primary Navigation Link (Takes full flexible height) */}
      <Link
        href={`/product/${product.slug}/`}
        prefetch={false}
        title={product.name}
        aria-label={`View full details for ${product.name}`}
        className="flex flex-col w-full h-full grow rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
      >
        {/* Aspect Ratio Box: Strictly container-width driven, immune to image dimensions */}
        <div
          className="relative w-full aspect-square bg-muted/20 overflow-hidden shrink-0"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
        >
          <Image
            src={imageSrc}
            alt={`${product.name} - Sapna Shri Jewellers`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105 will-change-transform"
          />

          {/* Secondary Thumbnail Indicator Dots */}
          {hasMultipleImages && (
            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-xs pointer-events-none"
              aria-hidden="true"
            >
              {images.slice(0, 2).map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-150 ${
                    activeImage === idx ? "w-3 bg-white" : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 3. Product Info & Metadata */}
        <div className="flex flex-col justify-between grow p-3 sm:p-3.5 w-full bg-card border-t border-theme/20">
          <div>
            <h3 className="text-xs sm:text-sm font-medium leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-150">
              {product.name}
            </h3>

            <div className="mt-2">
              <ProductPrice product={product} />
            </div>
          </div>

          {rating > 0 && ratingCount > 0 && (
            <div className="mt-2.5 pt-2 border-t border-theme/20">
              <ProductRating
                rating={rating}
                count={ratingCount}
                size={14}
                showExpert={false}
              />
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}