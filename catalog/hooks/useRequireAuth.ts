"use client";

import { useAuth } from "@/context/AuthContext";

export function useRequireAuth(onUnauth?: () => void) {
  const user = useAuth();

  const requireAuth = () => {
    if (!user) {
      onUnauth?.();
      return false;
    }
    return true;
  };

  return {
    user,
    userId: user?.uid,
    isAuthenticated: !!user,
    requireAuth,
  };
}
