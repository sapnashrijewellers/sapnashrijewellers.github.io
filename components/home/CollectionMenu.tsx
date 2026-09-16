'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';

import collectionsData from '@/data/collections.json';
import categoriesData from '@/data/categories.json';
import { Category, Collection } from '@/types/catalog';

interface GroupedData {
  [groupName: string]: {
    [categoryName: string]: {
      categoryInfo: Category | null;
      collections: Collection[];
    };
  };
}

export default function ComponentMenu() {
  // Mobile drawer state
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [openMobileGroups, setOpenMobileGroups] = useState<Record<string, boolean>>({});
  const [openMobileCategories, setOpenMobileCategories] = useState<Record<string, boolean>>({});

  // Transform and organize catalog data
  const menuHierarchy: GroupedData = useMemo(() => {
    const activeCategories = (categoriesData as Category[]).filter((c) => c.active);
    const categoryMap = new Map<string, Category>(
      activeCategories.map((cat) => [cat.name.trim().toLowerCase(), cat])
    );

    const activeCollections = (collectionsData as Collection[])
      .filter((c) => c.active)
      .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));

    const hierarchy: GroupedData = {};

    activeCollections.forEach((item) => {
      const groupKey = item.group?.trim() || 'General';
      const categoryKey = item.category?.trim() || 'Other';

      if (!hierarchy[groupKey]) {
        hierarchy[groupKey] = {};
      }

      if (!hierarchy[groupKey][categoryKey]) {
        const matchedCat = categoryMap.get(categoryKey.toLowerCase()) || null;
        hierarchy[groupKey][categoryKey] = {
          categoryInfo: matchedCat,
          collections: [],
        };
      }

      hierarchy[groupKey][categoryKey].collections.push(item);
    });

    return hierarchy;
  }, []);

  const toggleMobileGroup = (group: string) => {
    setOpenMobileGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const toggleMobileCategory = (key: string) => {
    setOpenMobileCategories((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    /* Relative positioning sits here at the root header to anchor the full-width dropdown */
    <header className="relative z-50 w-full border-b border-neutral-200 bg-white shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Toggle Button */}
        <div className="flex w-full items-center justify-between py-3 lg:hidden">
          <span className="text-sm font-semibold tracking-wide uppercase text-neutral-800">
            Navigation
          </span>
          <button
            type="button"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="rounded-md p-1.5 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-hidden"
          >
            {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop Menu Strip */}
        <nav className="hidden w-full lg:flex lg:items-center lg:space-x-8">
          {Object.entries(menuHierarchy).map(([groupName, categories]) => (
            <div key={groupName} className="group py-4">
              {/* Level 1: Group (No Link) */}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide text-neutral-800 transition-colors duration-150 group-hover:text-neutral-950 focus:outline-hidden"
              >
                <span>{groupName}</span>
                <ChevronDown className="h-4 w-4 text-neutral-400 transition-transform duration-200 group-hover:rotate-180 group-hover:text-neutral-800" />
              </button>

              {/* Full-Width Mega Dropdown Panel (Level 2 & Level 3) */}
              <div className="invisible absolute top-full left-0 right-0 w-full border-t border-neutral-200 bg-white opacity-0 shadow-2xl transition-all duration-200 ease-out group-hover:visible group-hover:opacity-100">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {Object.entries(categories).map(([categoryName, { categoryInfo, collections }]) => {
                      const queryParam = encodeURIComponent(
                        categoryInfo?.keywords?.trim() || categoryName
                      );

                      return (
                        <div key={categoryName} className="flex flex-col space-y-3">
                          {/* Level 2: Category (Link to /search/?q=keywords) */}
                          <Link
                            href={`/search/?q=${queryParam}`}
                            className="group/cat flex items-center justify-between border-b border-neutral-100 pb-1.5 text-sm font-bold text-neutral-900 transition-colors hover:text-neutral-600"
                          >
                            <span>{categoryName}</span>
                            <ChevronRight className="h-3.5 w-3.5 text-neutral-400 transition-transform group-hover/cat:translate-x-0.5" />
                          </Link>

                          {/* Level 3: Collections (Link to /c/{collection.id}) */}
                          <ul className="space-y-2">
                            {collections.map((col) => (
                              <li key={col.id}>
                                <Link
                                  href={`/c/${col.id}`}
                                  className="block text-xs leading-relaxed text-neutral-600 transition-colors hover:text-neutral-950 hover:underline"
                                >
                                  {col.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile Drawer Navigation (Collapsible Accordion) */}
      {isMobileOpen && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-neutral-200 bg-neutral-50 px-4 py-3 lg:hidden">
          <div className="space-y-2">
            {Object.entries(menuHierarchy).map(([groupName, categories]) => {
              const isGroupOpen = !!openMobileGroups[groupName];

              return (
                <div key={groupName} className="rounded-md border border-neutral-200 bg-white">
                  {/* Mobile Level 1: Group */}
                  <button
                    type="button"
                    onClick={() => toggleMobileGroup(groupName)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-neutral-900"
                  >
                    <span>{groupName}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${
                        isGroupOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Mobile Submenu */}
                  {isGroupOpen && (
                    <div className="border-t border-neutral-100 px-4 py-2 space-y-3">
                      {Object.entries(categories).map(([categoryName, { categoryInfo, collections }]) => {
                        const catKey = `${groupName}-${categoryName}`;
                        const isCatOpen = !!openMobileCategories[catKey];
                        const queryParam = encodeURIComponent(
                          categoryInfo?.keywords?.trim() || categoryName
                        );

                        return (
                          <div key={categoryName} className="space-y-2 pt-1">
                            <div className="flex items-center justify-between">
                              {/* Mobile Level 2: Category Link */}
                              <Link
                                href={`/search/?q=${queryParam}`}
                                onClick={() => setIsMobileOpen(false)}
                                className="text-sm font-medium text-neutral-800 hover:text-neutral-950"
                              >
                                {categoryName}
                              </Link>

                              {/* Collapse button for Level 3 items */}
                              {collections.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => toggleMobileCategory(catKey)}
                                  className="p-1 text-neutral-400 hover:text-neutral-600"
                                  aria-label={`Toggle ${categoryName} collections`}
                                >
                                  <ChevronDown
                                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                      isCatOpen ? 'rotate-180' : ''
                                    }`}
                                  />
                                </button>
                              )}
                            </div>

                            {/* Mobile Level 3: Collection Links */}
                            {isCatOpen && collections.length > 0 && (
                              <ul className="space-y-1.5 border-l-2 border-neutral-200 pl-3">
                                {collections.map((col) => (
                                  <li key={col.id}>
                                    <Link
                                      href={`/c/${col.id}`}
                                      onClick={() => setIsMobileOpen(false)}
                                      className="block text-xs text-neutral-600 hover:text-neutral-950"
                                    >
                                      {col.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}