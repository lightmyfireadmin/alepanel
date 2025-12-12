"use server";

/**
 * Company Enrichment Server Actions
 * 
 * Implements Database-First strategy for company enrichment.
 * Never call external API if data exists in database.
 * 
 * Trigger: Manual interaction ONLY (Button click).
 * Never trigger enrichment on list views or useEffect on page load.
 */

import { db } from "@/lib/db";
import { companies } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export interface EnrichedCompanyData {
  siren: string;
  name: string;
  address: string;
  sector: string;
  employees: number;
  revenue: number;
  ebitda: number;
  year: number;
  isEnriched: boolean;
}

interface EnrichmentResult {
  success: boolean;
  data?: EnrichedCompanyData;
  fromCache: boolean;
  error?: string;
}

/**
 * Check if company is already enriched in database.
 * Returns cached data if available and fresh.
 */
export async function checkEnrichedCompany(siren: string): Promise<EnrichedCompanyData | null> {
  try {
    const [existing] = await db
      .select()
      .from(companies)
      .where(eq(companies.siren, siren))
      .limit(1);
    
    if (existing && existing.isEnriched) {
      return {
        siren: existing.siren || "",
        name: existing.name,
        address: existing.address || "",
        sector: existing.sector || "",
        employees: existing.financialData?.employees || 0,
        revenue: existing.financialData?.revenue || 0,
        ebitda: existing.financialData?.ebitda || 0,
        year: existing.financialData?.year || new Date().getFullYear(),
        isEnriched: true,
      };
    }
    
    return null;
  } catch (error) {
    console.error("[CompanyEnrichment] Check error:", error);
    return null;
  }
}

/**
 * Enrich company data - DATABASE-FIRST strategy.
 * 
 * Flow:
 * 1. Check if company exists and is enriched
 * 2. If enriched (valid data) → return immediately (NO API CALL)
 * 3. If not enriched → call external API (Pappers/similar)
 * 4. Store enriched data with isEnriched = true
 */
export async function enrichCompany(siren: string): Promise<EnrichmentResult> {
  try {
    // Step 1: Check database first (DATABASE-FIRST)
    const cached = await checkEnrichedCompany(siren);
    
    if (cached) {
      console.log(`[CompanyEnrichment] Cache hit for SIREN: ${siren}`);
      return {
        success: true,
        data: cached,
        fromCache: true,
      };
    }
    
    // Step 2: Not in cache - call external API
    // Note: In production, replace with actual Pappers API call
    // For now, simulating API response
    console.log(`[CompanyEnrichment] API call for SIREN: ${siren}`);
    
    // Simulated API call (replace with actual Pappers integration)
    const apiData = await simulatePappersApiCall(siren);
    
    if (!apiData) {
      return {
        success: false,
        fromCache: false,
        error: "Entreprise non trouvée",
      };
    }
    
    // Step 3: Store in database with isEnriched = true
    const [upserted] = await db
      .insert(companies)
      .values({
        name: apiData.name,
        siren: apiData.siren,
        address: apiData.address,
        sector: apiData.sector,
        financialData: {
          revenue: apiData.revenue,
          ebitda: apiData.ebitda,
          employees: apiData.employees,
          year: apiData.year,
        },
        isEnriched: true,
        lastEnrichedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: companies.siren,
        set: {
          name: apiData.name,
          address: apiData.address,
          sector: apiData.sector,
          financialData: {
            revenue: apiData.revenue,
            ebitda: apiData.ebitda,
            employees: apiData.employees,
            year: apiData.year,
          },
          isEnriched: true,
          lastEnrichedAt: new Date(),
          updatedAt: new Date(),
        },
      })
      .returning();
    
    console.log(`[CompanyEnrichment] Stored in DB: ${upserted.id}`);
    
    return {
      success: true,
      data: {
        ...apiData,
        isEnriched: true,
      },
      fromCache: false,
    };
    
  } catch (error) {
    console.error("[CompanyEnrichment] Error:", error);
    return {
      success: false,
      fromCache: false,
      error: error instanceof Error ? error.message : "Erreur lors de l'enrichissement",
    };
  }
}

/**
 * Simulated Pappers API call.
 * Replace with actual implementation when API key is available.
 */
async function simulatePappersApiCall(siren: string): Promise<EnrichedCompanyData | null> {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Mock data based on SIREN pattern
  // In production: call https://api.pappers.fr/v2/entreprise?siren={siren}
  
  const mockData: Record<string, EnrichedCompanyData> = {
    "123456789": {
      siren: "123456789",
      name: "TechCorp Solutions SAS",
      address: "15 Rue de la Paix, 75002 Paris",
      sector: "Technologies & logiciels",
      employees: 45,
      revenue: 8500000,
      ebitda: 1200000,
      year: 2024,
      isEnriched: true,
    },
    "987654321": {
      siren: "987654321",
      name: "MediSanté France",
      address: "8 Avenue des Champs-Élysées, 75008 Paris",
      sector: "Santé",
      employees: 120,
      revenue: 25000000,
      ebitda: 3500000,
      year: 2024,
      isEnriched: true,
    },
    "456789123": {
      siren: "456789123",
      name: "Industries du Nord SAS",
      address: "Zone Industrielle, 59000 Lille",
      sector: "Industries",
      employees: 85,
      revenue: 12000000,
      ebitda: 1800000,
      year: 2024,
      isEnriched: true,
    },
  };
  
  return mockData[siren] || null;
}

/**
 * Search companies by name (for autocomplete).
 */
export async function searchCompanies(query: string): Promise<EnrichedCompanyData[]> {
  if (!query || query.length < 2) {
    return [];
  }
  
  try {
    const results = await db
      .select()
      .from(companies)
      .where(eq(companies.isEnriched, true))
      .limit(10);
    
    // Filter by name containing query (case insensitive)
    return results
      .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
      .map((c) => ({
        siren: c.siren || "",
        name: c.name,
        address: c.address || "",
        sector: c.sector || "",
        employees: c.financialData?.employees || 0,
        revenue: c.financialData?.revenue || 0,
        ebitda: c.financialData?.ebitda || 0,
        year: c.financialData?.year || new Date().getFullYear(),
        isEnriched: c.isEnriched || false,
      }));
      
  } catch (error) {
    console.error("[CompanyEnrichment] Search error:", error);
    return [];
  }
}
