"use server";

import { db } from "@/lib/db";
import { spreadsheets, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function getSheets() {
  try {
    const allSheets = await db.select({
        id: spreadsheets.id,
        title: spreadsheets.title,
        updatedAt: spreadsheets.updatedAt,
        ownerName: users.name
    })
    .from(spreadsheets)
    .leftJoin(users, eq(spreadsheets.ownerId, users.id))
    .orderBy(desc(spreadsheets.updatedAt));

    return { success: true, data: allSheets };
  } catch {
    console.error("Failed to fetch sheets");
    return { success: false, error: "Failed to fetch spreadsheets" };
  }
}

export async function getSheet(id: string) {
    try {
        const sheet = await db.query.spreadsheets.findFirst({
            where: eq(spreadsheets.id, id)
        });
        if (!sheet) return { success: false, error: "Sheet not found" };
        return { success: true, data: sheet };
    } catch {
        return { success: false, error: "Failed to fetch spreadsheet" };
    }
}

export async function createSheet(title: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    try {
        const [newSheet] = await db.insert(spreadsheets).values({
            title,
            ownerId: session.user.id,
            data: [
                ["", "", ""],
                ["", "", ""],
                ["", "", ""]
            ]
        }).returning();

        revalidatePath("/admin/sheets");
        return { success: true, data: newSheet };
    } catch {
        return { success: false, error: "Failed to create spreadsheet" };
    }
}

export async function updateSheet(id: string, data: string[][], title?: string) {
    try {
        await db.update(spreadsheets)
            .set({
                data,
                title: title ?? undefined,
                updatedAt: new Date()
            })
            .where(eq(spreadsheets.id, id));

        revalidatePath(`/admin/sheets`);
        return { success: true };
    } catch {
        return { success: false, error: "Failed to update spreadsheet" };
    }
}

export async function deleteSheet(id: string) {
    try {
        await db.delete(spreadsheets).where(eq(spreadsheets.id, id));
        revalidatePath("/admin/sheets");
        return { success: true };
    } catch {
        return { success: false, error: "Failed to delete spreadsheet" };
    }
}
