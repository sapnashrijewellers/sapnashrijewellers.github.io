import Link from "next/link";
import banners from "@/data/banners.json";

interface BannerItem {
  id: number;
  rank: number;
  bannerDesktop: string;
  bannerMobile?: string;
  categoryId: string;
  text: string;
}

interface RotatingBannerProps {
  interval?: number;
  className?: string;
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL!;
const baseImageURL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL!;

// Maximum 3 banners — no sorting, no runtime processing.
const items = (banners as BannerItem[]).slice(0, 3);

export default function RotatingBanner({
  interval = 8000,
  className = "",
}: RotatingBannerProps) {
  if (items.length === 0) return null;

  const duration = `${interval * items.length}ms`;

  return (
    <>
      <section
        aria-label="Promotional announcements and featured offers"
        className={`relative w-full ${className}`}
      >
        <div className="relative w-full aspect-[4/3] sm:aspect-[2.2/1] lg:aspect-[3/1] max-h-[520px] overflow-hidden rounded-2xl bg-muted/20">
          {items.map((item, index) => {
            const desktopSrc = `${baseImageURL}/banner/optimized/${item.bannerDesktop}`;

            const mobileSrc = item.bannerMobile
              ? `${baseImageURL}/banner/optimized/${item.bannerMobile}`
              : desktopSrc;

            return (
              <Link
                key={item.id}
                href={`${baseURL}/c/${item.categoryId}/`}
                aria-label={item.text}
                className={`banner-slide absolute inset-0 block h-full w-full rounded-2xl ${
                  index === 0 ? "banner-slide-first" : ""
                }`}
                style={
                  {
                    "--banner-index": index,
                    "--banner-duration": duration,
                    "--banner-count": items.length,
                  } as React.CSSProperties
                }
              >
                <picture>
                  <source
                    media="(max-width: 639px)"
                    srcSet={mobileSrc}
                  />

                  <img
                    src={desktopSrc}
                    alt={item.text}
                    width={1920}
                    height={640}
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "low"}
                    decoding={index === 0 ? "sync" : "async"}
                    className="h-full w-full object-cover object-center"
                  />
                </picture>
              </Link>
            );
          })}
        </div>
      </section>

      <style>{`
        .banner-slide {
          opacity: 0;
          z-index: 0;
          pointer-events: none;
          animation: banner-fade var(--banner-duration) infinite;
          animation-delay: calc(
            var(--banner-index) * (var(--banner-duration) / var(--banner-count))
          );
        }

        .banner-slide-first {
          opacity: 1;
          z-index: 1;
        }

        @keyframes banner-fade {
          0%,
          28% {
            opacity: 1;
            z-index: 1;
            pointer-events: auto;
          }

          33%,
          95% {
            opacity: 0;
            z-index: 0;
            pointer-events: none;
          }

          100% {
            opacity: 1;
            z-index: 1;
            pointer-events: auto;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .banner-slide {
            animation: none;
          }

          .banner-slide:not(.banner-slide-first) {
            display: none;
          }
        }
      `}</style>
    </>
  );
}