'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AppIconMap } from '@/utils/appIcons';

import groups from '@/data/groups.json';
import categories from '@/data/categories.json';
import collections from '@/data/collections.json';
import { Category, Collection, NavItem, Group } from '@/types/catalog';

const primaryNav: NavItem[] = [
  {
    label: 'Wishlist',
    href: '/wishlist/',
    icon: AppIconMap.Heart,
  },
  {
    label: 'Cart',
    href: '/cart/',
    icon: AppIconMap.ShoppingBag,
  },
  {
    label: 'Orders',
    href: '/orders/',
    icon: AppIconMap.ClipboardList,
  },
];

function getCollections(groupName: string, categoryName: string): Collection[] {
  return (collections as Collection[])
    .filter(
      (collection) =>
        collection.active !== false && collection.group === groupName && collection.category === categoryName,
    )
    .sort((a, b) => (a.rank ?? 9999) - (b.rank ?? 9999));
}

function getCategoriesForGroup(groupName: string): Category[] {
  const groupCollections = (collections as Collection[]).filter(
    (collection) => collection.active !== false && collection.group === groupName,
  );

  const categoryNames = new Set(groupCollections.map((collection) => collection.category));

  return (categories as Category[])
    .filter((category) => category.active !== false && categoryNames.has(category.name))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/* ================================================================
   DESKTOP MEGA MENU POSITIONING

   The menu is centered around the hovered group whenever possible.

   If centering would push it outside the viewport, the position is
   automatically clamped to the viewport edges.

   This makes the solution independent of:
   - number of groups
   - group names
   - group ordering
   - navigation width
   ================================================================ */

function getMegaMenuPosition(trigger: HTMLElement) {
  const rect = trigger.getBoundingClientRect();

  const viewportPadding = 16;

  const menuWidth = Math.min(760, window.innerWidth - viewportPadding * 2);

  const idealLeft = rect.left + rect.width / 2 - menuWidth / 2;

  const maxLeft = window.innerWidth - menuWidth - viewportPadding;

  const left = Math.max(viewportPadding, Math.min(idealLeft, maxLeft));

  return {
    left,
    top: rect.bottom,
    width: menuWidth,
  };
}

export default function CatalogNavigation() {
  /* ================================================================
     MOBILE MENU STATE
     ================================================================ */

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* ================================================================
     DESKTOP MENU STATE
     ================================================================ */

  const [activeGroupId, setActiveGroupId] = useState<number | 0>(0);

  const [megaMenuPosition, setMegaMenuPosition] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);

  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  /* ================================================================
     DESKTOP MENU OPEN
     ================================================================ */

  const openMegaMenu = useCallback((groupId: number) => {
    const trigger = triggerRefs.current[groupId];

    if (!trigger) {
      return;
    }

    const position = getMegaMenuPosition(trigger);

    setMegaMenuPosition(position);
    setActiveGroupId(groupId);
  }, []);

  /* ================================================================
     DESKTOP MENU CLOSE
     ================================================================ */

  const closeMegaMenu = useCallback(() => {
    setActiveGroupId(0);
    setMegaMenuPosition(null);
  }, []);

  /* ================================================================
     RECALCULATE DESKTOP MENU POSITION

     Handles:
     - browser resize
     - responsive layout changes
     - browser zoom
     ================================================================ */

  useEffect(() => {
    if (!activeGroupId) {
      return;
    }

    const handleResize = () => {
      const trigger = triggerRefs.current[activeGroupId];

      if (!trigger) {
        return;
      }

      setMegaMenuPosition(getMegaMenuPosition(trigger));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [activeGroupId]);

  /* ================================================================
     ESCAPE KEY

     Closes either desktop or mobile menu.
     ================================================================ */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      setMobileMenuOpen(false);
      closeMegaMenu();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeMegaMenu]);

  /* ================================================================
     MOBILE OUTSIDE CLICK

     Because the mobile menu is an absolutely positioned panel,
     clicking/tapping outside the navigation closes it.
     ================================================================ */

  const mobileNavRef = useRef<HTMLDivElement | null>(null);

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
     MOBILE LINK CLICK

     Every navigation link closes the mobile menu immediately.
     ================================================================ */

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const activeGroup = (groups as Group[]).find((group) => group.id === activeGroupId);

  return (
    <nav aria-label="Jewellery catalog navigation" className="relative z-50 w-full">
      {/* ============================================================
          MOBILE / TABLET NAVIGATION
          ============================================================ */}

      <div className="lg:hidden">
        <div ref={mobileNavRef} className="mx-auto max-w-screen-xl px-4">
          <div className="flex min-h-10 items-center justify-between gap-2">
            {/* Mobile menu */}

            <div className="flex min-w-0 items-center gap-1">
              <div className="relative">
                {/* Hamburger / X */}

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

                {/* Mobile menu panel */}

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

            {/* Mobile utility navigation */}

            <div className="flex shrink-0 items-center gap-1">
              {primaryNav.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-label={item.label}
                    onClick={handleMobileLinkClick}
                    className="flex h-10 w-10 items-center justify-center rounded-full transition"
                  >
                    <Icon className="h-[19px] w-[19px]" aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          DESKTOP NAVIGATION
          ============================================================ */}

      <div className="hidden lg:block">
        <div className="mx-auto max-w-screen-xl px-6">
          <div className="flex min-h-10 items-center">
            {/* Catalog groups */}

            <div className="flex min-w-0 flex-1 items-center gap-1">
              {(groups as Group[]).map((group) => {
                const Icon = AppIconMap[group.icon ?? 'Shapes'] ?? AppIconMap.Shapes;

                return (
                  <div key={group.id} className="relative" onMouseEnter={() => openMegaMenu(group.id)}>
                    {/* Group trigger */}

                    <button
                      ref={(element) => {
                        triggerRefs.current[group.id] = element;
                      }}
                      type="button"
                      className="flex items-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium whitespace-nowrap transition outline-none focus-visible:ring-2"
                      aria-haspopup="true"
                      aria-expanded={activeGroupId === group.id}
                    >
                      <Icon className="h-[17px] w-[17px]" aria-hidden="true" />

                      <span>{group.name}</span>

                      <span
                        className={`text-[10px] text-neutral-400 transition-transform ${
                          activeGroupId === group.id ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      >
                        ↓
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Desktop utility navigation */}

            <div className="ml-auto flex shrink-0 items-center gap-1 border-l border-black/[0.08] pl-4">
              {primaryNav.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group/utility flex items-center gap-2 rounded-full px-3 py-2 text-sm transition"
                  >
                    <Icon
                      className="h-[18px] w-[18px] transition-transform group-hover/utility:scale-105"
                      aria-hidden="true"
                    />

                    <span className="hidden xl:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          SINGLE DESKTOP MEGA MENU

          Rendered outside individual group elements.

          This guarantees that only one mega menu can exist at
          a time.
          ============================================================ */}

      {activeGroup && megaMenuPosition && (
        <div
          className="fixed z-[60]"
          style={{
            left: megaMenuPosition.left,
            top: megaMenuPosition.top,
            width: megaMenuPosition.width,
          }}
          onMouseLeave={closeMegaMenu}
        >
          <div className="bg-surface overflow-hidden rounded-b-2xl shadow-[0_24px_70px_rgba(0,0,0,0.14)]">
            <div className="grid max-h-[70vh] grid-cols-2 gap-x-8 overflow-y-auto p-6 xl:grid-cols-3">
              {getCategoriesForGroup(activeGroup.name).map((category) => {
                const categoryCollections = getCollections(activeGroup.name, category.name);

                if (!categoryCollections.length) {
                  return null;
                }

                return (
                  <div key={category.id} className="mb-6 min-w-0">
                    {/* Category */}

                    <Link
                      href={`/search/?${category.keywords}/`}
                      className="mb-2 block text-xs font-semibold uppercase transition"
                      onClick={closeMegaMenu}
                    >
                      {category.name}
                    </Link>

                    {/* Collections */}

                    <div className="space-y-0.5">
                      {categoryCollections.map((collection) => (
                        <Link
                          key={collection.id}
                          href={`/c/${collection.id}/`}
                          className="group/item block rounded-lg px-2 py-1.5 text-sm leading-5 transition"
                          onClick={closeMegaMenu}
                        >
                          <span className="transition-transform group-hover/item:translate-x-0.5">
                            {collection.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
