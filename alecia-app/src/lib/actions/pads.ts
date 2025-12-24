"use server";

import { db } from "@/lib/db";
import { pads, padRevisions, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function getPads() {
  try {
    const allPads = await db.select({
        id: pads.id,
        title: pads.title,
        updatedAt: pads.updatedAt,
        ownerName: users.name
    })
    .from(pads)
    .leftJoin(users, eq(pads.ownerId, users.id))
    .orderBy(desc(pads.updatedAt));

    return { success: true, data: allPads };
  } catch (error) {
    console.error("Failed to fetch pads:", error);
    return { success: false, error: "Failed to fetch documents" };
  }
}

export async function getPad(id: string) {
    try {
        const pad = await db.query.pads.findFirst({
            where: eq(pads.id, id)
        });
        if (!pad) return { success: false, error: "Pad not found" };
        return { success: true, data: pad };
    } catch (error) {
        return { success: false, error: "Failed to fetch pad" };
    }
}

export async function createPad(title: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const [newPad] = await db.insert(pads).values({
            title,
            ownerId: session.user.id,
            content: ""
        }).returning();

        revalidatePath("/admin/documents");
        return { success: true, data: newPad };
    } catch (error) {
        return { success: false, error: "Failed to create document" };
    }
}

export async function updatePad(id: string, content: string, title?: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        // 1. Create Revision (Simple versioning)
        const currentPad = await db.query.pads.findFirst({ where: eq(pads.id, id) });
        if (currentPad && currentPad.content !== content) {
            await db.insert(padRevisions).values({
                padId: id,
                contentSnapshot: currentPad.content,
                createdBy: session.user.id
            });
        }

        // 2. Update Pad
        await db.update(pads)
            .set({ 
                content, 
                title: title ?? undefined,
                updatedAt: new Date() 
            })
            .where(eq(pads.id, id));

        revalidatePath(`/admin/documents`);
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update document" };
    }
}

export async function deletePad(id: string) {
    try {
        await db.delete(pads).where(eq(pads.id, id));
        revalidatePath("/admin/documents");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete document" };
    }
}
