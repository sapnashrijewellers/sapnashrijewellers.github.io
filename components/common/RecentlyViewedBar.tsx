'use client';

import { useEffect, useState, useId, useTransition, useMemo } from 'react';
import ProductCard from '@/components/product/ProductCard';
import productsData from '@/data/products.json';
import type { Product } from '@/types/catalog';
import SectionHeading from './SectionHeading';

const STORAGE_KEY = 'recently_viewed';

interface RecentlyViewedBarProps {
  currentProductId?: string | number;
}

export default function RecentlyViewedBar({ currentProductId }: RecentlyViewedBarProps) {
  const [viewedIds, setViewedIds] = useState<string[]>([]);
  const [, startTransition] = useTransition();
  const sectionTitleId = useId();

  useEffect(() => {
    const loadRecentlyViewed = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            startTransition(() => {
              setViewedIds(parsed);
            });
            return;
          }
        }
        startTransition(() => {
          setViewedIds([]);
        });
      } catch (e) {
        console.error('Failed to parse recently viewed from localStorage:', e);
      }
    };

    loadRecentlyViewed();

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) loadRecentlyViewed();
    };

    const onCustomUpdate = () => loadRecentlyViewed();

    window.addEventListener('storage', onStorage);
    window.addEventListener('recently-viewed-updated', onCustomUpdate);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('recently-viewed-updated', onCustomUpdate);
    };
  }, []);

  const recentProducts = useMemo(() => {
    if (viewedIds.length === 0) return [];

    const productMap = new Map<string, Product>();
    (productsData as Product[]).forEach((p) => {
      productMap.set(p.id.toString(), p);
    });

    const currentIdStr = currentProductId?.toString();

    return viewedIds
      .filter((id) => id !== currentIdStr) // Omit the product currently open
      .map((id) => productMap.get(id))
      .filter((p): p is Product => Boolean(p));
  }, [viewedIds, currentProductId]);

  const hasItems = recentProducts.length > 0;

  return (
    <section
      aria-labelledby={sectionTitleId}
      className={`relative w-full transition-[opacity,transform] duration-200 ease-out will-change-[opacity,transform] ${hasItems ? 'visible my-8 opacity-100' : 'pointer-events-none invisible hidden opacity-0'} `}
    >
      <SectionHeading
        heading="Recently Viewed"
        punchline="Pick up right where you left off and take a second look at your recent favourites."
      />

      <div className="sr-only" aria-live="polite">
        {hasItems ? `You have ${recentProducts.length} recently viewed items.` : 'No recently viewed products.'}
      </div>

      <div
        role="region"
        aria-label="Recently viewed products carousel"
        tabIndex={0}
        className="scrollbar-hide focus:ring-primary/40 flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-2xl py-4 focus:ring-1 focus:outline-none sm:gap-4"
      >
        {recentProducts.map((p, index) => (
          <ProductCard key={p.id} product={p} priority={index < 4} />
        ))}
      </div>
    </section>
  );
}
