// context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    // Defer Firebase Auth listener until after initial paint & idle
    const handleIdle = () => {
      const init = async () => {
        const [{ onAuthStateChanged }, { getFirebaseAuthInstance }] = await Promise.all([
          import("firebase/auth"),
          import("@/utils/firebase"),
        ]);

        const { auth } = await getFirebaseAuthInstance();
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setLoading(false);
        });
      };
      init();
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(handleIdle, { timeout: 3000 });
    } else {
      setTimeout(handleIdle, 1500);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);