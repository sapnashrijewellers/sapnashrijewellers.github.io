"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Menu,
  X,
  ShoppingCart,
  LogIn,
  LogOut,
  ClipboardList,
} from "lucide-react";
import { useState, useCallback, useId, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

interface NavItem {
  label: string;
  title: string;
  ariaLabel: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export default function ResponsiveNavbar() {
  const { user, loading: authLoading } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authPending, setAuthPending] = useState(false);

  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const menuId = useId();

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const login = useCallback(async () => {
    try {
      setAuthPending(true);
      const [{ signInWithPopup }, { getFirebaseAuthInstance }] = await Promise.all([
        import("firebase/auth"),
        import("@/utils/firebase"),
      ]);

      const { auth, googleProvider } = await getFirebaseAuthInstance();
      await signInWithPopup(auth, googleProvider);
      closeMenu();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setAuthPending(false);
    }
  }, [closeMenu]);

  const logout = useCallback(async () => {
    try {
      setAuthPending(true);
      const [{ signOut }, { getFirebaseAuthInstance }] = await Promise.all([
        import("firebase/auth"),
        import("@/utils/firebase"),
      ]);

      const { auth } = await getFirebaseAuthInstance();
      await signOut(auth);
      closeMenu();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setAuthPending(false);
    }
  }, [closeMenu]);

  /** Close mobile dropdown on outside click or ESC key */
  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const displayName = user?.displayName || "User account";

  const PRIMARY_NAV: NavItem[] = [
    {
      label: "Wishlist",
      href: "/wishlist/",
      title: "Wishlist",
      ariaLabel: "View your saved Wishlist items",
      icon: (
        <Heart
          className="w-5 h-5 md:w-5 md:h-5 text-current"
          aria-hidden="true"
        />
      ),
    },
    {
      label: "Cart",
      href: "/cart/",
      title: "Shopping Cart",
      ariaLabel: "View items in your Shopping Cart",
      icon: (
        <ShoppingCart
          className="w-5 h-5 md:w-5 md:h-5 text-current"
          aria-hidden="true"
        />
      ),
    },
    ...(user
      ? [
          {
            label: "Orders",
            href: "/orders/",
            title: "Your Orders",
            ariaLabel: "View your previous jewellery orders and purchases",
            icon: (
              <ClipboardList
                className="w-5 h-5 md:w-5 md:h-5 text-current"
                aria-hidden="true"
              />
            ),
          },
        ]
      : []),
    {
      label: user ? "Sign Out" : "Sign In",
      title: user ? `Sign out of ${displayName}` : "Sign in with Google",
      ariaLabel: user
        ? `Sign out of account (${displayName})`
        : "Sign in to account with Google",
      icon: user ? (
        user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={`${displayName} profile avatar`}
            width={22}
            height={22}
            sizes="22px"
            loading="lazy"
            decoding="async"
            className="w-5 h-5 rounded-full object-cover border border-theme/40"
            referrerPolicy="no-referrer"
          />
        ) : (
          <LogOut className="w-5 h-5 text-current" aria-hidden="true" />
        )
      ) : (
        <LogIn className="w-5 h-5 text-current" aria-hidden="true" />
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

  const renderItem = (item: NavItem, isMobileDropdown = false) => {
    const active = isActive(item.href);

    const baseClass = isMobileDropdown
      ? `flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-[background-color,color] duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-primary ${
          active
            ? "bg-accent text-accent-foreground font-semibold"
            : "text-foreground/85 hover:bg-theme/10 hover:text-foreground"
        }`
      : `inline-flex flex-col items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-foreground/80 hover:text-foreground hover:bg-theme/10 transition-[color,transform,background-color] duration-150 ease-out active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary will-change-[transform] ${
          active ? "text-primary font-bold" : ""
        }`;

    const content = (
      <>
        <span className="flex items-center justify-center shrink-0">
          {item.icon}
        </span>
        <span
          className={
            isMobileDropdown
              ? "leading-tight"
              : "text-xs leading-none font-medium"
          }
        >
          {item.label}
        </span>
      </>
    );

    if (item.onClick) {
      return (
        <button
          key={item.label}
          type="button"
          disabled={authPending || authLoading}
          onClick={item.onClick}
          title={item.title}
          aria-label={item.ariaLabel}
          className={baseClass}
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
        aria-label={item.ariaLabel}
        aria-current={active ? "page" : undefined}
        className={baseClass}
        onClick={closeMenu}
      >
        {content}
      </Link>
    );
  };

  return (
    <div className="flex items-center">
      {/* Mobile Navigation Drawer / Dropdown */}
      <div ref={menuContainerRef} className="md:hidden relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open primary navigation menu"
          }
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          aria-controls={menuId}
          className="inline-flex items-center justify-center p-2 rounded-xl border border-theme/40 bg-surface text-foreground shadow-sm hover:bg-theme/10 active:scale-95 transition-[transform,background-color] duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-primary will-change-[transform]"
        >
          {menuOpen ? (
            <X className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Menu className="w-5 h-5" aria-hidden="true" />
          )}
        </button>

        <div
          id={menuId}
          role="menu"
          aria-label="Mobile navigation options"
          aria-hidden={!menuOpen}
          className={`
            absolute right-0 top-full mt-2 w-56 bg-surface border border-theme 
            rounded-2xl shadow-xl z-50 p-2 flex flex-col gap-1 transition-[opacity,transform] duration-150 ease-out will-change-[transform,opacity]
            ${
              menuOpen
                ? "opacity-100 scale-100 pointer-events-auto visible"
                : "opacity-0 scale-95 pointer-events-none hidden"
            }
          `}
        >
          {PRIMARY_NAV.map((item) => renderItem(item, true))}
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <div
        role="navigation"
        aria-label="Desktop primary menu"
        className="hidden md:flex items-center gap-1.5"
      >
        {PRIMARY_NAV.map((item) => renderItem(item, false))}
      </div>
    </div>
  );
}