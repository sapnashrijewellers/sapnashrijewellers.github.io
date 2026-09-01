// utils/auth/firebase.ts

import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseApp,
} from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
  type Auth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

let firebaseAuthPromise:
  | Promise<{
      app: FirebaseApp;
      auth: Auth;
      googleProvider: GoogleAuthProvider;
    }>
  | null = null;

/**
 * Get the Firebase application.
 *
 * This does not initialize Auth.
 */
export function getFirebaseApp(): FirebaseApp {
  return getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);
}

/**
 * Lazily initialize Firebase Auth.
 *
 * Important:
 * - Firebase is not initialized on page load.
 * - Auth is initialized only when authentication is required.
 * - getAuth() is intentionally used instead of initializeAuth().
 * - The same Auth instance is reused throughout the application.
 */
export function getFirebaseAuthInstance() {
  if (!firebaseAuthPromise) {
    firebaseAuthPromise = Promise.resolve().then(() => {
      const app = getFirebaseApp();

      const auth = getAuth(app);

      const googleProvider = new GoogleAuthProvider();

      return {
        app,
        auth,
        googleProvider,
      };
    });
  }

  return firebaseAuthPromise;
}