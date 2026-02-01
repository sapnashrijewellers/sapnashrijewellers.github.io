"use client";

import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase";
import { useAuth } from "@/context/AuthContext";
import { LogIn, LogOut } from "lucide-react";

type Props = {
  onAction?: () => void; // close hamburger on mobile
  mobile?: boolean;
};

export default function SocialAuthMenu({ onAction, mobile }: Props) {
  const user = useAuth();

  const login = async () => {
    await signInWithPopup(auth, googleProvider);
    onAction?.();
  };

  const logout = async () => {
    await signOut(auth);
    onAction?.();
  };

  const baseClasses = `flex flex-col items-center gap-1 transition active:scale-95`;

  /* ================= LOGGED IN ================= */
  if (user) {
    return (
      <button
        onClick={logout}
        aria-label="Logout"
        role={mobile ? "menuitem" : undefined}
        className={baseClasses}
      >
        {user.user?.photoURL ? (
          <img
            src={user.user?.photoURL}
            alt={user.user?.displayName || "User profile"}
            className="h-8 w-8 rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <LogOut size={22} />
        )}

        
      </button>
    );
  }

  /* ================= LOGGED OUT ================= */
  return (
    <button
      onClick={login}
      aria-label="Login with Google"
      role={mobile ? "menuitem" : undefined}
      className={baseClasses}
    >
      <LogIn size={22} />
      
    </button>
  );
}
