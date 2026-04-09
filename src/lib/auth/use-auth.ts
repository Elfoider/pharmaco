"use client";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from "firebase/auth";
import { useEffect, useState } from "react";

import { getUserProfile } from "@/lib/auth/profile";
import type { AuthState } from "@/lib/auth/types";
import { auth, isFirebaseConfigured } from "@/lib/firebase/client";

const INITIAL_STATE: AuthState = {
  user: null,
  profile: null,
  isLoading: isFirebaseConfigured,
  error: isFirebaseConfigured
    ? null
    : "Firebase no está configurado. Revisa variables NEXT_PUBLIC_FIREBASE_*.",
  isConfigured: isFirebaseConfigured,
};

export function useAuth() {
  const [state, setState] = useState<AuthState>(INITIAL_STATE);

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setState({
          user: null,
          profile: null,
          isLoading: false,
          error: null,
          isConfigured: true,
        });
        return;
      }

      try {
        const profile = await getUserProfile(firebaseUser.uid);
        setState({
          user: firebaseUser,
          profile,
          isLoading: false,
          error: null,
          isConfigured: true,
        });
      } catch {
        setState({
          user: firebaseUser,
          profile: null,
          isLoading: false,
          error: "No fue posible leer el perfil desde Firestore.",
          isConfigured: true,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  async function login(email: string, password: string): Promise<UserCredential> {
    if (!auth) {
      throw new Error("Firebase no configurado");
    }

    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    if (!auth) {
      return;
    }

    await signOut(auth);
  }

  return {
    ...state,
    login,
    logout,
  };
}
