'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AppIconMap } from '@/utils/appIcons';
import groups from '@/data/groups.json';
import { Group } from '@/types/catalog';
import { getCategoriesForGroup, getCollections } from './catalogNavigationUtils';

export default function CatalogNavigationMobile() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mobileNavRef = useRef<HTMLDivElement | null>(null);

  /* ================================================================
     ESCAPE KEY
     ================================================================ */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  /* ================================================================
     OUTSIDE CLICK
     ================================================================ */

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (mobileNavRef.current && !mobileNavRef.current.contains(target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [mobileMenuOpen]);

  /* ================================================================
     LINK CLICK
     ================================================================ */

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div ref={mobileNavRef} className="min-w-0">
      <div className="relative">
        {/* ============================================================
            HAMBURGER / X
            ============================================================ */}

        <button
          type="button"
          aria-label={mobileMenuOpen ? 'Close collections menu' : 'Open collections menu'}
          aria-expanded={mobileMenuOpen}
          aria-haspopup="true"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="flex cursor-pointer list-none items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition outline-none focus-visible:ring-2"
        >
          {mobileMenuOpen ? (
            <AppIconMap.X className="h-5 w-5 shrink-0" aria-hidden="true" />
          ) : (
            <AppIconMap.Menu className="h-5 w-5 shrink-0" aria-hidden="true" />
          )}

          <span>Collections</span>
        </button>

        {/* ============================================================
            MOBILE MENU PANEL
            ============================================================ */}

        {mobileMenuOpen && (
          <div className="bg-surface absolute top-full left-0 w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-b-2xl">
            <div className="max-h-[75vh] overflow-y-auto p-2">
              {(groups as Group[]).map((group) => {
                const Icon = AppIconMap[group.icon ?? 'Shapes'] ?? AppIconMap.Shapes;

                const groupCategories = getCategoriesForGroup(group.name);

                return (
                  <details key={group.id} className="group/mobile">
                    <summary className="flex cursor-pointer list-none items-center gap-3 rounded-xl px-3 py-3 [&::-webkit-details-marker]:hidden">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                      </span>

                      <span className="flex-1 text-left text-sm font-medium">{group.name}</span>

                      <span
                        className="text-xs text-neutral-400 transition-transform group-open/mobile:rotate-180"
                        aria-hidden="true"
                      >
                        ↓
                      </span>
                    </summary>

                    <div className="pr-2 pb-2 pl-12">
                      {groupCategories.map((category) => {
                        const categoryCollections = getCollections(group.name, category.name);

                        if (!categoryCollections.length) {
                          return null;
                        }

                        return (
                          <details key={category.id} className="group/category mb-1 last:mb-0">
                            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-2 text-xs uppercase [&::-webkit-details-marker]:hidden">
                              <span className="flex-1">{category.name}</span>

                              <span
                                className="text-xs text-neutral-400 transition-transform group-open/category:rotate-180"
                                aria-hidden="true"
                              >
                                ↓
                              </span>
                            </summary>

                            <div className="pb-2 pl-3">
                              {categoryCollections.map((collection) => (
                                <Link
                                  key={collection.id}
                                  href={`/c/${collection.id}/`}
                                  className="block rounded-lg px-2 py-2 text-xs transition"
                                  onClick={handleMobileLinkClick}
                                >
                                  {collection.name}
                                </Link>
                              ))}
                            </div>
                          </details>
                        );
                      })}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
