"use server";

import { db } from "@/lib/db";
import { users, teamMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getLoginUsers() {
  try {
    const allUsers = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role
    }).from(users);

    // Enrich with avatars from TeamMembers if available (matching by email or similar name logic)
    // For now, simpler: hardcode the logic for specific known users or fetch team member
    const enrichedUsers = await Promise.all(allUsers.map(async (u) => {
        let avatar = null;
        // Try to find matching team member by email
        if (u.email) {
            const tm = await db.query.teamMembers.findFirst({
                where: eq(teamMembers.email, u.email)
            });
            if (tm) avatar = tm.photo;
        }
        return {
            ...u,
            avatar
        };
    }));

    return enrichedUsers;
  } catch (error) {
    console.error("Failed to fetch login users:", error);
    return [];
  }
}
