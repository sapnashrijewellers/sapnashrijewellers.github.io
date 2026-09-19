'use client';

import Link from 'next/link';

import { AppIconMap } from '@/utils/appIcons';

import CatalogNavigationMobile from './CatalogNavigationMobile';
import CatalogNavigationDesktop from './CatalogNavigationDesktop';
import CatalogNavigationAccount from './CatalogNavigationAccount';

import { NavItem } from '@/types/catalog';

const utilityNav: NavItem[] = [
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
];

function NavigationUtilities({ mobile = false }: { mobile?: boolean }) {
  return (
    <div
      className={
        mobile
          ? 'flex shrink-0 items-center gap-1'
          : 'ml-auto flex shrink-0 items-center gap-1 border-l border-black/[0.08] pl-4'
      }
    >
      {utilityNav.map((item) => {
        const Icon = item.icon;

        if (mobile) {
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className="flex h-10 w-10 items-center justify-center rounded-full transition"
            >
              <Icon className="h-[19px] w-[19px]" aria-hidden="true" />
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className="group/utility flex items-center gap-2 rounded-full px-3 py-2 text-sm transition"
          >
            <Icon className="h-[18px] w-[18px] transition-transform group-hover/utility:scale-105" aria-hidden="true" />

            <span className="hidden xl:inline">{item.label}</span>
          </Link>
        );
      })}

      <CatalogNavigationAccount mobile={mobile} />
    </div>
  );
}

export default function CatalogNavigation() {
  return (
    <nav aria-label="Jewellery catalog navigation" className="relative z-50 w-full">
      {/* ============================================================
          MOBILE / TABLET NAVIGATION
          ============================================================ */}

      <div className="lg:hidden">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="flex min-h-10 items-center justify-between gap-2">
            <CatalogNavigationMobile />

            <NavigationUtilities mobile />
          </div>
        </div>
      </div>

      {/* ============================================================
          DESKTOP NAVIGATION
          ============================================================ */}

      <div className="hidden lg:block">
        <div className="mx-auto max-w-screen-xl px-6">
          <div className="flex min-h-10 items-center">
            <CatalogNavigationDesktop />

            <NavigationUtilities />
          </div>
        </div>
      </div>
    </nav>
  );
}
