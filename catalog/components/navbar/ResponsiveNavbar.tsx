"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Triangle,
  Menu,
  X,
  ShoppingCart,
  LogIn,
  LogOut,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";
import { auth, googleProvider } from "@/utils/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

type NavItem = {
  label: string;
  title: string;
  ariaLabel?: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

export default function ResponsiveNavbar() {
  const { user, loading: authLoading } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setMenuOpen(false);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Do not render the navbar until Firebase has finished resolving auth state
  if (authLoading) {
    return null;
  }

  const PRIMARY_NAV: NavItem[] = [
    {
      label: "Hallmark",
      href: "/huid/",
      title: "Hallmark Verification",
      ariaLabel: "View Hallmark and HUID Verification",
      icon: <Triangle size={22} aria-hidden="true" />,
    },
    {
      label: "Wishlist",
      href: "/wishlist/",
      title: "Wishlist",
      ariaLabel: "View your Wishlist items",
      icon: <Heart size={22} aria-hidden="true" />,
    },
    {
      label: "Cart",
      href: "/cart/",
      title: "Cart",
      ariaLabel: "View your Shopping Cart",
      icon: <ShoppingCart size={22} aria-hidden="true" />,
    },

    ...(user
      ? [
          {
            label: "Orders",
            href: "/orders/",
            title: "Your Orders",
            ariaLabel: "View your previous orders and purchases",
            icon: <ClipboardList size={22} aria-hidden="true" />,
          },
        ]
      : []),

    {
      label: user ? "Sign Out" : "Sign In",
      title: user ? "Sign out of your account" : "Sign in with Google",
      ariaLabel: user ? "Sign out of your account" : "Sign in to your account with Google",
      icon: user ? (
        user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.displayName || "User profile photo"}
            width={24}
            height={24}
            className="h-6 w-6 rounded-full object-cover border border-gray-200"
            referrerPolicy="no-referrer"
            priority
          />
        ) : (
          <LogOut size={22} aria-hidden="true" />
        )
      ) : (
        <LogIn size={22} aria-hidden="true" />
      ),
      onClick: user ? logout : login,
    },
  ];

  const isActive = (href?: string) =>
    href
      ? href === "/"
        ? pathname === "/"
        : pathname.startsWith(href)
      : false;

  const renderItem = (item: NavItem) => {
    const active = isActive(item.href);
    const itemAriaLabel = item.ariaLabel || item.title || item.label;

    const cls = `
      flex flex-row md:flex-col
      items-center md:items-center
      gap-1 md:gap-1.5
      text-left md:text-center
      transition cursor-pointer
      ${active ? "text-primary-dark font-semibold" : ""}
    `;

    const content = (
      <>
        <span className="flex text-start items-center justify-center">
          {item.icon}
        </span>
        <span className="text-sm md:text-xs leading-none justify-center">
          {item.label}
        </span>
      </>
    );

    if (item.onClick) {
      return (
        <button
          key={item.label}
          type="button"
          onClick={item.onClick}
          title={item.title}
          aria-label={itemAriaLabel}
          className={cls}
        >
          {content}
        </button>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href!}
        title={item.title}
        aria-label={itemAriaLabel}
        aria-current={active ? "page" : undefined}
        className={cls}
        onClick={() => setMenuOpen(false)}
      >
        {content}
      </Link>
    );
  };

  return (
    <nav aria-label="Main Navigation" className="flex items-start md:items-center gap-1">
      {/* Mobile hamburger menu */}
      <div className="md:hidden relative">
        <button
          type="button"
          className="ssj-btn"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-dropdown"
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>

        {menuOpen && (
          <div
            id="mobile-nav-dropdown"
            className="absolute right-0 mt-2 w-48 bg-surface shadow-lg rounded-md p-2 flex flex-col gap-2 z-50"
          >
            {PRIMARY_NAV.map(renderItem)}
          </div>
        )}
      </div>

      {/* Desktop navigation bar */}
      <div className="hidden md:flex items-center gap-3">
        {PRIMARY_NAV.map(renderItem)}
      </div>
    </nav>
  );
}