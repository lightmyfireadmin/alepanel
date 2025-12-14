"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DealFilterProps {
  currentSector?: string;
  currentRegion?: string;
  currentYear?: string;
  currentType?: string;
  years: number[];
  availableSectors: string[];
  availableRegions: string[];
  availableTypes: string[];
}

export function DealFilter({
  currentSector,
  currentRegion,
  currentYear,
  currentType,
  years,
  availableSectors,
  availableRegions,
  availableTypes,
}: DealFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`/operations?${params.toString()}`, { scroll: false });
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      router.push("/operations", { scroll: false });
    });
  };

  const hasFilters = currentSector || currentRegion || currentYear || currentType;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-center gap-3">
        {/* Sector Filter */}
        <Select
          value={currentSector || "all"}
          onValueChange={(value) => updateFilter("sector", value)}
          // @ts-expect-error - modal prop is missing in the type but works in runtime
          modal={false}
        >
          <SelectTrigger className="w-[180px] bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]">
            <SelectValue placeholder="Secteur" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--background-secondary)] border-[var(--border)]">
            <SelectItem value="all">Tous les secteurs</SelectItem>
            {availableSectors.map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Region Filter */}
        <Select
          value={currentRegion || "all"}
          onValueChange={(value) => updateFilter("region", value)}
          // @ts-expect-error - modal prop is missing in the type but works in runtime
          modal={false}
        >
          <SelectTrigger className="w-[180px] bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]">
            <SelectValue placeholder="Région" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--background-secondary)] border-[var(--border)]">
            <SelectItem value="all">Toutes les régions</SelectItem>
            {availableRegions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year Filter */}
        <Select
          value={currentYear || "all"}
          onValueChange={(value) => updateFilter("year", value)}
          // @ts-expect-error - modal prop is missing in the type but works in runtime
          modal={false}
        >
          <SelectTrigger className="w-[180px] bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]">
            <SelectValue placeholder="Année" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--background-secondary)] border-[var(--border)]">
            <SelectItem value="all">Toutes les années</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Mandate Type Filter */}
        <Select
          value={currentType || "all"}
          onValueChange={(value) => updateFilter("type", value)}
          // @ts-expect-error - modal prop is missing in the type but works in runtime
          modal={false}
        >
          <SelectTrigger className="w-[180px] bg-[var(--input)] border-[var(--border)] text-[var(--foreground)]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--background-secondary)] border-[var(--border)]">
            <SelectItem value="all">Tous les types</SelectItem>
            {availableTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          >
            <X className="w-4 h-4 mr-1" />
            Effacer les filtres
          </Button>
          {isPending && (
            <span className="text-sm text-[var(--foreground-muted)]">
              Chargement...
            </span>
          )}
        </div>
      )}
    </div>
  );
}
