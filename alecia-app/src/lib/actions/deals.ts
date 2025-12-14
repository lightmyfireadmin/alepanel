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
    
    if (filters.sector && filters.sector !== 'all') {
      conditions.push(eq(deals.sector, filters.sector));
    }
    if (filters.region && filters.region !== 'all') {
      conditions.push(eq(deals.region, filters.region));
    }
    if (filters.year) {
      conditions.push(eq(deals.year, filters.year));
    }
    if (filters.mandateType && filters.mandateType !== 'all') {
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
export async function getDealFilterOptions(filters?: {
  sector?: string;
  region?: string;
  year?: number;
  mandateType?: string;
}) {
  try {
    // Helper to get conditions excluding specific key
    const conditions = (excludeKey: string) => {
      const conds = [];
      if (excludeKey !== 'sector' && filters?.sector && filters.sector !== 'all') conds.push(eq(deals.sector, filters.sector));
      if (excludeKey !== 'region' && filters?.region && filters.region !== 'all') conds.push(eq(deals.region, filters.region));
      if (excludeKey !== 'year' && filters?.year) conds.push(eq(deals.year, filters.year));
      if (excludeKey !== 'mandateType' && filters?.mandateType && filters.mandateType !== 'all') conds.push(eq(deals.mandateType, filters.mandateType));
      return conds.length > 0 ? and(...conds) : undefined;
    };

    const [sectorsResult, regionsResult, yearsResult, typesResult] = await Promise.all([
      // Get sectors based on other filters
      db.select({ val: deals.sector }).from(deals).where(conditions('sector')).groupBy(deals.sector),
      // Get regions based on other filters
      db.select({ val: deals.region }).from(deals).where(conditions('region')).groupBy(deals.region),
      // Get years based on other filters
      db.select({ val: deals.year }).from(deals).where(conditions('year')).groupBy(deals.year),
      // Get types based on other filters
      db.select({ val: deals.mandateType }).from(deals).where(conditions('mandateType')).groupBy(deals.mandateType),
    ]);

    const sectors = sectorsResult.map(r => r.val).filter((s): s is string => Boolean(s)).sort();
    const regions = regionsResult.map(r => r.val).filter((s): s is string => Boolean(s)).sort();
    const years = yearsResult.map(r => r.val).sort((a, b) => b - a);
    const mandateTypes = typesResult.map(r => r.val).filter((s): s is string => Boolean(s)).sort();
    
    console.log('[Deals Debug] Filters:', filters);
    console.log('[Deals Debug] Sectors:', sectors.length, sectors);
    console.log('[Deals Debug] Regions:', regions.length, regions);
    console.log('[Deals Debug] Years:', years.length, years);
    console.log('[Deals Debug] Types:', mandateTypes.length, mandateTypes);

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
