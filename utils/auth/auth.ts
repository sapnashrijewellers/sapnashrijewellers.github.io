// utils/auth/auth.ts

import type { User } from 'firebase/auth';

const AUTH_STORAGE_KEY = 'ssj-auth-user';
const AUTH_EVENT = 'ssj-auth-change';

export interface AuthUserSnapshot {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}
let cachedUserSnapshot: AuthUserSnapshot | null = null;
let cacheInitialized = false;

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
function isAuthUserSnapshot(value: unknown): value is AuthUserSnapshot {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    typeof user.uid === 'string' &&
    (typeof user.displayName === 'string' || user.displayName === null) &&
    (typeof user.email === 'string' || user.email === null) &&
    (typeof user.photoURL === 'string' || user.photoURL === null)
  );
}
/**
 * Read cached authentication information.
 *
 * This does NOT initialize Firebase.
 */
export function getCachedUser(): AuthUserSnapshot | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (cacheInitialized) {
    return cachedUserSnapshot;
  }

  cacheInitialized = true;

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!raw) {
      cachedUserSnapshot = null;
      return null;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!isAuthUserSnapshot(parsed)) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      cachedUserSnapshot = null;
      return null;
    }

    cachedUserSnapshot = parsed;
    return cachedUserSnapshot;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);

    cachedUserSnapshot = null;

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
function publishAuthState(user: AuthUserSnapshot | null): void {
  if (typeof window === 'undefined') {
    return;
  }

  cachedUserSnapshot = user;
  cacheInitialized = true;

  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  window.dispatchEvent(
    new CustomEvent<AuthUserSnapshot | null>(AUTH_EVENT, {
      detail: user,
    }),
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
export function subscribeAuth(callback: (user: AuthUserSnapshot | null) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const authHandler = (event: Event) => {
    const customEvent = event as CustomEvent<AuthUserSnapshot | null>;

    callback(customEvent.detail ?? null);
  };

  window.addEventListener(AUTH_EVENT, authHandler);

  const storageHandler = (event: StorageEvent) => {
    if (event.key !== AUTH_STORAGE_KEY) {
      return;
    }

    if (!event.newValue) {
      cachedUserSnapshot = null;
      cacheInitialized = true;

      callback(null);
      return;
    }

    try {
      const parsed: unknown = JSON.parse(event.newValue);

      if (!isAuthUserSnapshot(parsed)) {
        cachedUserSnapshot = null;
        cacheInitialized = true;
        callback(null);
        return;
      }

      cachedUserSnapshot = parsed;
      cacheInitialized = true;

      callback(parsed);
    } catch {
      cachedUserSnapshot = null;
      cacheInitialized = true;

      callback(null);
    }
  };

  return () => {
    window.removeEventListener(AUTH_EVENT, authHandler);

    window.removeEventListener('storage', storageHandler);
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
  const { getFirebaseAuthInstance } = await import('@/utils/auth/firebase');

  const { auth, googleProvider } = await getFirebaseAuthInstance();

  const { signInWithPopup } = await import('firebase/auth');

  const result = await signInWithPopup(auth, googleProvider);

  publishAuthState(toUserSnapshot(result.user));

  return result.user;
}
/**
 * Sign out the current Firebase user.
 */
export async function signOutUser(): Promise<void> {
  const { getFirebaseAuthInstance } = await import('@/utils/auth/firebase');

  const { auth } = await getFirebaseAuthInstance();

  const { signOut } = await import('firebase/auth');

  await signOut(auth);

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
  const { getFirebaseAuthInstance } = await import('@/utils/auth/firebase');

  const { auth } = await getFirebaseAuthInstance();

  const { onAuthStateChanged } = await import('firebase/auth');

  return new Promise<User | null>((resolve) => {
    let unsubscribe: (() => void) | undefined;

    unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe?.();
      resolve(user);
    });
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
  const currentUser = await getCurrentUser();

  if (currentUser) {
    return currentUser;
  }

  return signInWithGoogle();
}
