import Link from "next/link";
import Image from "next/image";
import categoriesData from "@/data/categories.json";
import { Category } from "@/types/catalog";

interface HomeCategoriesBarProps {
  className?: string;
}

export default function HomeCategoriesBar({
  className = "",
}: HomeCategoriesBarProps) {
  const categories = categoriesData as Category[];

  if (!categories || categories.length === 0) return null;

  return (
    <section
      id="shop-by-category"
      aria-labelledby="category-heading"
      className={`relative w-full py-4 ${className}`}
    >
      <h2 id="category-heading">
        Shop by Categories
      </h2>

      <nav
        aria-label="Jewelry categories"
        className="
          flex gap-3 sm:gap-4 overflow-x-auto p-2 sm:p-3
          scrollbar-hide snap-x snap-mandatory
          rounded-2xl"      >

        {categories.map((category) => {
          const searchUrl = `/search?q=${encodeURIComponent(category.keywords)}`;
          return (
            <Link
              key={category.id}
              href={searchUrl}
              title={`Browse all ${category.name} items`}
              aria-label={`Browse all ${category.name} items`}
              className="
                    group relative flex w-28  
                    flex-col items-center text-center
                    gap-2  p-2 bg-surface                    
                    shadow-sm hover:shadow-sm
                    transition-[transform,colors,box-shadow] duration-150 ease-out
                    hover:-translate-y-0.5
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                  rounded-2xl
                    "
            >
              <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-xl ">
                <Image
                  src={`/icons/category-icons/${category.id}.webp`}
                  alt=""
                  width={100}
                  height={100}
                  sizes="(max-width: 640px) 80px, 100px"
                  priority={category.id <= 4}
                  loading={category.id <= 4 ? "eager" : "lazy"}
                  className="h-full w-full object-contain transition-transform duration-200 ease-out group-hover:scale-105"
                />
              </div>

              <span className="text-xs sm:text-sm font-medium leading-tight text-foreground/90 group-hover:text-foreground transition-colors duration-150 break-words line-clamp-2">
                {category.name}
              </span>
            </Link>

          );
        })}

      </nav>
    </section>
  );
}