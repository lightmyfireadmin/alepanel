"use server";

import { db } from "@/lib/db";
import { documents } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

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
