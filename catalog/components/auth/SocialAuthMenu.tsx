"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import Image from "next/image";

type Props = {
  onAction?: () => void;
  mobile?: boolean;
};

export default function SocialAuthMenu({ onAction, mobile }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const login = useCallback(async () => {
    try {
      setLoading(true);
      // Dynamic imports prevent initial page load from requesting Firebase iframe/APIs
      const [{ signInWithPopup }, { getFirebaseAuthInstance }] = await Promise.all([
        import("firebase/auth"),
        import("@/utils/firebase"),
      ]);

      const { auth, googleProvider } = await getFirebaseAuthInstance();
      await signInWithPopup(auth, googleProvider);
      onAction?.();
    } catch (err) {
      console.error("Authentication failed:", err);
    } finally {
      setLoading(false);
    }
  }, [onAction]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      const [{ signOut }, { getFirebaseAuthInstance }] = await Promise.all([
        import("firebase/auth"),
        import("@/utils/firebase"),
      ]);

      const { auth } = await getFirebaseAuthInstance();
      await signOut(auth);
      onAction?.();
    } catch (err) {
      console.error("Sign out failed:", err);
    } finally {
      setLoading(false);
    }
  }, [onAction]);

  const baseClasses =
    "inline-flex flex-col items-center justify-center gap-1 rounded-xl p-2 text-foreground/80 hover:text-foreground hover:bg-theme/10 transition-[transform,opacity,background-color] duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary will-change-[transform,opacity] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  /* ================= LOGGED IN ================= */
  if (user) {
    const displayName = user.displayName || "User account";
    const photoURL = user.photoURL;

    return (
      <button
        type="button"
        onClick={logout}
        disabled={loading}
        aria-label={`Log out (${displayName})`}
        role={mobile ? "menuitem" : undefined}
        className={baseClasses}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
        ) : photoURL ? (
          <Image
            src={photoURL}
            alt={`${displayName} profile photo`}
            width={32}
            height={32}
            sizes="32px"
            loading="lazy"
            decoding="async"
            className="h-8 w-8 rounded-full border border-theme/40 object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <LogOut className="h-5 w-5 text-current" aria-hidden="true" />
        )}
        <span className="sr-only">Sign out of {displayName}</span>
      </button>
    );
  }

  /* ================= LOGGED OUT ================= */
  return (
    <button
      type="button"
      onClick={login}
      disabled={loading}
      aria-label="Sign in with Google"
      role={mobile ? "menuitem" : undefined}
      className={baseClasses}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
      ) : (
        <LogIn className="h-5 w-5 text-current" aria-hidden="true" />
      )}
      <span className="sr-only">Sign in with Google</span>
    </button>
  );
}