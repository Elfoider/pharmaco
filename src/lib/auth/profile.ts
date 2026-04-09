import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase/client";
import { userRoleSchema } from "@/lib/auth/roles";
import type { UserProfile } from "@/lib/auth/types";

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) {
    return null;
  }

  const profileRef = doc(db, "users", uid);
  const profileSnap = await getDoc(profileRef);

  if (!profileSnap.exists()) {
    return null;
  }

  const data = profileSnap.data();
  const parsedRole = userRoleSchema.safeParse(data.role);

  return {
    uid,
    email: typeof data.email === "string" ? data.email : "",
    displayName: typeof data.displayName === "string" ? data.displayName : "",
    role: parsedRole.success ? parsedRole.data : "cajero",
    isActive: data.isActive !== false,
    createdAt: typeof data.createdAt === "string" ? data.createdAt : undefined,
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : undefined,
  };
}
