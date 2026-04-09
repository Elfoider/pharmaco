import type { User } from "firebase/auth";

import type { UserRole } from "@/lib/auth/roles";

export type UserProfile = {
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
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isConfigured: boolean;
};
