import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDad78dDrCfmd-1kBPes9Gkwgr9gfjgXvI",
  authDomain: "smart-savings-4be47.firebaseapp.com",
  projectId: "smart-savings-4be47",
  storageBucket: "smart-savings-4be47.firebasestorage.app",
  messagingSenderId: "538090496490",
  appId: "1:538090496490:web:76d5a2601bb90228d05293",
  measurementId: "G-JPF7P320RN"
};

function hasFirebaseEnv() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.storageBucket &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.appId,
  );
}

let app: FirebaseApp | null = null;

if (hasFirebaseEnv()) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const firebaseApp = app;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app, "pharma-utils") : null;
export const isFirebaseConfigured = hasFirebaseEnv();
