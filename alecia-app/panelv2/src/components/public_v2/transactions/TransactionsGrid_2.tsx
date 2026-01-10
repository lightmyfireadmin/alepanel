"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { TombstoneCard_2, TombstoneData } from "./TombstoneCard_2";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * TransactionsGrid_2 - Grille de tombstones avec filtres
 * 
 * Selon cahier des charges :
 * - Classement par région / type d'opération / secteur avec filtre en en-tête
 * - 3 tombstones par ligne
 */

interface TransactionsGrid_2Props {
  transactions: TombstoneData[];
}

// Extract unique values for filters
function getUniqueValues(transactions: TombstoneData[], key: keyof TombstoneData): string[] {
  const values = transactions.map((t) => t[key] as string);
  return [...new Set(values)].sort();
}

export function TransactionsGrid_2({ transactions }: TransactionsGrid_2Props) {
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [operationTypeFilter, setOperationTypeFilter] = useState<string>("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique filter options
  const regions = useMemo(() => getUniqueValues(transactions, "region"), [transactions]);
  const operationTypes = useMemo(() => getUniqueValues(transactions, "operationType"), [transactions]);
  const sectors = useMemo(() => getUniqueValues(transactions, "sector"), [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (regionFilter !== "all" && t.region !== regionFilter) return false;
      if (operationTypeFilter !== "all" && t.operationType !== operationTypeFilter) return false;
      if (sectorFilter !== "all" && t.sector !== sectorFilter) return false;
      return true;
    });
  }, [transactions, regionFilter, operationTypeFilter, sectorFilter]);

  const hasActiveFilters = regionFilter !== "all" || operationTypeFilter !== "all" || sectorFilter !== "all";

  const clearFilters = () => {
    setRegionFilter("all");
    setOperationTypeFilter("all");
    setSectorFilter("all");
  };

  return (
    <div>
      {/* Filters Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtres
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-[var(--accent)] rounded-full" />
              )}
            </Button>
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              >
                <X className="w-4 h-4 mr-1" />
                Effacer
              </Button>
            )}
          </div>

          <p className="text-sm text-[var(--foreground-muted)]">
            {filteredTransactions.length} transaction{filteredTransactions.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid sm:grid-cols-3 gap-4 p-4 bg-[var(--background-secondary)] rounded-xl border border-[var(--border)]"
          >
            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Région
              </label>
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-full bg-[var(--background)]">
                  <SelectValue placeholder="Toutes les régions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les régions</SelectItem>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Operation Type Filter */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Type d'opération
              </label>
              <Select value={operationTypeFilter} onValueChange={setOperationTypeFilter}>
                <SelectTrigger className="w-full bg-[var(--background)]">
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  {operationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sector Filter */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                Secteur
              </label>
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger className="w-full bg-[var(--background)]">
                  <SelectValue placeholder="Tous les secteurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les secteurs</SelectItem>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}
      </div>

      {/* Grid - 3 per row */}
      {filteredTransactions.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <TombstoneCard_2 transaction={transaction} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <p className="text-[var(--foreground-muted)]">
            Aucune transaction ne correspond à vos critères.
          </p>
          <Button variant="outline" onClick={clearFilters} className="mt-4">
            Afficher toutes les transactions
          </Button>
        </div>
      )}
    </div>
  );
}
