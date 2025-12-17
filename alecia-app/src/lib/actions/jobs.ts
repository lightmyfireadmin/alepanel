
"use server";

import { db } from "@/lib/db";
import { jobOffers } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { cache } from "react";

// Public: Get published job offers for client-facing pages
export const getJobOffers = cache(async () => {
  try {
    const offers = await db
      .select()
      .from(jobOffers)
      .where(eq(jobOffers.isPublished, true))
      .orderBy(desc(jobOffers.createdAt));
      
    return offers;
  } catch (error) {
    console.error("Error fetching job offers:", error);
    return [];
  }
});

// Admin: Get all job offers including unpublished
export async function getAllJobOffers() {
  try {
    const offers = await db
      .select()
      .from(jobOffers)
      .orderBy(desc(jobOffers.createdAt));
      
    return offers;
  } catch (error) {
    console.error("Error fetching all job offers:", error);
    return [];
  }
}

// Admin: Create a new job offer
export async function createJobOffer(data: {
  title: string;
  type: string;
  location: string;
  description?: string;
  requirements?: string[];
  contactEmail?: string;
  pdfUrl?: string;
  isPublished?: boolean;
  displayOrder?: number;
}) {
  try {
    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const [offer] = await db
      .insert(jobOffers)
      .values({
        slug,
        ...data,
      })
      .returning();

    return { success: true, offer };
  } catch (error) {
    console.error("Error creating job offer:", error);
    return { success: false, error: "Failed to create job offer" };
  }
}

// Admin: Update a job offer
export async function updateJobOffer(id: string, data: {
  title?: string;
  type?: string;
  location?: string;
  description?: string;
  requirements?: string[];
  contactEmail?: string;
  pdfUrl?: string;
  isPublished?: boolean;
  displayOrder?: number;
}) {
  try {
    // If title is being updated, regenerate slug
    const updateData: typeof data & { slug?: string } = { ...data };
    if (data.title) {
      updateData.slug = data.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const [offer] = await db
      .update(jobOffers)
      .set(updateData)
      .where(eq(jobOffers.id, id))
      .returning();

    return { success: true, offer };
  } catch (error) {
    console.error("Error updating job offer:", error);
    return { success: false, error: "Failed to update job offer" };
  }
}

// Admin: Delete a job offer
export async function deleteJobOffer(id: string) {
  try {
    await db
      .delete(jobOffers)
      .where(eq(jobOffers.id, id));

    return { success: true };
  } catch (error) {
    console.error("Error deleting job offer:", error);
    return { success: false, error: "Failed to delete job offer" };
  }
}

// Admin: Toggle job offer published status
export async function toggleJobOfferPublished(id: string) {
  try {
    // First get the current status
    const [currentOffer] = await db
      .select()
      .from(jobOffers)
      .where(eq(jobOffers.id, id))
      .limit(1);

    if (!currentOffer) {
      return { success: false, error: "Job offer not found" };
    }

    // Toggle the status
    const [offer] = await db
      .update(jobOffers)
      .set({ isPublished: !currentOffer.isPublished })
      .where(eq(jobOffers.id, id))
      .returning();

    return { success: true, offer };
  } catch (error) {
    console.error("Error toggling job offer status:", error);
    return { success: false, error: "Failed to toggle job offer status" };
  }
}
