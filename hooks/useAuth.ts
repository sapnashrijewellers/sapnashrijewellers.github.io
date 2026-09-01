"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type { User } from "firebase/auth";

import {
  getCachedUser,
  getCurrentUser,
  subscribeAuth,
  type AuthUserSnapshot,
} from "@/utils/auth/auth";

interface UseAuthResult {
  user: AuthUserSnapshot | null;
  firebaseUser: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function useAuth(): UseAuthResult {
  const [user, setUser] =
    useState<AuthUserSnapshot | null>(
      getCachedUser,
    );

  const [firebaseUser, setFirebaseUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const currentUser =
        await getCurrentUser();

      setFirebaseUser(currentUser);

      setUser(
        currentUser
          ? {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              email: currentUser.email,
              photoURL: currentUser.photoURL,
            }
          : null,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe =
      subscribeAuth((nextUser) => {
        setUser(nextUser);

        if (!nextUser) {
          setFirebaseUser(null);
        }
      });

    refresh();

    return unsubscribe;
  }, [refresh]);

  return {
    user,
    firebaseUser,
    loading,
    refresh,
  };
}