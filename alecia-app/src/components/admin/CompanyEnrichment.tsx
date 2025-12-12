"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Search, Loader2, Check, MapPin, Users, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock Pappers API responses (French company registry)
const MOCK_COMPANIES = [
  {
    siren: "123456789",
    name: "TechCorp Solutions SAS",
    address: "15 Rue de la Paix, 75002 Paris",
    sector: "Technologies & logiciels",
    employees: 45,
    revenue: 8500000,
    ebitda: 1200000,
    year: 2024,
  },
  {
    siren: "987654321",
    name: "MediSanté France",
    address: "8 Avenue des Champs-Élysées, 75008 Paris",
    sector: "Santé",
    employees: 120,
    revenue: 25000000,
    ebitda: 3500000,
    year: 2024,
  },
  {
    siren: "456789123",
    name: "Industries du Nord SAS",
    address: "Zone Industrielle, 59000 Lille",
    sector: "Industries",
    employees: 85,
    revenue: 12000000,
    ebitda: 1800000,
    year: 2024,
  },
];

interface CompanyEnrichmentProps {
  onCompanySelect?: (company: typeof MOCK_COMPANIES[0]) => void;
  className?: string;
}

export function CompanyEnrichment({ onCompanySelect, className }: CompanyEnrichmentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<typeof MOCK_COMPANIES[0] | null>(null);

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Compute isSearching as derived state
  const isSearching = searchQuery !== debouncedQuery && searchQuery.length >= 2;

  // Compute results based on debounced query
  const results = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      return [];
    }
    return MOCK_COMPANIES.filter(
      (c) =>
        c.siren.includes(debouncedQuery) ||
        c.name.toLowerCase().includes(debouncedQuery.toLowerCase())
    );
  }, [debouncedQuery]);

  const handleSelect = (company: typeof MOCK_COMPANIES[0]) => {
    setSelectedCompany(company);
    setSearchQuery("");
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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--background-secondary)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--accent)]"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--accent)] animate-spin" />
          )}
        </div>

        {/* Search Results */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--background-secondary)]"
            >
              {results.map((company) => (
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
                  Vérifié
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
                <Button size="sm" className="flex-1 btn-gold">
                  Enregistrer
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint text */}
        {!selectedCompany && results.length === 0 && (
          <p className="text-xs text-center text-[var(--foreground-muted)]">
            Recherchez par numéro SIREN ou nom d&apos;entreprise
            <br />
            <span className="text-[var(--accent)]">Données Pappers (simulation)</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
