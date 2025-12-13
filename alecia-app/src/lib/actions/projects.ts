"use server";

/**
 * Projects Server Actions
 * CRUD operations for project pipeline management
 */

import { db } from "@/lib/db";
import { projects, projectEvents, contacts } from "@/lib/db/schema";
import { eq, desc, asc, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface ProjectFormData {
  title: string;
  status?: string;
  clientId?: string | null;
  startDate?: string | null;
  targetCloseDate?: string | null;
  description?: string | null;
  displayOrder?: number;
}

export interface ProjectEventFormData {
  projectId: string;
  type: string;
  date: string;
  description?: string | null;
  fileUrl?: string | null;
}

// ============================================================================
// PROJECTS
// ============================================================================

/**
 * Get all projects (admin only)
 */
export async function getAllProjects() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }
    
    const allProjects = await db
      .select({
        project: projects,
        clientName: contacts.name,
      })
      .from(projects)
      .leftJoin(contacts, eq(contacts.id, projects.clientId))
      .orderBy(projects.status, projects.displayOrder);
    
    return allProjects.map(row => ({
      ...row.project,
      clientName: row.clientName,
    }));
  } catch (error) {
    console.error("[Projects] Error fetching projects:", error);
    return [];
  }
}

/**
 * Get projects by status (for Kanban view)
 */
export async function getProjectsByStatus(status: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }
    
    const statusProjects = await db
      .select({
        project: projects,
        clientName: contacts.name,
      })
      .from(projects)
      .leftJoin(contacts, eq(contacts.id, projects.clientId))
      .where(eq(projects.status, status))
      .orderBy(projects.displayOrder);
    
    return statusProjects.map(row => ({
      ...row.project,
      clientName: row.clientName,
    }));
  } catch (error) {
    console.error("[Projects] Error fetching projects by status:", error);
    return [];
  }
}

/**
 * Get a single project by ID with related data
 */
export async function getProjectById(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }
    
    const [projectData] = await db
      .select({
        project: projects,
        client: contacts,
      })
      .from(projects)
      .leftJoin(contacts, eq(contacts.id, projects.clientId))
      .where(eq(projects.id, id))
      .limit(1);
    
    if (!projectData) {
      return null;
    }
    
    return {
      ...projectData.project,
      client: projectData.client,
    };
  } catch (error) {
    console.error("[Projects] Error fetching project:", error);
    return null;
  }
}

/**
 * Create a new project
 */
export async function createProject(
  data: ProjectFormData
): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    const [inserted] = await db
      .insert(projects)
      .values(data)
      .returning({ id: projects.id });
    
    revalidatePath("/admin/projects");
    
    return { success: true, id: inserted.id };
  } catch (error) {
    console.error("[Projects] Error creating project:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la création",
    };
  }
}

/**
 * Update an existing project
 */
export async function updateProject(
  id: string,
  data: Partial<ProjectFormData>
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    await db
      .update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id));
    
    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}`);
    
    return { success: true };
  } catch (error) {
    console.error("[Projects] Error updating project:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la mise à jour",
    };
  }
}

/**
 * Update project status (for Kanban drag-and-drop)
 */
export async function updateProjectStatus(
  id: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    await db
      .update(projects)
      .set({ status, updatedAt: new Date() })
      .where(eq(projects.id, id));
    
    revalidatePath("/admin/projects");
    
    return { success: true };
  } catch (error) {
    console.error("[Projects] Error updating project status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la mise à jour",
    };
  }
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    // Delete project events first (cascade)
    await db.delete(projectEvents).where(eq(projectEvents.projectId, id));
    
    // Delete project
    await db.delete(projects).where(eq(projects.id, id));
    
    revalidatePath("/admin/projects");
    
    return { success: true };
  } catch (error) {
    console.error("[Projects] Error deleting project:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la suppression",
    };
  }
}

/**
 * Get project count for dashboard
 */
export async function getProjectCount() {
  try {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(projects);
    
    return result?.count || 0;
  } catch (error) {
    console.error("[Projects] Error fetching count:", error);
    return 0;
  }
}

/**
 * Get active projects count (not closed)
 */
export async function getActiveProjectCount() {
  try {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(projects)
      .where(sql`${projects.status} != 'Closed'`);
    
    return result?.count || 0;
  } catch (error) {
    console.error("[Projects] Error fetching active count:", error);
    return 0;
  }
}

// ============================================================================
// PROJECT EVENTS
// ============================================================================

/**
 * Get all events for a project
 */
export async function getProjectEvents(projectId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }
    
    const events = await db
      .select()
      .from(projectEvents)
      .where(eq(projectEvents.projectId, projectId))
      .orderBy(desc(projectEvents.date));
    
    return events;
  } catch (error) {
    console.error("[Projects] Error fetching project events:", error);
    return [];
  }
}

/**
 * Create a new project event
 */
export async function createProjectEvent(
  data: ProjectEventFormData
): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    const [inserted] = await db
      .insert(projectEvents)
      .values(data)
      .returning({ id: projectEvents.id });
    
    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${data.projectId}`);
    
    return { success: true, id: inserted.id };
  } catch (error) {
    console.error("[Projects] Error creating event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la création",
    };
  }
}

/**
 * Update a project event
 */
export async function updateProjectEvent(
  id: string,
  data: Partial<ProjectEventFormData>
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    await db
      .update(projectEvents)
      .set(data)
      .where(eq(projectEvents.id, id));
    
    revalidatePath("/admin/projects");
    
    return { success: true };
  } catch (error) {
    console.error("[Projects] Error updating event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la mise à jour",
    };
  }
}

/**
 * Delete a project event
 */
export async function deleteProjectEvent(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    await db.delete(projectEvents).where(eq(projectEvents.id, id));
    
    revalidatePath("/admin/projects");
    
    return { success: true };
  } catch (error) {
    console.error("[Projects] Error deleting event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la suppression",
    };
  }
}
