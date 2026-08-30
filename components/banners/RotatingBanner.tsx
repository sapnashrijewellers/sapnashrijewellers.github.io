"use client";

import { useEffect, useState, useId } from "react";
import Image from "next/image";
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
  page?: string;
  className?: string;
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const baseImageURL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL;

export default function RotatingBanner({
  interval = 8000,
  page = "home",
  className = "",
}: RotatingBannerProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselId = useId();

  const items: BannerItem[] = (banners as BannerItem[])
    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));

  useEffect(() => {
    if (items.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, interval, isPaused]);

  if (items.length === 0) return null;

  const current = items[index];
  const bannerHref = `${baseURL}/c/${current.categoryId}/`;

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
      {/* Aspect Ratio Container preventing CLS across breakpoints */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[2.2/1] lg:aspect-[3/1] max-h-[520px] overflow-hidden rounded-2xl shadow-md bg-muted/20 border border-theme/30">
        <Link
          href={bannerHref}
          aria-label={current.text}
          className="group block relative w-full h-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl"
        >
          {items.map((item, idx) => {
            const isActive = idx === index;
            const itemAlt = item.text;
            const desktopImg = `${baseImageURL}/banner/optimized/${item.bannerDesktop}`;
            const mobileImg = `${baseImageURL}/banner/optimized/${item.bannerMobile}`;


            return (
              <div
                key={item.bannerDesktop || idx}
                aria-hidden={!isActive}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${isActive
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
                  }`}
              >
                {/* Mobile Viewport Image */}
                <div className="block sm:hidden relative w-full h-full">
                  <Image
                    src={mobileImg}
                    alt={itemAlt}
                    fill
                    priority={idx === 0}
                    loading={idx === 0 ? "eager" : "lazy"}
                    fetchPriority={idx === 0 ? "high" : "auto"}
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                </div>

                {/* Tablet & Desktop Viewport Image */}
                <div className="hidden sm:block relative w-full h-full">
                  <Image
                    src={desktopImg}
                    alt={itemAlt}
                    fill
                    priority={idx === 0}
                    loading={idx === 0 ? "eager" : "lazy"}
                    fetchPriority={idx === 0 ? "high" : "auto"}
                    sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 1400px, 1920px"
                    className="object-cover object-center"
                  />
                </div>
              </div>
            );
          })}
        </Link>
      </div>

      {/* Accessible Navigation Controls */}
      {items.length > 1 && (
        <div
          role="tablist"
          aria-label="Banner navigation controls"
          className="mt-3 flex items-center justify-center gap-2"
        >
          {items.map((item, i) => {
            const isSelected = i === index;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`Go to slide ${i + 1}: ${item.text || "Featured banner"}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${isSelected
                  ? "w-6 bg-primary shadow-xs"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}