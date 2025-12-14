import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, teamMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Public endpoint for login page - returns only necessary user info for authentication
export async function GET() {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: teamMembers.photo, // Add photo
      })
      .from(users)
      .leftJoin(teamMembers, eq(users.email, teamMembers.email));

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
