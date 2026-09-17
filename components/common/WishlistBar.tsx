'use client';

import { useEffect, useState, useId, useTransition, useMemo } from 'react';
import ProductCard from '@/components/product/ProductCard';
import productsData from '@/data/products.json';
import type { Product } from '@/types/catalog';
import SectionHeading from './SectionHeading';

export default function WishlistBar() {
  const [wishlistSlugs, setWishlistSlugs] = useState<string[]>([]);
  const [, startTransition] = useTransition();
  const sectionTitleId = useId();

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const stored = localStorage.getItem('wishlist');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            startTransition(() => {
              setWishlistSlugs(parsed);
            });
          }
        } else {
          startTransition(() => {
            setWishlistSlugs([]);
          });
        }
      } catch (e) {
        console.error('Failed to parse wishlist from localStorage:', e);
      }
    };

    // Initial load on mount
    loadWishlist();

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'wishlist') loadWishlist();
    };

    const onCustomUpdate = () => loadWishlist();

    window.addEventListener('storage', onStorage);
    window.addEventListener('wishlist-updated', onCustomUpdate);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('wishlist-updated', onCustomUpdate);
    };
  }, []);

  const wishlistProducts = useMemo(() => {
    if (wishlistSlugs.length === 0) return [];
    const slugSet = new Set(wishlistSlugs);
    return (productsData as Product[]).filter((p) => slugSet.has(p.id.toString()));
  }, [wishlistSlugs]);

  const hasItems = wishlistProducts.length > 0;

  return (
    <section
      aria-labelledby={sectionTitleId}
      className={`relative w-full transition-[opacity,transform] duration-200 ease-out will-change-[opacity,transform] ${hasItems ? 'visible my-8 opacity-100' : 'pointer-events-none invisible hidden opacity-0'} `}
    >
      <SectionHeading
        heading="My Wish List"
        punchline="Save the pieces you love and make them yours when the moment is right."
      />

      {/* Screen reader context for crawlers & assistive tech */}
      <div className="sr-only" aria-live="polite">
        {hasItems
          ? `Your wishlist contains ${wishlistProducts.length} saved jewellery products.`
          : 'Your wishlist is currently empty.'}
      </div>

      {/* Horizontally Scrollable Product Track */}
      <div
        role="region"
        aria-label="Wishlisted products horizontal carousel"
        tabIndex={0}
        className="scrollbar-hide focus:ring-primary/40 flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-2xl py-4 focus:ring-1 focus:outline-none sm:gap-4"
      >
        {wishlistProducts.map((p, index) => (
          <ProductCard key={p.id} product={p} priority={index < 4} />
        ))}
      </div>
    </section>
  );
}
