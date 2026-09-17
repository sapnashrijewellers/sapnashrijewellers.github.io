import Link from 'next/link';
import Image from 'next/image';
import categoriesData from '@/data/categories.json';
import { Category } from '@/types/catalog';
import SectionHeading from '../common/SectionHeading';

interface ShopByCategoryProps {
  className?: string;
}

export default function ShopByCategory({ className = '' }: ShopByCategoryProps) {
  const categories = categoriesData as Category[];

  if (!categories || categories.length === 0) return null;

  return (
    <section id="shop-by-category" aria-labelledby="category-heading" className={`relative w-full py-4 ${className}`}>
      <SectionHeading
        heading="Shop by Categories"
        punchline="Discover certified fine jewellery handcrafted to complement your unique style."
      />

      <nav
        aria-label="Jewelry categories"
        className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-2xl sm:gap-4"
      >
        {categories.map((category) => {
          const searchUrl = `/search?q=${encodeURIComponent(category.keywords)}`;
          return (
            <Link
              key={category.id}
              href={searchUrl}
              title={`Browse all ${category.name} items`}
              aria-label={`Browse all ${category.name} items`}
              className="group bg-surface focus-visible:ring-primary relative flex w-28 flex-col items-center gap-2 rounded-2xl p-2 text-center shadow-sm transition-[transform,colors,box-shadow] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={`/icons/category-icons/${category.id}.webp`}
                  alt=""
                  width={100}
                  height={100}
                  sizes="(max-width: 640px) 80px, 100px"
                  priority={category.id <= 4}
                  loading={category.id <= 4 ? 'eager' : 'lazy'}
                  className="h-full w-full object-contain transition-transform duration-200 ease-out group-hover:scale-105"
                />
              </div>

              <span className="text-foreground/90 group-hover:text-foreground line-clamp-2 text-xs leading-tight font-medium break-words transition-colors duration-150 sm:text-sm">
                {category.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
