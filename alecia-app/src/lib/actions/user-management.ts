"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";


export async function changePassword(newPassword: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.update(users)
    .set({
      passwordHash: hashedPassword,
      mustChangePassword: false,
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id));

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
