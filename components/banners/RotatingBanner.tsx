'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import banners from '@/data/banners.json';

interface BannerItem {
  id: number;
  rank: number;
  bannerDesktop: string;
  bannerMobile: string;
  collectionId: number;
  eyebrow: string;
  headline: string;
  description: string;
  cta: string;
  active: boolean;
}

interface RotatingBannerProps {
  interval?: number;
  className?: string;
}

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || '';
const baseImageURL = process.env.NEXT_PUBLIC_BASE_IMAGE_URL || '';

const items: BannerItem[] = (banners as BannerItem[]).filter((b) => b.active);

export default function RotatingBanner({ interval = 6000, className = '' }: RotatingBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalBanners = items.length;

  useEffect(() => {
    if (totalBanners <= 1 || isPaused) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalBanners);
    }, interval);

    return () => window.clearInterval(timer);
  }, [totalBanners, interval, isPaused]);

  if (totalBanners === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Editorial jewellery campaigns"
      className={`relative w-full ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsPaused(false);
        }
      }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:aspect-[16/9] lg:aspect-[16/5]">
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const desktopSrc = `${baseImageURL}/banner/optimized/${item.bannerDesktop}`;
          const mobileSrc = `${baseImageURL}/banner/optimized/${item.bannerMobile}`;

          return (
            <div
              key={item.id}
              className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-out will-change-[opacity] ${
                isActive ? 'pointer-events-auto z-10 opacity-100' : 'pointer-events-none z-0 opacity-0'
              }`}
              aria-hidden={!isActive}
            >
              {/* Full Image Canvas */}
              <Link
                href={`${baseURL}/c/${item.collectionId}/`}
                aria-label={item.headline}
                tabIndex={isActive ? 0 : -1}
                className="absolute inset-0 block h-full w-full"
              >
                <picture>
                  <source media="(max-width: 639px)" srcSet={mobileSrc} />
                  <img
                    src={desktopSrc}
                    alt={item.headline}
                    width={1920}
                    height={600}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : 'low'}
                    decoding={index === 0 ? 'sync' : 'async'}
                    className="h-full w-full object-cover object-center"
                  />
                </picture>
              </Link>

              {/* Minimal Scrim: Ultra-soft linear gradient protecting text legibility without obscuring the art */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent sm:bg-gradient-to-r sm:from-black/50 sm:via-black/15 sm:to-transparent"
              />

              {/* Editorial Typography Overlay */}
              <div className="pointer-events-none absolute inset-0 z-20 flex items-end p-6 sm:items-center sm:p-12 lg:p-16">
                <div className="max-w-md text-white">
                  <span className="text-[11px] font-medium tracking-[0.25em] text-white/75 uppercase">
                    {item.eyebrow}
                  </span>

                  <h2 className="mt-2 text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {item.headline}
                  </h2>

                  <p className="mt-3 hidden text-sm font-normal text-white/80 sm:block sm:text-base">
                    {item.description}
                  </p>

                  <div className="mt-4 sm:mt-6">
                    <span className="inline-flex items-center gap-2 border-b border-white/60 pb-1 text-xs font-medium tracking-widest text-white uppercase transition-all hover:border-white">
                      {item.cta} &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
