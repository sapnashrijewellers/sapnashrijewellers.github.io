import ResponsiveNavbar from "@/components/navbar/ResponsiveNavbar";
import BrandLogo from "../common/BrandLogo";
import SearchBar from "@/components/common/SearchBar";

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = "" }: NavbarProps) {
  return (
    <header
      role="banner"
      aria-label="Site header and navigation"
      className={`sticky top-0 z-30 w-full bg-surface/95 backdrop-blur-md  border-theme/20 transition-colors duration-150 ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
        {/* TOP ROW */}
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* LEFT: Logo */}
          <div className="flex-shrink-0">
            <BrandLogo />
          </div>

          {/* CENTER (Desktop / Tablet): Search Form */}
          <div className="hidden md:flex flex-1 justify-center max-w-xl mx-auto">
            <SearchBar />
          </div>

          {/* RIGHT: Main Navigation & Actions */}
          <nav
            aria-label="Primary navigation menu"
            className="flex items-center flex-shrink-0 gap-2"
          >
            <ResponsiveNavbar />
          </nav>
        </div>

        {/* SECOND ROW (Mobile Viewport Search Bar) */}
        <div className="mt-2.5 md:hidden w-full">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}