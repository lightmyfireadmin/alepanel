"use server";

import { db } from "@/lib/db";
import { deals } from "@/lib/db/schema";
import { type DealFormData, dealSchema } from "@/lib/validations/forms";
import { revalidatePath } from "next/cache";

export async function createDeal(data: DealFormData) {
  try {
    // 1. Validate data server-side
    const validatedFields = dealSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        success: false,
        error: "Données invalides. Veuillez vérifier le formulaire.",
      };
    }

    // 2. Insert into DB
    // Note: In a real app, you might want to handle slug generation more robustly
    // For now, we'll generate a simple slug from client name + year
    const slug = `${data.clientName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${data.year}-${Date.now().toString().slice(-4)}`;

    try {
        await db.insert(deals).values({
            ...validatedFields.data,
            slug,
            description: validatedFields.data.description || null,
            clientLogo: validatedFields.data.clientLogo || null,
            acquirerName: validatedFields.data.acquirerName || null,
            acquirerLogo: validatedFields.data.acquirerLogo || null,
            region: validatedFields.data.region || null,
        });
    } catch (dbError) {
        // Graceful fallback for local dev without DB connection
        console.error("Database Error (Expected if no DB connection):", dbError);
        // We simulate success in dev mode if DB fails (to allow UI testing)
        // In production, this would be a real error
        if (process.env.NODE_ENV === "development") {
            return {
                success: true, 
                message: "Simulation: Deal créé avec succès (Pas de DB connectée)"
            };
        }
        throw new Error("Erreur base de données");
    }

    revalidatePath("/admin/deals");
    revalidatePath("/operations"); // Update pubic facing page

    return { success: true, message: "Opération créée avec succès" };
  } catch (error) {
    console.error("Failed to create deal:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la création de l'opération.",
    };
  }
}
