"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Heart, Triangle, Activity, Menu, X } from "lucide-react";
import { useState } from "react";

type NavItem = {
  label: string;
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

const PRIMARY_NAV: NavItem[] = [
  {
    label: "Hallmark",
    href: "/huid",
    title: "Hallmark",
    icon: <Triangle size={22} />,
  },
  {
    label: "Calculator",
    href: "/calculator",
    title: "Jewellery Price Calculator",
    icon: <Calculator size={22} />,
  },
  {
    label: "Wishlist",
    href: "/wishlist",
    title: "Wishlist",
    icon: <Heart size={22} />,
  },
  {
    label: "Rates",
    title: "Gold & Silver Rates",
    icon: <Activity size={22} className="animate-pulse" />,
    onClick: () => window.dispatchEvent(new Event("open-live-rates")),
  },
];

export default function ResponsiveNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href?: string) =>
    href ? (href === "/" ? pathname === "/" : pathname.startsWith(href)) : false;

  const renderItem = (item: NavItem) => {
    const active = isActive(item.href);
    const cls = `flex items-center gap-1 ssj-btn transition  ${
      active ? "text-primary-dark" : ""
    }`;

    if (item.onClick) {
      return (        
        <button key={item.label} onClick={item.onClick} title={item.title} className={cls}>
          {item.icon} <span className="md:hidden">{item.label}</span>
        </button>
        
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href!}
        title={item.title}
        aria-current={active ? "page" : undefined}
        className={cls}
      >
        {item.icon} <span className="md:hidden ">{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="flex items-center gap-4">
      {/* Live Rates always visible on mobile */}
      {PRIMARY_NAV.filter((item) => item.label === "Live Rates").map(renderItem)}

      {/* Hamburger for other items */}
      <div className="md:hidden relative">
        <button
          className="ssj-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-surface shadow-lg rounded-md p-2 flex flex-col gap-2 z-50">
            {PRIMARY_NAV.map(renderItem)}
          </div>
        )}
      </div>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-6">
        {PRIMARY_NAV.map(renderItem)}
      </div>
    </div>
  );
}
