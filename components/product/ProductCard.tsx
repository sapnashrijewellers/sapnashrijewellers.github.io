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

const baseImageURL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL!;

export default function ProductCard({
  product,
  priority = false,
  className = "",
}: ProductCardProps) {
  const images = product.images;
  const firstImage = images[0] || "placeholder.png";
  const secondImage = images[1];

  const rating = Number(product.rating || 0);
  const ratingCount = Number(product.ratingCount || 0);
  const hasSecondImage = Boolean(secondImage);

  return (
    <article
      aria-label={`${product.name} jewellery item`}
      className={`
        group relative flex h-full w-full min-w-0 flex-col
        overflow-hidden rounded-2xl border border-theme/40 bg-card shadow-sm
        transition-[transform,box-shadow,border-color] duration-150 ease-out
        hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg
        ${className}
      `}
    >
      {/* Wishlist */}
      <div className="absolute right-2.5 top-2.5 z-20">
        <WishlistButton id={product.id} productName={product.name} />
      </div>

      {/* New arrival badge */}
      {product.newArrival && (
        <span
          className="
            absolute left-2.5 top-2.5 z-10
            inline-flex items-center gap-1
            rounded-full bg-accent px-2 py-0.5
            text-[11px] font-bold text-accent-foreground
            shadow-md
            pointer-events-none select-none
            -rotate-2
          "
          aria-label="New Arrival product"
        >
          <span aria-hidden="true">✨</span>
          <span>NEW</span>
        </span>
      )}

      <Link
        href={`/p/${product.id}/`}
        prefetch={false}
        title={`${product.name} - ${product.brandText}`}
        aria-label={`View full details for ${product.name}`}
        className="
          flex h-full w-full grow flex-col
          rounded-2xl
          focus:outline-none                   
        "
      >
        {/* Product image */}
        <div
          className="
            relative w-full shrink-0
            aspect-square
            overflow-hidden
            bg-muted/20
          "
        >
          {/* Primary image */}
          <Image
            src={`${baseImageURL}/products/thumbnail/${firstImage}`}
            alt={`${product.name} - Sapna Shri Jewellers`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`
              object-cover object-center
              transition-transform duration-300 ease-out
              group-hover:scale-105
              ${hasSecondImage ? "group-hover:opacity-0" : ""}
            `}
          />

          {/* Secondary image */}
          {hasSecondImage && (
            <Image
              src={`${baseImageURL}/products/thumbnail/${secondImage}`}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
              className="
                object-cover object-center
                opacity-0
                transition-opacity duration-300
                group-hover:opacity-100
              "
              aria-hidden="true"
            />
          )}
        </div>

        {/* Product information */}
        <div
          className="
            flex w-full grow flex-col justify-between
            border-t border-theme/20
            bg-card
            p-3 sm:p-3.5
          "
        >
          <div>
            <h3
              className="
                text-xs font-medium leading-snug text-foreground
                transition-colors duration-150                
                sm:text-sm
              "
            >
              {product.name}
            </h3>

            <div className="mt-2">
              <ProductPrice product={product} />
            </div>
          </div>

          {rating > 0 && ratingCount > 0 && (
            <div className="mt-2.5 border-t border-theme/20 pt-2">
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
