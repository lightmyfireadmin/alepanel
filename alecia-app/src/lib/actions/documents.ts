"use server";

/**
 * Documents Server Actions
 * CRUD operations for document management with Vercel Blob storage
 */

import { put, del } from "@vercel/blob";
import { db } from "@/lib/db";
import { documents } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";

export interface DocumentFormData {
  name: string;
  projectId?: string | null;
  isConfidential?: boolean;
}

/**
 * Upload a document to Vercel Blob and save reference in database
 */
export async function uploadDocument(
  formData: FormData
): Promise<{ success: boolean; error?: string; id?: string; url?: string }> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "Aucun fichier fourni" };
    }
    
    const name = formData.get("name") as string || file.name;
    const projectId = formData.get("projectId") as string | null;
    const isConfidential = formData.get("isConfidential") === "true";
    
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `documents/${timestamp}_${sanitizedName}`;
    
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type || "application/octet-stream",
    });
    
    // Generate magic link token
    const accessToken = randomBytes(32).toString("hex");
    
    // Save reference in database
    const [inserted] = await db
      .insert(documents)
      .values({
        name,
        url: blob.url,
        mimeType: file.type || "application/octet-stream",
        projectId: projectId || null,
        isConfidential,
        accessToken,
      })
      .returning({ id: documents.id });
    
    console.log(`[Documents] Uploaded: ${blob.url}`);
    
    // Revalidate pages
    revalidatePath("/admin/documents");
    
    return { success: true, id: inserted.id, url: blob.url };
  } catch (error) {
    console.error("[Documents] Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec du téléversement",
    };
  }
}

/**
 * Get all documents (admin only)
 */
export async function getAllDocuments() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return [];
    }
    
    const allDocuments = await db
      .select()
      .from(documents)
      .orderBy(desc(documents.createdAt));
    
    return allDocuments;
  } catch (error) {
    console.error("[Documents] Error fetching documents:", error);
    return [];
  }
}

/**
 * Get documents for a specific project
 */
export async function getProjectDocuments(projectId: string) {
  try {
    const projectDocs = await db
      .select()
      .from(documents)
      .where(eq(documents.projectId, projectId))
      .orderBy(desc(documents.createdAt));
    
    return projectDocs;
  } catch (error) {
    console.error("[Documents] Error fetching project documents:", error);
    return [];
  }
}

/**
 * Get a document by magic link token (for sharing)
 */
export async function getDocumentByToken(token: string) {
  try {
    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.accessToken, token))
      .limit(1);
    
    return document || null;
  } catch (error) {
    console.error("[Documents] Error fetching document by token:", error);
    return null;
  }
}

/**
 * Get a document by ID
 */
export async function getDocumentById(id: string) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return null;
    }
    
    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);
    
    return document || null;
  } catch (error) {
    console.error("[Documents] Error fetching document:", error);
    return null;
  }
}

/**
 * Update document metadata
 */
export async function updateDocument(
  id: string,
  data: Partial<DocumentFormData>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    // Update document
    await db
      .update(documents)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(documents.id, id));
    
    // Revalidate pages
    revalidatePath("/admin/documents");
    
    return { success: true };
  } catch (error) {
    console.error("[Documents] Error updating document:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la mise à jour",
    };
  }
}

/**
 * Delete a document from Vercel Blob and database
 */
export async function deleteDocument(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    // Get document to find blob URL
    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);
    
    if (!document) {
      return { success: false, error: "Document non trouvé" };
    }
    
    // Delete from Vercel Blob
    await del(document.url);
    
    // Delete from database
    await db.delete(documents).where(eq(documents.id, id));
    
    console.log(`[Documents] Deleted: ${id}`);
    
    // Revalidate pages
    revalidatePath("/admin/documents");
    
    return { success: true };
  } catch (error) {
    console.error("[Documents] Delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la suppression",
    };
  }
}

/**
 * Generate new magic link token for a document
 */
export async function regenerateDocumentToken(
  id: string
): Promise<{ success: boolean; error?: string; token?: string }> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    // Generate new token
    const accessToken = randomBytes(32).toString("hex");
    
    // Update document
    await db
      .update(documents)
      .set({ accessToken, updatedAt: new Date() })
      .where(eq(documents.id, id));
    
    return { success: true, token: accessToken };
  } catch (error) {
    console.error("[Documents] Error regenerating token:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la génération",
    };
  }
}

/**
 * Get document count for dashboard
 */
export async function getDocumentCount() {
  try {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(documents);
    
    return result?.count || 0;
  } catch (error) {
    console.error("[Documents] Error fetching count:", error);
    return 0;
  }
}
