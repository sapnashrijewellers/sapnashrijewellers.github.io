'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AppIconMap } from '@/utils/appIcons';
import { getCategoriesForGroup, getCollections } from './catalogNavigationUtils';
import groups from '@/data/groups.json';
import { Group } from '@/types/catalog';

/* ================================================================
   DESKTOP MEGA MENU POSITIONING

   Centers the menu around the hovered group whenever possible.

   If the menu would extend beyond the viewport, its position is
   clamped to the viewport edges.
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

export default function CatalogNavigationDesktop() {
  const [activeGroupId, setActiveGroupId] = useState<number | 0>(0);

  const [megaMenuPosition, setMegaMenuPosition] = useState<{
    left: number;
    top: number;
    width: number;
  } | null>(null);

  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  /* ================================================================
     OPEN MEGA MENU
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
     CLOSE MEGA MENU
     ================================================================ */

  const closeMegaMenu = useCallback(() => {
    setActiveGroupId(0);
    setMegaMenuPosition(null);
  }, []);

  /* ================================================================
     RECALCULATE POSITION

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
     ================================================================ */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMegaMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeMegaMenu]);

  const activeGroup = (groups as Group[]).find((group) => group.id === activeGroupId);

  return (
    <>
      {/* ============================================================
          CATALOG GROUPS
          ============================================================ */}

      <div className="flex min-w-0 flex-1 items-center gap-1">
        {(groups as Group[]).map((group) => {
          const Icon = AppIconMap[group.icon ?? 'Shapes'] ?? AppIconMap.Shapes;

          return (
            <div key={group.id} className="relative" onMouseEnter={() => openMegaMenu(group.id)}>
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

      {/* ============================================================
          SINGLE DESKTOP MEGA MENU

          Rendered outside individual group elements so that only
          one mega menu exists at any time.
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
    </>
  );
}
