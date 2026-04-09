import type { User } from "firebase/auth";

import type { AppUser } from "@/lib/domain/types";

export type { AppUser } from "@/lib/domain/types";

export type AuthState = {
  user: User | null;
  appUser: AppUser | null;
  isLoading: boolean;
  error: string | null;
  isConfigured: boolean;
};
