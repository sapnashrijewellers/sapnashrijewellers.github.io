"use client";

import { useEffect, useState, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import banners from "@/data/banners.json";

interface BannerItem {
  page?: string;
  rank?: number;
  bannerImage: string;
  link?: string;
  title?: string;
  alt?: string;
}

interface RotatingBannerProps {
  interval?: number;
  page?: string;
  className?: string;
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL ?? "";

export default function RotatingBanner({
  interval = 8000,
  page = "home",
  className = "",
}: RotatingBannerProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselId = useId();

  const items: BannerItem[] = banners
    .filter((b) => b.page === page)
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));

  /* --------------------------------------------
     Auto-Rotation Timer (Pauses on Hover / Focus)
  --------------------------------------------- */
  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [items.length, interval, isPaused]);

  if (items.length === 0) {
    return null;
  }

  const current = items[index];
  const bannerHref = current.link || "#";
  const bannerAlt =
    current.alt ||
    current.title ||
    `Featured promotional jewellery banner ${index + 1}`;

  return (
    <section
      id={carouselId}
      aria-roledescription="carousel"
      aria-label="Promotional announcements and featured offers"
      className={`relative w-full ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* 1. Main Banner Surface with Pre-defined Aspect Ratio (Prevents CLS) */}
      <div className="relative w-full aspect-[2/1] sm:aspect-[2.3/1] md:aspect-[2.8/1] lg:aspect-[3/1] overflow-hidden rounded-2xl shadow-md bg-muted/40 border border-theme/30">
        <Link
          href={bannerHref}
          aria-label={current.title || bannerAlt}
          className="group block relative w-full h-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl"
          tabIndex={0}
        >
          {items.map((item, idx) => {
            const isActive = idx === index;
            const itemAlt =
              item.alt ||
              item.title ||
              `Featured jewellery banner ${idx + 1}`;

            return (
              <div
                key={item.bannerImage || idx}
                aria-hidden={!isActive}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${isActive
                    ? "opacity-100 z-10 pointer-events-auto"
                    : "opacity-0 z-0 pointer-events-none"
                  }`}
              >
                <Image
                  src={`${baseURL}/static/img/banner/${item.bannerImage}`}
                  alt={itemAlt}
                  fill
                  priority={idx === 0} // ✅ Immediate preload only for the first LCP slide
                  loading={idx === 0 ? "eager" : "lazy"}
                  fetchPriority="high"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1200px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                />
              </div>
            );
          })}
        </Link>
      </div>

      {/* 2. Accessible Carousel Pagination Controls */}
      {items.length > 1 && (
        <div
          role="tablist"
          aria-label="Banner navigation controls"
          className="mt-3 flex items-center justify-center gap-2"
        >
          {items.map((item, i) => {
            const isSelected = i === index;
            const slideLabel = item.title
              ? `Go to slide ${i + 1}: ${item.title}`
              : `Go to slide ${i + 1} of ${items.length}`;

            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-current={isSelected ? "true" : undefined}
                aria-label={slideLabel}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${isSelected
                    ? "w-7 bg-primary shadow-xs"
                    : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}