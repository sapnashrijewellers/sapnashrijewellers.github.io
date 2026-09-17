'use client';

import { useEffect, useState, useId, useTransition, useMemo } from 'react';
import ProductCard from '@/components/product/ProductCard';
import productsData from '@/data/products.json';
import type { Product } from '@/types/catalog';
import SectionHeading from './SectionHeading';
import { Trash2 } from 'lucide-react';

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

  const handleClearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      startTransition(() => {
        setViewedIds([]);
      });
      // Notify other components/tabs listening for history changes
      window.dispatchEvent(new Event('recently-viewed-updated'));
    } catch (e) {
      console.error('Failed to clear browsing history:', e);
    }
  };

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
      className={`relative w-full transition-[opacity,transform] duration-200 ease-out will-change-[opacity,transform] ${
        hasItems ? 'visible my-8 opacity-100' : 'pointer-events-none invisible hidden opacity-0'
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="text-left">
            <SectionHeading
              heading="Recently Viewed"
              punchline="Pick up right where you left off and take a second look at your recent favourites."
            />
          </div>

          <button
            type="button"
            onClick={handleClearHistory}
            className="ssj-btn shrink-0 text-xs font-medium underline-offset-4 transition-colors sm:text-sm"
            aria-label="Clear all recently viewed items"
            title="Clear history"
          >
            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        {hasItems ? `You have ${recentProducts.length} recently viewed items.` : 'No recently viewed products.'}
      </div>

      {/* Horizontally Scrollable Track */}
      <div
        role="region"
        aria-label="Recently viewed products carousel"
        tabIndex={0}
        className="focus:ring-primary/40 flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-2xl p-2 pb-6 focus:ring-1 focus:outline-none sm:gap-4 sm:p-3"
      >
        {recentProducts.map((p, index) => (
          <div key={p.id} className="w-64 shrink-0 snap-start sm:w-72 md:w-80">
            <ProductCard product={p} priority={index < 4} />
          </div>
        ))}
      </div>
    </section>
  );
}
