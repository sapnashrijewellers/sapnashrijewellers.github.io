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

  // Do not render the navbar until Firebase has
  // finished determining the authentication state.
  if (authLoading) {
    return null;
  }

  const PRIMARY_NAV: NavItem[] = [
    {
      label: "Hallmark",
      href: "/huid/",
      title: "Hallmark",
      icon: <Triangle size={22} />,
    },
    {
      label: "Wishlist",
      href: "/wishlist/",
      title: "Wishlist",
      icon: <Heart size={22} />,
    },
    {
      label: "Cart",
      href: "/cart/",
      title: "Cart",
      icon: <ShoppingCart size={22} />,
    },

    ...(user
      ? [
          {
            label: "Orders",
            href: "/orders/",
            title: "Your Orders",
            icon: <ClipboardList size={22} />,
          },
        ]
      : []),

    {
      label: user ? "Sign Out" : "Sign In",
      title: "Authentication",

      icon: user ? (
        user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.displayName || "User"}
            width={24}
            height={24}
            className="h-6 w-6 rounded-full object-cover border border-gray-200"
            referrerPolicy="no-referrer"
          />
        ) : (
          <LogOut size={22} />
        )
      ) : (
        <LogIn size={22} />
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

    const cls = `
      flex flex-row md:flex-col
      items-center md:items-center
      gap-1 md:gap-1.5
      text-left md:text-center
      transition cursor-pointer
      ${active ? "text-primary-dark" : ""}
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
        aria-current={active ? "page" : undefined}
        className={cls}
        onClick={() => setMenuOpen(false)}
      >
        {content}
      </Link>
    );
  };

  return (
    <div className="flex items-start md:items-center gap-1">

      {/* Mobile hamburger */}
      <div className="md:hidden relative">
        <button
          type="button"
          className="ssj-btn"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-surface shadow-lg rounded-md p-2 flex flex-col gap-2 z-50">
            {PRIMARY_NAV.map(renderItem)}
          </div>
        )}
      </div>

      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-2">
        {PRIMARY_NAV.map(renderItem)}
      </div>

    </div>
  );
}