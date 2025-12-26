"use server";

import { db } from "@/lib/db";
import { projects, contacts, projectEvents } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  try {
    const allProjects = await db.select({
        id: projects.id,
        title: projects.title,
        status: projects.status,
        targetCloseDate: projects.targetCloseDate,
        clientName: contacts.name
    })
    .from(projects)
    .leftJoin(contacts, eq(projects.clientId, contacts.id))
    .orderBy(desc(projects.createdAt));

    return { success: true, data: allProjects };
  } catch {
    console.error("Failed to fetch projects");
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function updateProjectStatus(id: string, status: string) {
    try {
        await db.update(projects)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .set({ status: status as any })
            .where(eq(projects.id, id));
        revalidatePath("/admin/projects");
        return { success: true };
    } catch {
        return { error: "Failed to update status" };
    }
}

export async function createProject(title: string, clientId?: string, boardId?: string, columnId?: string) {
    try {
        const [project] = await db.insert(projects).values({
            title,
            clientId,
            boardId,
            columnId,
            status: "Lead"
        }).returning();
        revalidatePath("/admin/projects");
        return { success: true, data: project };
    } catch {
        return { error: "Failed to create project" };
    }
}

export async function getProject(id: string) {
    try {
        const project = await db.query.projects.findFirst({
            where: eq(projects.id, id),
            with: {
                client: true,
                events: {
                    orderBy: [desc(projectEvents.date)]
                }
            }
        });
        return { success: true, data: project };
    } catch (error) {
        console.error("Error fetching project:", error);
        return { success: false, error: "Failed to fetch project" };
    }
}
