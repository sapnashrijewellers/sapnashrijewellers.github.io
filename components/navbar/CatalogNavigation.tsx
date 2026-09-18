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

export default function CatalogNavigation() {
  return (
    <nav
      aria-label="Jewellery catalog navigation"
      className="relative z-50 w-full border-b border-black/[0.08] bg-white dark:border-white/[0.08] dark:bg-neutral-950"
    >
      {/* ============================================================
          MOBILE / TABLET NAVIGATION
          ============================================================ */}

      <div className="lg:hidden">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="flex min-h-14 items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1">
              {/* Mobile menu */}

              <details className="group relative">
                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-black/[0.04] dark:text-neutral-200 dark:hover:bg-white/[0.06] [&::-webkit-details-marker]:hidden">
                  <AppIconMap.Menu className="h-5 w-5 shrink-0" aria-hidden="true" />

                  <span>Collections</span>
                </summary>

                <div className="absolute top-full left-0 mt-2 w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:border-white/[0.08] dark:bg-neutral-950">
                  <div className="max-h-[75vh] overflow-y-auto p-2">
                    {(groups as Group[]).map((group) => {
                      const Icon = AppIconMap[group.icon ?? 'Shapes'] ?? AppIconMap.Shapes;

                      const groupCategories = getCategoriesForGroup(group.name);

                      return (
                        <details
                          key={group.id}
                          className="group/mobile border-b border-black/[0.06] last:border-0 dark:border-white/[0.06]"
                        >
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
                                  <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-2 text-xs uppercase hover:bg-black/[0.04] dark:text-neutral-300 dark:hover:bg-white/[0.05] [&::-webkit-details-marker]:hidden">
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
                                        className="block rounded-lg px-2 py-2 text-xs transition hover:bg-black/[0.04] hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
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
              </details>
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
                    className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/[0.05] hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-white/[0.07] dark:hover:text-white"
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
          <div className="flex min-h-14 items-center">
            {/* Catalog groups */}

            <div className="flex min-w-0 flex-1 items-center gap-1">
              {(groups as Group[]).map((group) => {
                const Icon = AppIconMap[group.icon ?? 'Shapes'] ?? AppIconMap.Shapes;

                const groupCategories = getCategoriesForGroup(group.name);

                return (
                  <div key={group.id} className="group relative">
                    {/* Group trigger */}

                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium whitespace-nowrap text-neutral-700 transition outline-none hover:bg-black/[0.04] hover:text-neutral-950 focus-visible:ring-2 focus-visible:ring-black/20 dark:text-neutral-200 dark:hover:bg-white/[0.06] dark:hover:text-white dark:focus-visible:ring-white/30"
                      aria-haspopup="true"
                    >
                      <Icon className="h-[17px] w-[17px]" aria-hidden="true" />

                      <span>{group.name}</span>

                      <span
                        className="text-[10px] text-neutral-400 transition-transform group-hover:rotate-180"
                        aria-hidden="true"
                      >
                        ↓
                      </span>
                    </button>

                    {/* =================================================
                        DESKTOP MEGA MENU
                        ================================================= */}

                    <div className="invisible absolute top-full left-0 pt-2 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                      <div className="w-[min(760px,calc(100vw-3rem))] overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.14)] dark:border-white/[0.08] dark:bg-neutral-950">
                        <div className="grid max-h-[70vh] grid-cols-2 gap-x-8 overflow-y-auto p-6 xl:grid-cols-3">
                          {groupCategories.map((category) => {
                            const categoryCollections = getCollections(group.name, category.name);

                            if (!categoryCollections.length) {
                              return null;
                            }

                            return (
                              <div key={category.id} className="mb-6 min-w-0">
                                {/* Category */}

                                <Link
                                  href={`/search/?${category.keywords}/`}
                                  className="mb-2 block text-xs font-semibold uppercase transition"
                                >
                                  {category.name}
                                </Link>

                                {/* Collections */}

                                <div className="space-y-0.5">
                                  {categoryCollections.map((collection) => (
                                    <Link
                                      key={collection.id}
                                      href={`/c/${collection.id}/`}
                                      className="group/item block rounded-lg px-2 py-1.5 text-sm leading-5 transition hover:bg-black/[0.04] dark:text-neutral-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
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
                  </div>
                );
              })}
            </div>

            {/* ==========================================================
                DESKTOP UTILITY NAVIGATION
                ========================================================== */}

            <div className="ml-auto flex shrink-0 items-center gap-1 border-l border-black/[0.08] pl-4 dark:border-white/[0.08]">
              {primaryNav.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group/utility flex items-center gap-2 rounded-full px-3 py-2 text-sm transition hover:bg-black/[0.04] hover:text-neutral-950 dark:text-neutral-300 dark:hover:bg-white/[0.06] dark:hover:text-white"
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
    </nav>
  );
}
