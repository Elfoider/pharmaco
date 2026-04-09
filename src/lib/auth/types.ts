import type { User } from "firebase/auth";

import type { UserRole } from "@/lib/auth/roles";

export type AppUser = {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthState = {
  user: User | null;
  appUser: AppUser | null;
  isLoading: boolean;
  error: string | null;
  isConfigured: boolean;
};
