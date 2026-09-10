"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import banners from "@/data/banners.json";

interface BannerItem {
  id: number;
  rank: number;
  bannerDesktop: string;
  bannerMobile?: string;
  categoryId: number;
  text: string;
  active: boolean;
}

interface RotatingBannerProps {
  interval?: number;
  className?: string;
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "";
const baseImageURL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL || "";

const items: BannerItem[] = (banners as BannerItem[]).filter((b) => b.active);

export default function RotatingBanner({
  interval = 5000,
  className = "",
}: RotatingBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalBanners = items.length;

  useEffect(() => {
    if (totalBanners <= 1 || isPaused) return;

    // Check system prefers-reduced-motion setting
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalBanners);
    }, interval);

    return () => clearInterval(timer);
  }, [totalBanners, interval, isPaused]);

  if (totalBanners === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Promotional announcements and featured offers"
      className={`relative w-full ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(e) => {
        // Resume rotation only if focus moved completely outside the banner container
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsPaused(false);
        }
      }}
    >
      <div className="relative w-full aspect-[4/3] sm:aspect-[2.2/1] lg:aspect-[3/1] max-h-[520px] overflow-hidden rounded-2xl bg-muted/20">
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const desktopSrc = `${baseImageURL}/banner/optimized/${item.bannerDesktop}`;
          const mobileSrc = item.bannerMobile
            ? `${baseImageURL}/banner/optimized/${item.bannerMobile}`
            : desktopSrc;

          return (
            <Link
              key={item.id}
              href={`${baseURL}/c/${item.categoryId}/`}
              aria-label={item.text}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
              className={`absolute inset-0 block h-full w-full rounded-2xl transition-opacity duration-1000 ease-in-out will-change-[opacity] ${
                isActive
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <picture>
                <source media="(max-width: 639px)" srcSet={mobileSrc} />
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
  );
}