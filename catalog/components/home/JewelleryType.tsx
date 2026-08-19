import Link from "next/link";
import type { Type } from "@/types/catalog";
import typesData from "@/data/types.json";
import { AppIconMap } from "@/utils/appIcons";

interface JewelleryTypeBarProps {
  home?: boolean;
  className?: string;
}

export default function JewelleryTypeBar({
  home = true,
  className = "",
}: JewelleryTypeBarProps) {
  const activeTypes = (typesData as Type[])
    .filter((t) => t.active)
    .sort((a, b) => a.rank - b.rank);

  if (activeTypes.length === 0) return null;

  return (
    <section
      id="shop-by-occasion"
      aria-labelledby="occasion-heading"
      className={`relative w-full py-4 ${className}`}
    >
      {/* Section Header with Bilingual Context for Crawlers & Assistive Tech */}
      <div className="flex items-baseline justify-between px-2 sm:px-4 mb-2">
        <h2
          id="occasion-heading"
          className={`font-semibold text-foreground tracking-tight ${
            !home ? "au-h2" : "text-xl sm:text-2xl"
          }`}
        >
          हर अवसर के लिए आभूषण (Jewellery for Every Occasion)
        </h2>
        <span className="text-xs text-muted-foreground hidden sm:inline-block">
          {activeTypes.length} शैलियाँ उपलब्ध (Styles Available)
        </span>
      </div>

      {/* Screen Reader & Agentic Context */}
      <div className="sr-only">
        Browse jewellery curated by occasions, styles, and daily wear categories.
      </div>

      {/* Horizontally Scrollable Track */}
      <nav
        aria-label="Jewellery styles and occasion categories"
        tabIndex={0}
        className="
          flex gap-3 sm:gap-4 overflow-x-auto p-2 sm:p-3
          scrollbar-hide snap-x snap-mandatory
          focus:outline-none focus:ring-1 focus:ring-primary/40 rounded-2xl
        "
      >
        {activeTypes.map((item) => {
          const Icon = AppIconMap[item.icon];
          const Icon1 = item.icon1 ? AppIconMap[item.icon1] : null;

          return (
            <Link
              key={item.slug}
              href={`/jewelry-type/${item.slug}/`}
              title={`${item.type} Jewellery Collection`}
              aria-label={`Explore ${item.type} jewellery collection`}
              className="
                group relative flex shrink-0 min-w-[96px] sm:min-w-[112px] flex-col items-center
                gap-2 rounded-2xl bg-surface  px-3 py-3.5 shadow-sm
                snap-start text-center
                transition-[transform,box-shadow,border-color] duration-150 ease-out will-change-[transform]
                hover:-translate-y-1 hover:shadow-md hover:border-primary/40
                focus:outline-none focus:ring-2 focus:ring-primary
              "
            >
              {/* Badge / Icon Wrapper */}
              <div
                className="
                  relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center
                  rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10
                  text-primary ring-1 ring-primary/20
                  transition-colors duration-150
                  group-hover:from-amber-500/20 group-hover:to-orange-500/20 group-hover:ring-primary/40
                "
              >
                {/* Decorative Dashed Ring */}
                <span
                  className="
                    absolute inset-1 rounded-full border border-dashed border-primary/30
                    transition-transform duration-300 ease-out
                    group-hover:rotate-45
                  "
                  aria-hidden="true"
                />

                {/* Primary SVG Icon */}
                {Icon && (
                  <Icon
                    size={34}
                    strokeWidth={1.5}
                    className="
                      relative z-10 text-primary
                      transition-transform duration-150 ease-out
                      group-hover:scale-110
                    "
                    aria-hidden="true"
                  />
                )}

                {/* Secondary Auxiliary Icon */}
                {Icon1 && (
                  <span
                    className="
                      absolute -bottom-0.5 -right-0.5 z-20
                      flex h-6 w-6 items-center justify-center
                      rounded-full bg-surface text-primary
                      shadow-sm ring-1 ring-theme/40
                      transition-transform duration-150 ease-out
                      group-hover:scale-110
                    "
                    aria-hidden="true"
                  >
                    <Icon1 size={14} strokeWidth={1.8} />
                  </span>
                )}
              </div>

              {/* Title & Screen Reader Description */}
              <span className="text-xs sm:text-sm font-medium leading-tight text-foreground group-hover:text-primary transition-colors duration-150 line-clamp-1">
                {item.type}
              </span>
              <span className="sr-only">
                {item.description || `Browse ${item.type} jewellery items`}
              </span>
            </Link>
          );
        })}
      </nav>
    </section>
  );
}