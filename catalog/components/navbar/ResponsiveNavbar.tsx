"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialAuthMenu from "@/components/auth/SocialAuthMenu";
import {
    Home,
    Search,
    Calculator,
    Heart,
    BadgeCheck,
    Menu,
    Info,
    QrCode,
} from "lucide-react";
import { useState } from "react";

type NavItem = {
    label: string;
    href: string;
    title: string;
    icon: React.ReactNode;
};

const PRIMARY_NAV: NavItem[] = [
    { label: "Home", href: "/", title: "Go to home page", icon: <Home size={22} /> },
    { label: "Hallmark", href: "/huid", title: "Hallmark details", icon: <BadgeCheck size={22} /> },
    { label: "Calculator", href: "/calculator", title: "Jewellery calculator", icon: <Calculator size={22} /> },
    { label: "Wishlist", href: "/wishlist", title: "Wishlist", icon: <Heart size={22} /> },
];

const SECONDARY_NAV: NavItem[] = [
    { label: "About", href: "/about-us", title: "About us", icon: <Info size={20} /> },
    { label: "QR", href: "/qr", title: "QR info", icon: <QrCode size={20} /> },
    { label: "Search", href: "/search", title: "Search jewellery", icon: <Search size={22} /> },
];

export default function ResponsiveNavbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    const renderLink = (item: NavItem, mobile = false) => {
        const active = isActive(item.href);

        return (
            <Link
                key={item.href}
                href={item.href}
                title={item.title}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 transition
          ${active ? "text-highlight" : "text-primary"}
          ${mobile ? "active:scale-95" : "group-hover:scale-110"}`}
            >
                {item.icon}
                <span className={mobile ? "text-[11px]" : "text-[13px] font-medium"}>
                    {item.label}
                </span>

                {/* Desktop underline */}
                {!mobile && (
                    <span
                        className={`absolute -bottom-1 h-[2px] w-full origin-left bg-accent transition-transform duration-300
              ${active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}
                    />
                )}
            </Link>
        );
    };

    const renderMobileMenuLink = (item: NavItem) => {
  const active = isActive(item.href);

  return (
    <Link
      key={item.href}
      href={item.href}
      role="menuitem"
      aria-current={active ? "page" : undefined}
      onClick={() => setOpen(false)}
      className={`flex flex-col items-center gap-1 transition active:scale-95
        ${active ? "text-highlight" : "text-primary"}`}
    >
      {item.icon}
      <span className="text-[11px]">{item.label}</span>
    </Link>
  );
};


    return (
        <>
            {/* ================= MOBILE NAV ================= */}
            <nav
                className="fixed bottom-0 left-0 z-[100] w-full border-t bg-surface md:hidden"
                role="navigation"
                aria-label="Mobile navigation"
            >
                <div className="grid grid-cols-5 py-2 text-center">
                    {PRIMARY_NAV.map((item) => renderLink(item, true))}

                    {/* Hamburger */}
                    <button
                        onClick={() => setOpen((v) => !v)}
                        aria-expanded={open}
                        aria-label="More options"
                        className="flex flex-col items-center gap-1 text-primary active:scale-95"
                    >
                        <Menu size={22} />
                        <span className="text-[11px] font-medium">More</span>
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {open && (
                    <div
                        className="absolute bottom-14 left-2 right-2 z-[110] rounded-xl border bg-surface shadow-lg grid grid-cols-5 py-2 text-center"
                        role="menu"
                    >
                        {SECONDARY_NAV.map(renderMobileMenuLink)}

                        {/* 🔐 Social login hook */}
                        <SocialAuthMenu mobile onAction={() => setOpen(false)} />
                    </div>
                )}
            </nav>

            {/* ================= DESKTOP NAV ================= */}
            <div
                className="relative hidden items-end justify-end gap-6 mb-3 md:flex"
                role="navigation"
                aria-label="Desktop navigation"
            >
                {[...PRIMARY_NAV, ...SECONDARY_NAV].map((item) => (
                    <div key={item.href} className="relative group">
                        {renderLink(item)}
                    </div>
                ))}

                {/* 🔐 Desktop auth hook */}
                <SocialAuthMenu />
            </div>
        </>
    );
}
