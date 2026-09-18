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
      className={`bg-surface/95 sticky top-0 z-30 w-full backdrop-blur-md transition-colors duration-150 ${className} `}
    >
      <div className="container mx-auto px-2 min-[400px]:px-4 sm:px-6">
        <div className="flex min-h-24 items-center gap-2 min-[400px]:gap-4 lg:gap-6">
          <BrandLogo className="shrink-0" />

          <div className="hidden min-w-0 shrink-0 lg:block">
            <h1 className="text-primary text-xl leading-tight font-semibold tracking-tight">Sapna Shri Jewellers</h1>

            <p className="text-secondary mt-1 text-sm leading-tight">
              Modern Silver &amp; Gold Jewellery, Backed by 35+ Years of Trust
            </p>
          </div>

          <div className="ml-auto min-w-0 flex-1">
            <SearchBar className="w-full max-w-2xl" />
          </div>
        </div>
      </div>
      <CatalogNavigation />
    </header>
  );
}
