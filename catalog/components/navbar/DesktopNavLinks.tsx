import React, { FC } from "react";
import Link from "next/link";
import { Home, Search, Calculator, Heart, BadgeCheck } from "lucide-react";

const DesktopTopLinks: FC = () => {
  const navItems = [
    { label: "Home", icon: <Home size={22} />, href: "/",title:"Go to home page of Sapna Shri Jewellers" },
    { label: "Hallmark", icon: <BadgeCheck size={22} />, href: "/huid", title:"Learn more about Hallmark" },
    { label: "Calculator", icon: <Calculator size={22} />, href: "/calculator",title:"Jewellery price calculator" },
    { label: "Search", icon: <Search size={22} />, href: "/search", title:"Search jewellery" },
    { label: "Wishlist", icon: <Heart size={22} />, href: "/wishlist" ,title:"See all wish-list items" },
  ];

  return (
    <div className="hidden md:flex flex-wrap items-end justify-end gap-4">
      {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex flex-col items-center gap-1  transition"
              title={item.title}
            >
              {item.icon}
              <span className="text-[13px] font-medium">{item.label}</span>
            </Link>
          ))}      
    </div>
  );
};

export default DesktopTopLinks;
