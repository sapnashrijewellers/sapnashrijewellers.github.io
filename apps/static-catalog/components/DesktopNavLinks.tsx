import React, { FC } from "react";
import Link from "next/link";
import { Home, Search, Calculator, Heart, BadgeCheck } from "lucide-react";

const DesktopTopLinks: FC = () => {
  const navItems = [
    { label: "Home", icon: <Home size={22} />, href: "/" },
    { label: "Hallmark", icon: <BadgeCheck size={22} />, href: "/huid" },
    { label: "Calculator", icon: <Calculator size={22} />, href: "/calculator" },
    { label: "Search", icon: <Search size={22} />, href: "/search" },
    { label: "Wishlist", icon: <Heart size={22} />, href: "/wishlist" },
  ];

  return (
    <div className="hidden md:flex flex-wrap items-end justify-end gap-4">
      {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex flex-col items-center gap-1 text-neutral-700 dark:text-neutral-200 hover:text-purple-600 dark:hover:text-purple-400 transition"
            >
              {item.icon}
              <span className="text-[13px] font-medium">{item.label}</span>
            </Link>
          ))}      
    </div>
  );
};

export default DesktopTopLinks;
