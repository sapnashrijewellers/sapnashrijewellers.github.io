import Link from 'next/link'; // or 'react-router-dom', depending on your setup
import BrandLogo from '../common/BrandLogo';
import SearchBar from '@/components/common/SearchBar';
import CatalogNavigation from './CatalogNavigation';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = '' }: NavbarProps) {
  return (
    <header
      role="banner"
      aria-label="Site header and navigation"
      className={`bg-surface/95 sticky top-0 z-30 w-full backdrop-blur-md transition-colors duration-150 ${className}`}
    >
      <div className="container mx-auto px-2 min-[400px]:px-4 sm:px-6">
        <div className="flex min-h-16 items-center justify-between gap-4 py-2 sm:gap-8">
          {/* Unified Brand Identity Unit (Logo + H1 + Tagline) */}
          <Link
            href="/"
            className="group focus-visible:ring-ring flex shrink-0 items-center gap-3 rounded-lg text-left transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Sapna Shri Jewellers - Home"
          >
            <BrandLogo className="shrink-0 transition-transform duration-200 group-hover:scale-[1.02]" />

            <div className="flex hidden flex-col justify-center md:block">
              <h1 className="text-foreground text-base leading-tight font-semibold tracking-tight sm:text-lg lg:text-xl">
                Sapna Shri Jewellers
              </h1>

              <p className="text-secondary text-muted-foreground line-clamp-1 text-[11px] leading-tight sm:text-xs">
                Modern Silver &amp; Gold Jewellery, Backed by 35+ Years of Trust
              </p>
            </div>
          </Link>

          {/* Right Action Cluster: Search & Catalogue Utilities */}
          <div className="flex min-w-0 flex-1 items-center justify-end">
            <SearchBar className="w-full max-w-md lg:max-w-xl" />
          </div>
        </div>
      </div>

      <CatalogNavigation />
    </header>
  );
}
