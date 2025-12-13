"use server";

/**
 * Deals Server Actions
 * CRUD operations for M&A operations/deals
 */

import { db } from "@/lib/db";
import { deals } from "@/lib/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface DealFormData {
  slug: string;
  clientName: string;
  clientLogo?: string | null;
  acquirerName?: string | null;
  acquirerLogo?: string | null;
  sector: string;
  region?: string | null;
  year: number;
  mandateType: string;
  description?: string | null;
  isConfidential?: boolean;
  isPriorExperience?: boolean;
  context?: string | null;
  intervention?: string | null;
  result?: string | null;
  testimonialText?: string | null;
  testimonialAuthor?: string | null;
  roleType?: string | null;
  dealSize?: string | null;
  keyMetrics?: {
    multiple?: number;
    duration?: string;
    approachedBuyers?: number;
  } | null;
  displayOrder?: number;
}

/**
 * Get all deals (for public display)
 */
export async function getAllDeals() {
  try {
    const allDeals = await db
      .select()
      .from(deals)
      .orderBy(desc(deals.year), deals.displayOrder);
    
    return allDeals;
  } catch (error) {
    console.error("[Deals] Error fetching deals:", error);
    return [];
  }
}

/**
 * Get a single deal by slug
 */
export async function getDealBySlug(slug: string) {
  try {
    const [deal] = await db
      .select()
      .from(deals)
      .where(eq(deals.slug, slug))
      .limit(1);
    
    return deal || null;
  } catch (error) {
    console.error("[Deals] Error fetching deal:", error);
    return null;
  }
}

/**
 * Get deals with filtering
 */
export async function getFilteredDeals(filters: {
  sector?: string;
  region?: string;
  year?: number;
  mandateType?: string;
}) {
  try {
    let query = db.select().from(deals);
    
    const conditions = [];
    
    if (filters.sector) {
      conditions.push(eq(deals.sector, filters.sector));
    }
    if (filters.region) {
      conditions.push(eq(deals.region, filters.region));
    }
    if (filters.year) {
      conditions.push(eq(deals.year, filters.year));
    }
    if (filters.mandateType) {
      conditions.push(eq(deals.mandateType, filters.mandateType));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }
    
    const filteredDeals = await query.orderBy(desc(deals.year), deals.displayOrder);
    
    return filteredDeals;
  } catch (error) {
    console.error("[Deals] Error filtering deals:", error);
    return [];
  }
}

/**
 * Create a new deal (admin only)
 */
export async function createDeal(data: DealFormData): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    // Insert deal
    const [inserted] = await db
      .insert(deals)
      .values(data)
      .returning({ id: deals.id });
    
    // Revalidate pages that display deals
    revalidatePath("/operations");
    revalidatePath("/admin/deals");
    
    return { success: true, id: inserted.id };
  } catch (error) {
    console.error("[Deals] Error creating deal:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la création",
    };
  }
}

/**
 * Update an existing deal (admin only)
 */
export async function updateDeal(
  id: string,
  data: Partial<DealFormData>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    // Update deal
    await db
      .update(deals)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(deals.id, id));
    
    // Revalidate pages
    revalidatePath("/operations");
    revalidatePath("/admin/deals");
    
    return { success: true };
  } catch (error) {
    console.error("[Deals] Error updating deal:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la mise à jour",
    };
  }
}

/**
 * Delete a deal (admin only)
 */
export async function deleteDeal(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Non authentifié" };
    }
    
    // Delete deal
    await db.delete(deals).where(eq(deals.id, id));
    
    // Revalidate pages
    revalidatePath("/operations");
    revalidatePath("/admin/deals");
    
    return { success: true };
  } catch (error) {
    console.error("[Deals] Error deleting deal:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Échec de la suppression",
    };
  }
}

/**
 * Get unique filter options from existing deals
 */
export async function getDealFilterOptions() {
  try {
    const result = await db
      .select({
        sector: deals.sector,
        region: deals.region,
        year: deals.year,
        mandateType: deals.mandateType,
      })
      .from(deals);
    
    const sectors = [...new Set(result.map(r => r.sector).filter(Boolean))].sort();
    const regions = [...new Set(result.map(r => r.region).filter(Boolean))].sort();
    const years = [...new Set(result.map(r => r.year))].sort((a, b) => b - a);
    const mandateTypes = [...new Set(result.map(r => r.mandateType).filter(Boolean))].sort();
    
    return { sectors, regions, years, mandateTypes };
  } catch (error) {
    console.error("[Deals] Error fetching filter options:", error);
    return { sectors: [], regions: [], years: [], mandateTypes: [] };
  }
}

/**
 * Get deal statistics for dashboard
 */
export async function getDealStats() {
  try {
    const [result] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(deals);
    
    return result?.count || 0;
  } catch (error) {
    console.error("[Deals] Error fetching stats:", error);
    return 0;
  }
}

/**
 * Get recent deals for dashboard
 */
export async function getRecentDeals(limit: number = 3) {
  try {
    const recentDeals = await db
      .select()
      .from(deals)
      .orderBy(desc(deals.year), desc(deals.createdAt))
      .limit(limit);
    
    return recentDeals;
  } catch (error) {
    console.error("[Deals] Error fetching recent deals:", error);
    return [];
  }
}
