"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Search, Loader2, Check, MapPin, Users, TrendingUp, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  enrichCompany, 
  searchCompanies,
  type EnrichedCompanyData 
} from "@/lib/actions/company-enrichment";

interface CompanyEnrichmentProps {
  onCompanySelect?: (company: EnrichedCompanyData) => void;
  className?: string;
}

/**
 * CompanyEnrichment - Database-First Company Lookup
 * 
 * CRITICAL: Implements Database-First strategy for cost control.
 * - Checks DB cache before any external API call
 * - Manual trigger ONLY (button click, not on load)
 * - Stores enriched data with isEnriched = true
 */
export function CompanyEnrichment({ onCompanySelect, className }: CompanyEnrichmentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<EnrichedCompanyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<EnrichedCompanyData[]>([]);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Search cached companies when query changes

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      startTransition(async () => {
        const results = await searchCompanies(debouncedQuery);
        setSearchResults(results);
      });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchResults([]);
    }
  }, [debouncedQuery]);

  // Compute isSearching as derived state
  const isSearching = searchQuery !== debouncedQuery && searchQuery.length >= 2;

  // Check if query looks like a SIREN number
  const isSirenQuery = useMemo(() => {
    return /^\d{9}$/.test(searchQuery.trim());
  }, [searchQuery]);

  /**
   * Handle enrichment - MANUAL TRIGGER ONLY
   * This is the only way to call the external API.
   */
  const handleEnrich = async () => {
    if (!isSirenQuery) {
      setError("Veuillez entrer un numéro SIREN valide (9 chiffres)");
      return;
    }

    setError(null);
    
    startTransition(async () => {
      const result = await enrichCompany(searchQuery.trim());
      
      if (result.success && result.data) {
        setSelectedCompany(result.data);
        setSearchQuery("");
        
        if (result.fromCache) {
          console.log("[CompanyEnrichment] Loaded from cache (no API call)");
        } else {
          console.log("[CompanyEnrichment] Fetched from API and cached");
        }
      } else {
        setError(result.error || "Entreprise non trouvée");
      }
    });
  };

  const handleSelect = (company: EnrichedCompanyData) => {
    setSelectedCompany(company);
    setSearchQuery("");
    setSearchResults([]);
    onCompanySelect?.(company);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className={`bg-[var(--card)] border-[var(--border)] ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--foreground)]">
          <Building2 className="w-5 h-5 text-[var(--accent)]" />
          Enrichissement entreprise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
          <input
            type="text"
            placeholder="Rechercher par SIREN ou nom..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setError(null);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--accent)]"
          />
          {(isSearching || isPending) && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--accent)] animate-spin" />
          )}
        </div>

        {/* SIREN Enrichment Button - Manual trigger only */}
        {isSirenQuery && !isPending && (
          <Button
            onClick={handleEnrich}
            className="w-full btn-gold gap-2"
          >
            <Search className="w-4 h-4" />
            Enrichir le SIREN {searchQuery}
          </Button>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Search Results from Cache */}
        <AnimatePresence>
          {searchResults.length > 0 && !selectedCompany && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--background-secondary)]"
            >
              {searchResults.map((company) => (
                <button
                  key={company.siren}
                  onClick={() => handleSelect(company)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-[var(--background-tertiary)] transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--foreground)] truncate">
                      {company.name}
                    </p>
                    <p className="text-xs text-[var(--foreground-muted)]">
                      SIREN: {company.siren} • {company.sector}
                    </p>
                  </div>
                  {company.isEnriched && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                      Enrichi
                    </span>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Company Card */}
        <AnimatePresence>
          {selectedCompany && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 rounded-lg bg-[var(--background-tertiary)] border border-[var(--accent)]/30"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-[var(--foreground)]">
                    {selectedCompany.name}
                  </p>
                  <p className="text-sm text-[var(--foreground-muted)] font-mono">
                    SIREN: {selectedCompany.siren}
                  </p>
                </div>
                <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {selectedCompany.isEnriched ? "Enrichi" : "Vérifié"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{selectedCompany.address}</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
                  <Users className="w-3.5 h-3.5" />
                  <span>{selectedCompany.employees} employés</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>CA: {formatCurrency(selectedCompany.revenue)}</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>EBITDA: {formatCurrency(selectedCompany.ebitda)}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[var(--border)] flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-[var(--border)]"
                  onClick={() => setSelectedCompany(null)}
                >
                  Modifier
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 btn-gold"
                  onClick={() => onCompanySelect?.(selectedCompany)}
                >
                  Enregistrer
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint text */}
        {!selectedCompany && searchResults.length === 0 && !isSirenQuery && (
          <p className="text-xs text-center text-[var(--foreground-muted)]">
            Recherchez par numéro SIREN ou nom d&apos;entreprise
            <br />
            <span className="text-[var(--accent)]">
              Données en cache + enrichissement à la demande
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
