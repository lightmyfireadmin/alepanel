"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";


export async function changePassword(newPassword: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: "Le mot de passe doit contenir au moins 8 caractères" };
  }

  try {
    const [user] = await db
      .select({ passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user) {
      return { success: false, error: "Utilisateur introuvable" };
    }

    const isSame = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSame) {
      return { success: false, error: "Le nouveau mot de passe doit être différent de l'actuel" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.update(users)
      .set({
        passwordHash: hashedPassword,
        mustChangePassword: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.user.id));
  } catch (error) {
    const safeDetail = error instanceof Error ? error.name : "UnknownError";
    console.error("[User] changePassword error", {
      scope: "changePassword",
      detail: safeDetail,
    });
    return { success: false, error: "Impossible de mettre à jour le mot de passe" };
  }

  return { success: true };
}

export async function completeOnboarding() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  await db.update(users)
    .set({ hasSeenOnboarding: true })
    .where(eq(users.id, session.user.id));

  return { success: true };
}
