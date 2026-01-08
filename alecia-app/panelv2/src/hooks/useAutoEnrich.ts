"use client";

import { useCallback, useEffect } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { toast } from "sonner";

interface EnrichmentResult {
  success: boolean;
  siren?: string;
  nafCode?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  financials?: {
    revenue?: number;
    ebitda?: number;
    netResult?: number;
    employees?: number;
  };
  legalInfo?: {
    legalForm?: string;
    capitalSocial?: number;
    creationDate?: string;
    vatNumber?: string;
  };
  shareholders?: {
    name: string;
    percentage: number;
    type: string;
  }[];
  error?: string;
}

interface UseAutoEnrichOptions {
  /** Enable auto-enrichment on company creation */
  autoEnrichOnCreate?: boolean;
  /** Show toast notifications */
  showToasts?: boolean;
  /** Callback when enrichment completes */
  onEnrichmentComplete?: (result: EnrichmentResult) => void;
}

/**
 * Hook for automatic company enrichment via Pappers API
 * 
 * Usage:
 * ```tsx
 * const { enrichCompany, isEnriching, enrichOnCreation } = useAutoEnrich();
 * 
 * // Manual enrichment
 * await enrichCompany(companyId, companyName);
 * 
 * // Auto-enrich on creation
 * const newCompany = await createCompany({ name: "Company" });
 * await enrichOnCreation(newCompany._id, "Company Name");
 * ```
 */
export function useAutoEnrich(options: UseAutoEnrichOptions = {}) {
  const { 
    autoEnrichOnCreate = true, 
    showToasts = true,
    onEnrichmentComplete 
  } = options;

  // Convex actions for Pappers API
  const searchPappers = useAction(api.actions.intelligence.searchCompanyPappers);
  const updateCompany = useMutation(api.mutations.updateCompany);

  /**
   * Enrich a company with data from Pappers
   */
  const enrichCompany = useCallback(async (
    companyId: Id<"companies">,
    companyName: string
  ): Promise<EnrichmentResult> => {
    try {
      // Search Pappers for company data
      const results = await searchPappers({ query: companyName });

      if (!results || results.length === 0) {
        if (showToasts) {
          toast.info(`Aucune donnée Pappers trouvée pour "${companyName}"`);
        }
        return { success: false, error: "No results found" };
      }

      // Take the best match (first result)
      const papperData = results[0];

      // Update company with enriched data
      await updateCompany({
        id: companyId,
        patch: {
          siren: papperData.siren,
          nafCode: papperData.nafCode,
          vatNumber: papperData.vatNumber,
          address: papperData.address,
          financials: papperData.financials,
          legalInfo: papperData.legalInfo,
          pappersId: papperData.pappersId || papperData.siren,
          enrichedAt: new Date().toISOString(),
        },
      });

      const result: EnrichmentResult = {
        success: true,
        siren: papperData.siren,
        nafCode: papperData.nafCode,
        address: papperData.address,
        financials: papperData.financials,
        legalInfo: papperData.legalInfo,
        shareholders: papperData.shareholders,
      };

      if (showToasts) {
        toast.success(`"${companyName}" enrichie avec les données Pappers`);
      }

      onEnrichmentComplete?.(result);
      return result;

    } catch (error) {
      console.error("Enrichment error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      if (showToasts) {
        toast.error(`Erreur d'enrichissement pour "${companyName}"`);
      }

      return { success: false, error: errorMessage };
    }
  }, [searchPappers, updateCompany, showToasts, onEnrichmentComplete]);

  /**
   * Trigger enrichment after company creation (background)
   */
  const enrichOnCreation = useCallback(async (
    companyId: Id<"companies">,
    companyName: string
  ): Promise<void> => {
    if (!autoEnrichOnCreate) return;

    // Run enrichment in the background (don't await in UI)
    enrichCompany(companyId, companyName).catch(err => {
      console.error("Background enrichment failed:", err);
    });
  }, [autoEnrichOnCreate, enrichCompany]);

  /**
   * Enrich multiple companies in batch
   */
  const enrichBatch = useCallback(async (
    companies: { id: Id<"companies">; name: string }[]
  ): Promise<{ success: number; failed: number }> => {
    let success = 0;
    let failed = 0;

    for (const company of companies) {
      const result = await enrichCompany(company.id, company.name);
      if (result.success) {
        success++;
      } else {
        failed++;
      }
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (showToasts) {
      toast.success(`Enrichissement terminé: ${success} succès, ${failed} échecs`);
    }

    return { success, failed };
  }, [enrichCompany, showToasts]);

  return {
    enrichCompany,
    enrichOnCreation,
    enrichBatch,
  };
}

/**
 * Component wrapper for auto-enrichment effect
 * Add this to company creation forms
 */
interface AutoEnrichTriggerProps {
  companyId: Id<"companies"> | null;
  companyName: string;
  enabled?: boolean;
}

export function AutoEnrichTrigger({ 
  companyId, 
  companyName, 
  enabled = true 
}: AutoEnrichTriggerProps) {
  const { enrichOnCreation } = useAutoEnrich({ autoEnrichOnCreate: enabled });

  useEffect(() => {
    if (companyId && companyName && enabled) {
      enrichOnCreation(companyId, companyName);
    }
  }, [companyId, companyName, enabled, enrichOnCreation]);

  return null; // This is an effect-only component
}
