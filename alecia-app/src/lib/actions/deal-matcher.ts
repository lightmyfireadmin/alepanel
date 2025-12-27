"use server";

/**
 * Deal Matchmaker - SQL-Based Matching Algorithm
 * 
 * Matches Buyers (Acquéreurs) with Targets (Cibles) based on:
 * 1. Sector/Activity Tags
 * 2. Deal Size (Revenue/EBITDA ranges)
 * 3. Geographic preferences
 * 
 * Constraint: NO LLM/OpenAI embeddings - pure relational logic for cost savings.
 */

import { db } from "@/lib/db";
import { contacts, companies, buyerCriteria } from "@/lib/db/schema";
import { eq, sql, or, and, gte, lte, isNotNull, arrayContains } from "drizzle-orm";

export interface MatchCriteria {
  sector: string;
  region?: string;
  revenue?: number;
  ebitda?: number;
}

export interface MatchedBuyer {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  matchScore: number;
  matchReasons: string[];
  tags: string[] | null;
}

/**
 * Find matching buyers/investors for a target company.
 * 
 * Scoring Algorithm:
 * - Sector match: +40 points
 * - Region match: +30 points
 * - Financial range fit: +30 points
 * 
 * @param criteria - Target company characteristics to match against
 * @returns Array of matched buyers sorted by match score
 */
export async function findMatchingBuyers(criteria: MatchCriteria): Promise<MatchedBuyer[]> {
  try {
    // Step 1: Build dynamic matching conditions for the database query
    const conditions = [];

    // Sector match (using GIN index on targetSectors)
    if (criteria.sector) {
      conditions.push(arrayContains(buyerCriteria.targetSectors, [criteria.sector]));
    }

    // Region match (using GIN index on targetRegions)
    if (criteria.region) {
      conditions.push(arrayContains(buyerCriteria.targetRegions, [criteria.region]));
    }

    // Revenue match
    if (criteria.revenue !== undefined) {
      conditions.push(and(
        isNotNull(buyerCriteria.minRevenue),
        isNotNull(buyerCriteria.maxRevenue),
        lte(buyerCriteria.minRevenue, criteria.revenue),
        gte(buyerCriteria.maxRevenue, criteria.revenue)
      ));
    }

    // EBITDA match
    if (criteria.ebitda !== undefined) {
      conditions.push(and(
        isNotNull(buyerCriteria.minEbitda),
        isNotNull(buyerCriteria.maxEbitda),
        lte(buyerCriteria.minEbitda, criteria.ebitda),
        gte(buyerCriteria.maxEbitda, criteria.ebitda)
      ));
    }

    // If no specific criteria provided (unlikely given types), fall back to no filter
    // But since criteria.sector is mandatory, we will always have at least one condition.
    // We use OR because the scoring logic allows partial matches (if score > 0).
    const whereClause = conditions.length > 0 ? or(...conditions) : undefined;

    // Step 2: Get ONLY potentially matching buyer criteria from DB
    const buyerData = await db
      .select({
        contact: contacts,
        criteria: buyerCriteria,
        companyName: companies.name,
      })
      .from(buyerCriteria)
      .innerJoin(contacts, eq(contacts.id, buyerCriteria.contactId))
      .leftJoin(companies, eq(companies.id, contacts.companyId))
      .where(whereClause);
    
    // Step 3: Calculate match scores in application layer
    // (More flexible than complex SQL for scoring logic)
    const matches: MatchedBuyer[] = [];
    
    for (const row of buyerData) {
      const { contact, criteria: buyerPref, companyName } = row;
      const { score, reasons } = calculateMatchScore(buyerPref, criteria);
      
      // Only include if there's at least one match criterion
      if (score > 0) {
        matches.push({
          id: contact.id,
          name: contact.name,
          company: companyName,
          email: contact.email,
          matchScore: score,
          matchReasons: reasons,
          tags: contact.tags,
        });
      }
    }
    
    // Step 4: Sort by score descending
    return matches.sort((a, b) => b.matchScore - a.matchScore);
    
  } catch (error) {
    console.error("[DealMatcher] Error:", error);
    throw new Error("Failed to find matching buyers");
  }
}

/**
 * Calculate match score between buyer preferences and target criteria.
 */
function calculateMatchScore(
  buyerPref: typeof buyerCriteria.$inferSelect,
  target: MatchCriteria
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  
  // Sector match (+40 points)
  if (buyerPref.targetSectors && buyerPref.targetSectors.includes(target.sector)) {
    score += 40;
    reasons.push(`Secteur: ${target.sector}`);
  }
  
  // Region match (+30 points)
  if (target.region && buyerPref.targetRegions && buyerPref.targetRegions.includes(target.region)) {
    score += 30;
    reasons.push(`Région: ${target.region}`);
  }
  
  // Financial range fit (+30 points)
  if (target.revenue !== undefined && buyerPref.minRevenue !== null && buyerPref.maxRevenue !== null) {
    if (target.revenue >= buyerPref.minRevenue && target.revenue <= buyerPref.maxRevenue) {
      score += 15;
      reasons.push("CA dans la fourchette cible");
    }
  }
  
  if (target.ebitda !== undefined && buyerPref.minEbitda !== null && buyerPref.maxEbitda !== null) {
    if (target.ebitda >= buyerPref.minEbitda && target.ebitda <= buyerPref.maxEbitda) {
      score += 15;
      reasons.push("EBITDA dans la fourchette cible");
    }
  }
  
  return { score, reasons };
}

/**
 * Get investor suggestions from contacts with "Investisseur" tag.
 * Fallback when no buyer criteria exist.
 */
export async function getInvestorsByTag(sector?: string): Promise<MatchedBuyer[]> {
  try {
    const investors = await db
      .select({
        contact: contacts,
        companyName: companies.name,
      })
      .from(contacts)
      .leftJoin(companies, eq(companies.id, contacts.companyId))
      .where(
        sql`'Investisseur' = ANY(${contacts.tags})`
      );
    
    return investors.map((row) => ({
      id: row.contact.id,
      name: row.contact.name,
      company: row.companyName,
      email: row.contact.email,
      matchScore: sector && row.contact.tags?.includes(sector) ? 50 : 25,
      matchReasons: ["Tag: Investisseur"],
      tags: row.contact.tags,
    }));
    
  } catch (error) {
    console.error("[DealMatcher] Error fetching investors:", error);
    return [];
  }
}

/**
 * Save buyer criteria for a contact (upsert).
 */
export async function saveBuyerCriteria(
  contactId: string,
  criteria: {
    targetSectors?: string[];
    targetRegions?: string[];
    minRevenue?: number;
    maxRevenue?: number;
    minEbitda?: number;
    maxEbitda?: number;
    notes?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await db
      .insert(buyerCriteria)
      .values({
        contactId,
        ...criteria,
      })
      .onConflictDoUpdate({
        target: buyerCriteria.contactId,
        set: {
          ...criteria,
          updatedAt: new Date(),
        },
      });
    
    return { success: true };
    
  } catch (error) {
    console.error("[DealMatcher] Error saving criteria:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}
