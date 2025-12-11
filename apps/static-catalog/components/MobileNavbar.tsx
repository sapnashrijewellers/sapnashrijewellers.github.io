"use client";

import Link from "next/link";
import { Home, Search, Calculator, Heart, BadgeCheck } from "lucide-react";

export default function MobileNavbar() {


  const navItems = [
      { label: "Home", icon: <Home size={22} />, href: "/",title:"Go to home page of Sapna Shri Jewellers" },
      { label: "Hallmark", icon: <BadgeCheck size={22} />, href: "/huid", title:"Learn more about Hallmark" },
      { label: "Calculator", icon: <Calculator size={22} />, href: "/calculator",title:"Jewellery price calculator" },
      { label: "Search", icon: <Search size={22} />, href: "/search", title:"Search jewellery" },
      { label: "Wishlist", icon: <Heart size={22} />, href: "/wishlist" ,title:"See all wish-list items" },
    ];

  return (
    <>
      {/* Navbar */}
      <nav className="fixed bottom-0 left-0 w-full z-30 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-700 md:hidden">
        <div className="grid grid-cols-5 text-center py-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex flex-col items-center gap-1 text-neutral-700 dark:text-neutral-200 hover:text-purple-600 dark:hover:text-purple-400 transition"
             title={item.title}
            >
              {item.icon}
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
