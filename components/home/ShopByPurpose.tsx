import Link from 'next/link';
import type { Type } from '@/types/catalog';
import typesData from '@/data/types.json';
import { AppIconMap } from '@/utils/appIcons';
import SectionHeading from '../common/SectionHeading';

interface ShopByPurposeProps {
  className?: string;
}

export default function ShopByPurpose({ className = '' }: ShopByPurposeProps) {
  const activeTypes = (typesData as Type[]).filter((t) => t.active).sort((a, b) => a.rank - b.rank);

  if (activeTypes.length === 0) return null;

  return (
    <section id="shop-by-occasion" aria-labelledby="occasion-heading" className={`relative w-full py-4 ${className}`}>
      <SectionHeading
        heading="Shop By Purpose"
        punchline="Browse jewellery curated by occasions, styles, and daily wear categories."
      />

      {/* Horizontally Scrollable Track */}
      <nav
        aria-label="Jewellery styles and occasion categories"
        tabIndex={0}
        className="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-2xl p-2 sm:gap-4 sm:p-3"
      >
        {activeTypes.map((item) => {
          const Icon = AppIconMap[item.icon];
          const Icon1 = item.icon1 ? AppIconMap[item.icon1] : null;

          return (
            <Link
              key={item.id}
              href={`/jt/${item.id}/`}
              title={`${item.description}`}
              aria-label={`Explore ${item.type} jewellery collection`}
              className="group bg-surface hover:border-primary/40 relative flex w-28 shrink-0 snap-start flex-col items-center gap-2 rounded-2xl p-2 text-center shadow-sm transition-[transform,box-shadow,border-color] duration-150 ease-out will-change-[transform] hover:-translate-y-1 hover:shadow-md"
            >
              {/* Badge / Icon Wrapper */}
              <div className="ring-primary/20 group-hover:ring-primary/40 relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/10 to-orange-500/10 ring-1 transition-colors duration-150 group-hover:from-amber-500/20 group-hover:to-orange-500/20 sm:h-16 sm:w-16">
                {/* Decorative Dashed Ring */}
                <span
                  className="border-primary/30 absolute inset-1 rounded-full border border-dashed transition-transform duration-300 ease-out group-hover:rotate-45"
                  aria-hidden="true"
                />

                {/* Primary SVG Icon */}
                {Icon && (
                  <Icon
                    size={34}
                    strokeWidth={1.5}
                    className="relative z-10 transition-transform duration-150 ease-out group-hover:scale-110"
                    aria-hidden="true"
                  />
                )}

                {/* Secondary Auxiliary Icon */}
                {Icon1 && (
                  <span
                    className="bg-surface ring-theme/40 absolute -right-0.5 -bottom-0.5 z-20 flex h-6 w-6 items-center justify-center rounded-full shadow-sm ring-1 transition-transform duration-150 ease-out group-hover:scale-110"
                    aria-hidden="true"
                  >
                    <Icon1 size={14} strokeWidth={1.8} />
                  </span>
                )}
              </div>

              {/* Title with multi-line wrap and fixed container constraints */}
              <span className="leading-snugtransition-colors w-full break-words whitespace-normal duration-150">
                {item.type}
              </span>

              <span className="sr-only">{item.description || `Browse ${item.type} jewellery items`}</span>
            </Link>
          );
        })}
      </nav>
    </section>
  );
}
