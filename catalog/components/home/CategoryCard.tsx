import type { Category, Product } from "@/types/catalog";
import Link from "next/link";
import Image from "next/image";

interface CategoryCardProps {
  category: Category;
  products: Product[];
}

export default function CategoryCard({ category, products }: CategoryCardProps) {
  if (!products || products.length === 0) return null;

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
  const firstProduct = products[0];
  const isNew = Boolean(firstProduct?.newArrival);
  const rawImage = firstProduct.images?.[0];
  const imageUrl = rawImage
    ? `${baseURL}/static/img/products/thumbnail/${rawImage}`
    : "/placeholder.png";

  return (
    <article className="w-full flex">
      <Link
        href={`/category/${category.slug}/`}
        prefetch={false}
        title={`${category.name} Collection`}
        aria-label={`Explore ${category.name} jewellery collection`}
        className="group relative flex flex-col w-full h-full bg-card border border-theme/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary will-change-[transform,box-shadow]"
      >
        {/* Aspect Ratio Box (Width-Filling Responsive Container) */}
        <div className="relative w-full aspect-square bg-muted/20 overflow-hidden shrink-0">
          {isNew && (
            <span
              className="absolute top-2.5 left-2.5 z-10 inline-flex items-center gap-1 bg-accent text-accent-foreground text-[11px] font-bold px-2 py-0.5 rounded-full shadow-md -rotate-2"
              aria-label="New arrival collection"
            >
              ✨ NEW
            </span>
          )}

          <Image
            src={imageUrl}
            alt={firstProduct.name ? `${category.name} - ${firstProduct.name}` : `${category.name} jewellery category`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            decoding="async"
            className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-105 will-change-transform"
          />
        </div>

        {/* Category Label */}
        <div className="flex flex-col items-center justify-center p-3 grow bg-card border-t border-theme/20">
          <h2 className="text-center font-yatra text-base sm:text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-150">
            {category.name}
          </h2>
          <span className="sr-only">
            Browse {category.name} category products
          </span>
        </div>
      </Link>
    </article>
  );
}