"use server";

import { db } from "@/lib/db";
import { kanbanBoards, kanbanColumns, projects } from "@/lib/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function getBoards() {
  try {
    const boards = await db.select().from(kanbanBoards).orderBy(desc(kanbanBoards.createdAt));
    return { success: true, data: boards };
  } catch {
    return { success: false, error: "Failed to fetch boards" };
  }
}

export async function getBoardWithColumns(boardId: string) {
  try {
    const board = await db.query.kanbanBoards.findFirst({
      where: eq(kanbanBoards.id, boardId),
    });
    const columns = await db.select().from(kanbanColumns).where(eq(kanbanColumns.boardId, boardId)).orderBy(asc(kanbanColumns.order));
    const allProjects = await db.select().from(projects).where(eq(projects.boardId, boardId)).orderBy(asc(projects.displayOrder));

    return { success: true, data: { board, columns, projects: allProjects } };
  } catch {
    return { success: false, error: "Failed to fetch board details" };
  }
}

export async function createBoard(name: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    const [board] = await db.insert(kanbanBoards).values({ name, ownerId: session.user.id }).returning();
    
    // Create default columns
    const defaultCols = ["Lead", "Due Diligence", "Closing", "Closed"];
    await db.insert(kanbanColumns).values(defaultCols.map((name, i) => ({
      boardId: board.id,
      name,
      order: i
    })));

    revalidatePath("/admin/projects");
    return { success: true, data: board };
  } catch {
    return { error: "Failed to create board" };
  }
}

export async function createColumn(boardId: string, name: string, order: number) {
    try {
        await db.insert(kanbanColumns).values({ boardId, name, order });
        revalidatePath(`/admin/projects`);
        return { success: true };
    } catch {
        return { error: "Failed to create column" };
    }
}

export async function deleteBoard(id: string) {
    try {
        await db.delete(kanbanBoards).where(eq(kanbanBoards.id, id));
        revalidatePath("/admin/projects");
        return { success: true };
    } catch {
        return { error: "Failed to delete board" };
    }
}

export async function moveProject(projectId: string, columnId: string, boardId?: string) {
    try {
        await db.update(projects).set({ 
            columnId,
            ...(boardId ? { boardId } : {})
        }).where(eq(projects.id, projectId));
        revalidatePath("/admin/projects");
        return { success: true };
    } catch {
        return { error: "Failed to move project" };
    }
}

export async function deleteColumn(id: string) {
    try {
        await db.delete(kanbanColumns).where(eq(kanbanColumns.id, id));
        revalidatePath("/admin/projects");
        return { success: true };
    } catch {
        return { error: "Failed to delete column" };
    }
}
