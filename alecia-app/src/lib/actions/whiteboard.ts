"use server";

import { db } from "@/lib/db";
import { documents } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { eq, desc } from "drizzle-orm";

export async function saveWhiteboardState(name: string, content: unknown) {
  try {
    await db.insert(documents).values({
      name,
      content,
      // url is null
      mimeType: "application/vnd.excalidraw+json",
    });
    revalidatePath("/admin/whiteboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to save whiteboard:", error);
    return { success: false, error: "Failed to save" };
  }
}

export async function getSavedWhiteboards() {
  try {
    const data = await db.select({
      id: documents.id,
      name: documents.name,
      updatedAt: documents.updatedAt,
    })
    .from(documents)
    .where(eq(documents.mimeType, "application/vnd.excalidraw+json"))
    .orderBy(desc(documents.updatedAt));
    
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Failed to fetch whiteboards" };
  }
}

export async function getWhiteboardContent(id: string) {
  try {
    const doc = await db.query.documents.findFirst({
      where: eq(documents.id, id),
    });
    if (!doc) return { success: false, error: "Not found" };
    return { success: true, data: doc.content };
  } catch (error) {
    return { success: false, error: "Failed to load content" };
  }
}
