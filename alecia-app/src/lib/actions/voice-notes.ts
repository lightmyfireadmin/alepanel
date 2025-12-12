"use server";

/**
 * Voice Notes - Vercel Blob Storage Server Actions
 * 
 * Requirement: Voice notes must be stored in cloud storage (Vercel Blob),
 * NOT in local filesystem (Vercel is serverless/ephemeral).
 */

import { put, del } from "@vercel/blob";
import { db } from "@/lib/db";
import { voiceNotes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

interface UploadResult {
  success: boolean;
  voiceNoteId?: string;
  blobUrl?: string;
  error?: string;
}

/**
 * Upload a voice note to Vercel Blob storage and save reference in database.
 * 
 * @param formData - FormData containing:
 *   - audio: Blob/File of the voice recording
 *   - duration: Recording duration in seconds
 *   - projectId: (optional) Link to a project
 *   - contactId: (optional) Link to a contact
 */
export async function uploadVoiceNote(formData: FormData): Promise<UploadResult> {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    const audioFile = formData.get("audio") as Blob | null;
    if (!audioFile) {
      return { success: false, error: "Aucun fichier audio fourni" };
    }
    
    const duration = parseInt(formData.get("duration") as string) || 0;
    const projectId = formData.get("projectId") as string | null;
    const contactId = formData.get("contactId") as string | null;
    
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const filename = `voice-notes/${session.user.id}/${timestamp}.webm`;
    
    // Upload to Vercel Blob
    const blob = await put(filename, audioFile, {
      access: "public", // Vercel Blob only supports public access
      contentType: "audio/webm",
    });
    
    // Save reference in database
    const [inserted] = await db
      .insert(voiceNotes)
      .values({
        blobUrl: blob.url,
        durationSeconds: duration,
        projectId: projectId || null,
        contactId: contactId || null,
        recordedBy: session.user.id,
      })
      .returning({ id: voiceNotes.id });
    
    console.log(`[VoiceNotes] Uploaded: ${blob.url} (${duration}s)`);
    
    return {
      success: true,
      voiceNoteId: inserted.id,
      blobUrl: blob.url,
    };
    
  } catch (error) {
    console.error("[VoiceNotes] Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec du téléversement",
    };
  }
}

/**
 * Delete a voice note from Vercel Blob and database.
 */
export async function deleteVoiceNote(voiceNoteId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    // Get voice note to find blob URL
    const [note] = await db
      .select()
      .from(voiceNotes)
      .where(eq(voiceNotes.id, voiceNoteId))
      .limit(1);
    
    if (!note) {
      return { success: false, error: "Note vocale non trouvée" };
    }
    
    // Check ownership (only creator or admin can delete)
    if (note.recordedBy !== session.user.id) {
      // Check if admin role - allow deletion
      const userRole = (session.user as { role?: string }).role;
      if (userRole !== "admin") {
        return { success: false, error: "Non autorisé à supprimer cette note" };
      }
    }
    
    // Delete from Vercel Blob
    await del(note.blobUrl);
    
    // Delete from database
    await db.delete(voiceNotes).where(eq(voiceNotes.id, voiceNoteId));
    
    console.log(`[VoiceNotes] Deleted: ${voiceNoteId}`);
    
    return { success: true };
    
  } catch (error) {
    console.error("[VoiceNotes] Delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la suppression",
    };
  }
}

/**
 * Get voice notes for a project.
 */
export async function getProjectVoiceNotes(projectId: string) {
  try {
    const notes = await db
      .select()
      .from(voiceNotes)
      .where(eq(voiceNotes.projectId, projectId))
      .orderBy(voiceNotes.createdAt);
    
    return notes;
    
  } catch (error) {
    console.error("[VoiceNotes] Fetch error:", error);
    return [];
  }
}

/**
 * Update transcription for a voice note.
 * (Future: Will be called after Whisper API processing)
 */
export async function updateTranscription(
  voiceNoteId: string,
  transcription: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db
      .update(voiceNotes)
      .set({ transcription })
      .where(eq(voiceNotes.id, voiceNoteId));
    
    return { success: true };
    
  } catch (error) {
    console.error("[VoiceNotes] Transcription update error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la mise à jour",
    };
  }
}
