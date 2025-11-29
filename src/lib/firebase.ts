// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/**
 * Use environment variables if available (recommended).
 * If not present, the fallback values are your project values.
 * Using NEXT_PUBLIC_* means they are allowed to be public in client code.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "AIzaSyAMNRRjN-SuFFjXXf8x4abQlOPh4vb5dhQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "horizon-website-df128.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "horizon-website-df128",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "horizon-website-df128.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "642887166358",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "1:642887166358:web:99da340010237154d315b7",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "G-4V5D57EB1H",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
