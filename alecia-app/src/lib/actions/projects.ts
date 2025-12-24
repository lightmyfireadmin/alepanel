"use server";

import { db } from "@/lib/db";
import { projects, contacts, projectEvents } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

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
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return { success: false, error: "Failed to fetch projects" };
  }
}

export async function updateProjectStatus(id: string, status: string) {
    try {
        await db.update(projects)
            .set({ status: status as any })
            .where(eq(projects.id, id));
        revalidatePath("/admin/projects");
        return { success: true };
    } catch (error) {
        return { error: "Failed to update status" };
    }
}

export async function createProject(title: string, clientId?: string) {
    try {
        const [project] = await db.insert(projects).values({
            title,
            clientId,
            status: "Lead"
        }).returning();
        revalidatePath("/admin/projects");
        return { success: true, data: project };
    } catch (error) {
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
