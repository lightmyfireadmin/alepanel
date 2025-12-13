"use server";

/**
 * Team Members Server Actions
 * CRUD operations for team member profiles
 */

import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import { eq, asc, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface TeamMemberFormData {
  slug: string;
  name: string;
  role: string;
  photo?: string | null;
  bioFr?: string | null;
  bioEn?: string | null;
  linkedinUrl?: string | null;
  email?: string | null;
  sectorsExpertise?: string[] | null;
  transactions?: string[] | null;
  displayOrder?: number;
  isActive?: boolean;
}

/**
 * Get all active team members (for public display)
 */
export async function getAllTeamMembers() {
  try {
    const members = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.isActive, true))
      .orderBy(teamMembers.displayOrder, asc(teamMembers.name));
    
    return members;
  } catch (error) {
    console.error("[Team] Error fetching team members:", error);
    return [];
  }
}

/**
 * Get a single team member by slug
 */
export async function getTeamMemberBySlug(slug: string) {
  try {
    const [member] = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.slug, slug))
      .limit(1);
    
    return member || null;
  } catch (error) {
    console.error("[Team] Error fetching team member:", error);
    return null;
  }
}

/**
 * Get team member by ID
 */
export async function getTeamMemberById(id: string) {
  try {
    const [member] = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.id, id))
      .limit(1);
    
    return member || null;
  } catch (error) {
    console.error("[Team] Error fetching team member:", error);
    return null;
  }
}

/**
 * Create a new team member (admin only)
 */
export async function createTeamMember(
  data: TeamMemberFormData
): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    // Insert team member
    const [inserted] = await db
      .insert(teamMembers)
      .values(data)
      .returning({ id: teamMembers.id });
    
    // Revalidate pages
    revalidatePath("/equipe");
    revalidatePath("/admin/team");
    
    return { success: true, id: inserted.id };
  } catch (error) {
    console.error("[Team] Error creating team member:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la création",
    };
  }
}

/**
 * Update an existing team member (admin only)
 */
export async function updateTeamMember(
  id: string,
  data: Partial<TeamMemberFormData>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    // Update team member
    await db
      .update(teamMembers)
      .set(data)
      .where(eq(teamMembers.id, id));
    
    // Revalidate pages
    revalidatePath("/equipe");
    revalidatePath("/admin/team");
    
    return { success: true };
  } catch (error) {
    console.error("[Team] Error updating team member:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la mise à jour",
    };
  }
}

/**
 * Delete a team member (admin only)
 */
export async function deleteTeamMember(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    // Delete team member
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
    
    // Revalidate pages
    revalidatePath("/equipe");
    revalidatePath("/admin/team");
    
    return { success: true };
  } catch (error) {
    console.error("[Team] Error deleting team member:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la suppression",
    };
  }
}

/**
 * Get team member count for dashboard
 */
export async function getTeamMemberCount() {
  try {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(teamMembers)
      .where(eq(teamMembers.isActive, true));
    
    return result?.count || 0;
  } catch (error) {
    console.error("[Team] Error fetching count:", error);
    return 0;
  }
}
