import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const ANALYTICS_SEED_TAG = "analytics_seed_v1";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta variable de entorno requerida: ${name}`);
  }
  return value;
}

export function getSeedFirestore() {
  const app = initializeApp({
    apiKey: requireEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: requireEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: requireEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: requireEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: requireEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: requireEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
  });

  return getFirestore(app);
}

export const COLLECTIONS = {
  products: "products",
  sales: "sales",
  saleItems: "sale_items",
};
