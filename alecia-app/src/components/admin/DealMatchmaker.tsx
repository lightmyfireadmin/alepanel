"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Tag, Building2, Star, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { findMatchingBuyers, getInvestorsByTag, type MatchedBuyer } from "@/lib/actions/deal-matcher";

interface DealMatchmakerProps {
  dealTags?: string[];
  dealSector?: string;
  dealRegion?: string;
  dealRevenue?: number;
  dealEbitda?: number;
  className?: string;
  onAddInvestor?: (investor: MatchedBuyer) => void;
}

const tagColors: Record<string, string> = {
  "Fonds PE": "bg-purple-500/20 text-purple-400",
  "Family Office": "bg-pink-500/20 text-pink-400",
  "Banque": "bg-cyan-500/20 text-cyan-400",
  "Investisseur": "bg-emerald-500/20 text-emerald-400",
  "Acquéreur": "bg-amber-500/20 text-amber-400",
};

/**
 * Deal Matchmaker - SQL-Based Investor Matching
 * 
 * Matches Buyers (Acquéreurs) with Targets (Cibles) based on:
 * 1. Sector/Activity Tags
 * 2. Deal Size (Revenue/EBITDA ranges)
 * 3. Geographic preferences
 * 
 * Uses SQL-based matching algorithm (no LLM embeddings).
 */
export function DealMatchmaker({ 
  dealTags = [], 
  dealSector,
  dealRegion,
  dealRevenue,
  dealEbitda,
  className,
  onAddInvestor,
}: DealMatchmakerProps) {
  const [investors, setInvestors] = useState<MatchedBuyer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch matching investors
  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use dealSector if provided, otherwise fall back to first tag
      const sector = dealSector || dealTags[0];
      
      if (sector) {
        // Try SQL-based matching first
        const matches = await findMatchingBuyers({
          sector,
          region: dealRegion,
          revenue: dealRevenue,
          ebitda: dealEbitda,
        });
        
        if (matches.length > 0) {
          setInvestors(matches);
        } else {
          // Fallback: Get investors by tag
          const fallbackInvestors = await getInvestorsByTag(sector);
          setInvestors(fallbackInvestors);
        }
      } else {
        // No sector - get all investors
        const allInvestors = await getInvestorsByTag();
        setInvestors(allInvestors);
      }
    } catch (err) {
      console.error("[DealMatchmaker] Error:", err);
      setError("Erreur lors de la recherche d'investisseurs");
      setInvestors([]);
    } finally {
      setIsLoading(false);
    }
  }, [dealSector, dealTags, dealRegion, dealRevenue, dealEbitda]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 50) return "text-amber-400";
    return "text-[var(--foreground-muted)]";
  };

  // Get unique tags from all investors
  const allTags = investors
    .flatMap((i) => i.tags || [])
    .filter((tag, idx, arr) => arr.indexOf(tag) === idx)
    .slice(0, 5);

  return (
    <Card className={`bg-[var(--card)] border-[var(--border)] ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-[var(--foreground)]">
          <Star className="w-5 h-5 text-[var(--accent)]" />
          Investisseurs suggérés
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchMatches}
            disabled={isLoading}
            className="h-8 w-8"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          {dealSector && (
            <span className="text-xs text-[var(--foreground-muted)]">
              Basé sur: {dealSector}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[var(--accent)]" />
            <span className="ml-2 text-sm text-[var(--foreground-muted)]">
              Recherche en cours...
            </span>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-8 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && investors.length === 0 && (
          <div className="text-center py-8 text-[var(--foreground-muted)] text-sm">
            Aucun investisseur correspondant trouvé.
            <br />
            <span className="text-xs">Ajoutez des critères de recherche aux contacts.</span>
          </div>
        )}

        {/* Investor List */}
        <AnimatePresence>
          {!isLoading && investors.slice(0, 5).map((investor, idx) => (
            <motion.div
              key={investor.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-[var(--background-tertiary)] hover:bg-[var(--background-secondary)] transition-colors"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] font-semibold">
                {investor.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--foreground)] truncate">
                  {investor.name}
                </p>
                <div className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
                  {investor.company && (
                    <>
                      <Building2 className="w-3.5 h-3.5" />
                      <span className="truncate">{investor.company}</span>
                    </>
                  )}
                </div>
                {investor.matchReasons.length > 0 && (
                  <p className="text-xs text-[var(--foreground-muted)] mt-1">
                    {investor.matchReasons.join(" • ")}
                  </p>
                )}
              </div>

              {/* Match Score */}
              <div className="text-right shrink-0">
                <p className={`text-lg font-bold ${getScoreColor(investor.matchScore)}`}>
                  {investor.matchScore}%
                </p>
                <p className="text-xs text-[var(--foreground-muted)]">match</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Tags Legend */}
        {!isLoading && allTags.length > 0 && (
          <div className="pt-3 border-t border-[var(--border)]">
            <p className="text-xs text-[var(--foreground-muted)] mb-2">Tags correspondants</p>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map((tag) => (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${tagColors[tag] || "bg-gray-500/20 text-gray-400"}`}
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action */}
        {!isLoading && investors.length > 0 && (
          <Button 
            className="w-full btn-gold gap-2"
            onClick={() => onAddInvestor?.(investors[0])}
          >
            <UserPlus className="w-4 h-4" />
            Ajouter au deal
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
