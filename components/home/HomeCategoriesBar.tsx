import Link from "next/link";
import categoriesData from "@/data/categories.json";
import { Category } from "@/types/catalog";

interface HomeCategoriesBarProps {
  className?: string;
}

// SPRITE CALCULATION (Simplified for standard CSS shifts):
// The source map is 600px wide by 600px high (3x3 grid, 200px cells).
// Target icon size is w-16 h-16 (64px).
// Scale Factor = 64/200 = 0.32.
// The entire background-size (map width) must be set to (600px * 0.32) = 192px.

/**
 * Renders a square category icon with rounded corners,
 * showing the simple background from the asset.
 */
function CategoryIcon({ category }: { category: Category }) {
  const spriteSliceStyle = {
    backgroundImage: `url('/icons/categories-icons.optimized.webp')`,
    backgroundSize: "600px 600px",
    backgroundPosition: `${category.xPosition} ${category.yPosition}`,
    backgroundRepeat: "no-repeat",
  };

  return (
    <div
      className="
        relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center
        rounded-2xl overflow-hidden
        transition-colors duration-150
        group-hover:ring-primary/40
        shadow-inner
        border border-black/5
        bg-surface-alt
      "
    >
      {/* 
        Container is 96px (mobile) / 112px (desktop).
        scale-[0.48] on 200px = 96px
        sm:scale-[0.56] on 200px = 112px
      */}
      <div className="absolute inset-0 flex items-center justify-center transition-transform duration-150 ease-out group-hover:scale-[1.08]">
        <div
          className="w-[200px] h-[200px] shrink-0 scale-[0.48] sm:scale-[0.56] origin-center"
          style={spriteSliceStyle}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export default function HomeCategoriesBar({
  className = "",
}: HomeCategoriesBarProps) {
  // Use the refined JSON data structure.
  const categories = categoriesData as Category[];

  if (!categories || categories.length === 0) return null;

  return (    
    <section
      id="shop-by-category"
      aria-labelledby="category-heading"
      className={`relative w-full py-4 ${className}`}
    >

      {/* Section Header */}
      <div className="flex items-baseline justify-between px-2 sm:px-4 mb-2">
        <h2
          id="category-heading"
          className="au-h2"
        >
          Shop by Categories
        </h2>
      </div>

      {/* Screen Reader Context */}
      <div className="sr-only">
        Browse jewelry by categories including Bracelets, Chains, Earrings, Bangles, and more.
      </div>

      {/* Horizontally Scrollable Track */}
      <nav
        aria-label="Jewelry categories"
        tabIndex={0}
        className="
          flex gap-3 sm:gap-4 overflow-x-auto p-2 sm:p-3
          scrollbar-hide snap-x snap-mandatory
          /* TRACK UI: Maintain simple squared corners. */
          rounded-2xl
        "
      >
        {categories.map((category) => {
          // Generate slug from category name
          const slug = category.name
            .toLowerCase()
            .replace(/ & /g, "-")
            .replace(/ /g, "-");

          return (
            <Link
              key={category.name}
              href={`/search?q=${slug}`}
              title={`Explore ${category.name} collection`}
              aria-label={`Explore ${category.name} jewelry collection`}
              className="
                group relative flex shrink-0 w-24 sm:w-28 flex-col items-center
                gap-2 rounded-2xl bg-surface-alt px-2.5 py-3.5 shadow-sm
                snap-start text-center
                transition-[transform,box-shadow,border-color] duration-150 ease-out will-change-[transform]
                hover:-translate-y-1 hover:shadow-md hover:border-primary/40
              "
            >
              <CategoryIcon category={category} />

              {/* Title */}
              <span className="w-full leading-snug text-foreground transition-colors duration-150 break-words whitespace-normal z-20">
                {category.name}
              </span>

              <span className="sr-only">
                Browse {category.name} jewelry items
              </span>
            </Link>
          );
        })}
      </nav>
    </section>
  );
}