// utils/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Initialize App (Lightweight)
export function getFirebaseApp() {
  return !getApps().length ? initializeApp(firebaseConfig) : getApp();
}

// Lazy-load Auth module only when triggered
export async function getFirebaseAuthInstance() {
  const { getAuth, GoogleAuthProvider } = await import("firebase/auth");
  const app = getFirebaseApp();
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  return { auth, googleProvider };
}