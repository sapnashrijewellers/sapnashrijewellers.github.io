// utils/auth/auth.ts

import type { User } from "firebase/auth";
import { getFirebaseAuthInstance } from "@/utils/auth/firebase";

const AUTH_STORAGE_KEY = "ssj-auth-user";
const AUTH_EVENT = "ssj-auth-change";

export interface AuthUserSnapshot {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

/**
 * Convert Firebase User into a small serializable object.
 *
 * Never store the complete Firebase User object.
 */
function toUserSnapshot(user: User): AuthUserSnapshot {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  };
}

/**
 * Read cached authentication information.
 *
 * This does NOT initialize Firebase.
 */
export function getCachedUser(): AuthUserSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as AuthUserSnapshot;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

/**
 * Publish authentication state to the application.
 *
 * This updates:
 *   1. localStorage
 *   2. same-tab CustomEvent
 *
 * Firebase itself remains the source of truth.
 */
function publishAuthState(
  user: AuthUserSnapshot | null,
): void {
  if (typeof window === "undefined") {
    return;
  }

  if (user) {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(user),
    );
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  window.dispatchEvent(
    new CustomEvent<AuthUserSnapshot | null>(
      AUTH_EVENT,
      {
        detail: user,
      },
    ),
  );
}

/**
 * Subscribe to application-level authentication changes.
 *
 * This does NOT initialize Firebase.
 *
 * Handles:
 *   - login in the current tab
 *   - logout in the current tab
 *   - login/logout in another browser tab
 */
export function subscribeAuth(
  callback: (
    user: AuthUserSnapshot | null,
  ) => void,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const authHandler = (event: Event) => {
    const customEvent =
      event as CustomEvent<AuthUserSnapshot | null>;

    callback(customEvent.detail ?? null);
  };

  window.addEventListener(
    AUTH_EVENT,
    authHandler,
  );

  const storageHandler = (
    event: StorageEvent,
  ) => {
    if (event.key !== AUTH_STORAGE_KEY) {
      return;
    }

    if (!event.newValue) {
      callback(null);
      return;
    }

    try {
      callback(
        JSON.parse(event.newValue) as AuthUserSnapshot,
      );
    } catch {
      callback(null);
    }
  };

  window.addEventListener(
    "storage",
    storageHandler,
  );

  return () => {
    window.removeEventListener(
      AUTH_EVENT,
      authHandler,
    );

    window.removeEventListener(
      "storage",
      storageHandler,
    );
  };
}

/**
 * Sign in using Google.
 *
 * Firebase is initialized only when authentication
 * is actually requested.
 *
 * IMPORTANT:
 * Do not pass browserPopupRedirectResolver here.
 * Firebase's default popup handling is sufficient.
 */
export async function signInWithGoogle(): Promise<User> {
  const {
    auth,
    googleProvider,
  } = await getFirebaseAuthInstance();

  const {
    signInWithPopup,
  } = await import("firebase/auth");

  const result = await signInWithPopup(
    auth,
    googleProvider,
  );

  /**
   * Publish immediately so same-tab components
   * update without waiting for another Firebase
   * listener.
   */
  publishAuthState(
    toUserSnapshot(result.user),
  );

  return result.user;
}

/**
 * Sign out the current Firebase user.
 */
export async function signOutUser(): Promise<void> {
  const { auth } =
    await getFirebaseAuthInstance();

  const { signOut } =
    await import("firebase/auth");

  await signOut(auth);

  /**
   * Notify the rest of the application.
   */
  publishAuthState(null);
}

/**
 * Get the current Firebase user.
 *
 * This initializes Firebase Auth.
 *
 * Use this only when a component/page actually
 * needs the real Firebase User object.
 */
export async function getCurrentUser(): Promise<User | null> {
  const { auth } =
    await getFirebaseAuthInstance();

  /**
   * currentUser can temporarily be null while
   * Firebase restores persisted authentication.
   *
   * Wait for the first auth-state callback.
   */
  const {
    onAuthStateChanged,
  } = await import("firebase/auth");

  return new Promise<User | null>((resolve) => {
    let unsubscribe: (() => void) | undefined;

    unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe?.();

        resolve(user);
      },
    );
  });
}

/**
 * Require authentication.
 *
 * If already signed in:
 *   return current Firebase User.
 *
 * Otherwise:
 *   open Google sign-in popup.
 */
export async function requireAuth(): Promise<User> {
  const currentUser =
    await getCurrentUser();

  if (currentUser) {
    return currentUser;
  }

  return signInWithGoogle();
}