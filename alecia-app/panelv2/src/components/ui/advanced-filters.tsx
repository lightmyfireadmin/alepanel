"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Calendar, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterOperator = 
  | "equals" 
  | "contains" 
  | "startsWith" 
  | "greaterThan" 
  | "lessThan" 
  | "between"
  | "isEmpty"
  | "isNotEmpty";

export type FilterType = "text" | "number" | "date" | "select";

export interface FilterDefinition {
  id: string;
  label: string;
  type: FilterType;
  options?: { value: string; label: string }[]; // For select type
}

export interface ActiveFilter {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string;
  value2?: string; // For "between" operator
}

interface AdvancedFiltersProps {
  definitions: FilterDefinition[];
  filters: ActiveFilter[];
  onFiltersChange: (filters: ActiveFilter[]) => void;
  className?: string;
}

const operatorLabels: Record<FilterOperator, string> = {
  equals: "est égal à",
  contains: "contient",
  startsWith: "commence par",
  greaterThan: "supérieur à",
  lessThan: "inférieur à",
  between: "entre",
  isEmpty: "est vide",
  isNotEmpty: "n'est pas vide",
};

const operatorsByType: Record<FilterType, FilterOperator[]> = {
  text: ["contains", "equals", "startsWith", "isEmpty", "isNotEmpty"],
  number: ["equals", "greaterThan", "lessThan", "between", "isEmpty"],
  date: ["equals", "greaterThan", "lessThan", "between", "isEmpty"],
  select: ["equals", "isEmpty", "isNotEmpty"],
};

export function AdvancedFilters({
  definitions,
  filters,
  onFiltersChange,
  className,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newFilter, setNewFilter] = useState<Partial<ActiveFilter>>({});

  const addFilter = useCallback(() => {
    if (!newFilter.field || !newFilter.operator) return;
    
    const filter: ActiveFilter = {
      id: `filter-${Date.now()}`,
      field: newFilter.field,
      operator: newFilter.operator,
      value: newFilter.value || "",
      value2: newFilter.value2,
    };
    
    onFiltersChange([...filters, filter]);
    setNewFilter({});
    setIsOpen(false);
  }, [newFilter, filters, onFiltersChange]);

  const removeFilter = useCallback((id: string) => {
    onFiltersChange(filters.filter(f => f.id !== id));
  }, [filters, onFiltersChange]);

  const clearAllFilters = useCallback(() => {
    onFiltersChange([]);
  }, [onFiltersChange]);

  const selectedDefinition = definitions.find(d => d.id === newFilter.field);
  const availableOperators = selectedDefinition 
    ? operatorsByType[selectedDefinition.type]
    : [];

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {/* Active Filters */}
      {filters.map((filter) => {
        const def = definitions.find(d => d.id === filter.field);
        return (
          <Badge
            key={filter.id}
            variant="secondary"
            className="gap-1 pr-1"
          >
            <span className="font-medium">{def?.label || filter.field}</span>
            <span className="text-muted-foreground mx-1">
              {operatorLabels[filter.operator]}
            </span>
            {filter.operator !== "isEmpty" && filter.operator !== "isNotEmpty" && (
              <span className="font-semibold">
                {filter.operator === "between" 
                  ? `${filter.value} - ${filter.value2}`
                  : filter.value
                }
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 hover:bg-destructive/20"
              onClick={() => removeFilter(filter.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        );
      })}

      {/* Add Filter Button */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1 h-7">
            <Filter className="h-3.5 w-3.5" />
            Filtrer
            {filters.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                {filters.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div className="font-medium text-sm">Ajouter un filtre</div>
            
            {/* Field Selection */}
            <div className="space-y-2">
              <Label className="text-xs">Champ</Label>
              <Select
                value={newFilter.field}
                onValueChange={(value) => setNewFilter({ field: value, operator: undefined, value: "" })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Sélectionner un champ" />
                </SelectTrigger>
                <SelectContent>
                  {definitions.map((def) => (
                    <SelectItem key={def.id} value={def.id} className="text-xs">
                      {def.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Operator Selection */}
            {newFilter.field && (
              <div className="space-y-2">
                <Label className="text-xs">Condition</Label>
                <Select
                  value={newFilter.operator}
                  onValueChange={(value) => setNewFilter({...newFilter, operator: value as FilterOperator })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Sélectionner une condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOperators.map((op) => (
                      <SelectItem key={op} value={op} className="text-xs">
                        {operatorLabels[op]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Value Input */}
            {newFilter.operator && !["isEmpty", "isNotEmpty"].includes(newFilter.operator) && (
              <div className="space-y-2">
                <Label className="text-xs">Valeur</Label>
                {selectedDefinition?.type === "select" && selectedDefinition.options ? (
                  <Select
                    value={newFilter.value}
                    onValueChange={(value) => setNewFilter({...newFilter, value })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedDefinition.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="text-xs">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : selectedDefinition?.type === "date" ? (
                  <Input
                    type="date"
                    className="h-8 text-xs"
                    value={newFilter.value || ""}
                    onChange={(e) => setNewFilter({...newFilter, value: e.target.value })}
                  />
                ) : (
                  <Input
                    type={selectedDefinition?.type === "number" ? "number" : "text"}
                    className="h-8 text-xs"
                    placeholder="Entrer une valeur"
                    value={newFilter.value || ""}
                    onChange={(e) => setNewFilter({...newFilter, value: e.target.value })}
                  />
                )}
                
                {/* Second value for "between" */}
                {newFilter.operator === "between" && (
                  <>
                    <span className="text-xs text-muted-foreground">et</span>
                    <Input
                      type={selectedDefinition?.type === "date" ? "date" : "number"}
                      className="h-8 text-xs"
                      placeholder="Valeur maximale"
                      value={newFilter.value2 || ""}
                      onChange={(e) => setNewFilter({...newFilter, value2: e.target.value })}
                    />
                  </>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={addFilter}
                disabled={!newFilter.field || !newFilter.operator}
                className="gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Ajouter
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear All */}
      {filters.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground"
          onClick={clearAllFilters}
        >
          Effacer tout
        </Button>
      )}
    </div>
  );
}

/**
 * Hook to apply advanced filters to data
 */
export function useAdvancedFilters<T extends Record<string, any>>() {
  const [filters, setFilters] = useState<ActiveFilter[]>([]);

  const applyFilters = useCallback((data: T[]): T[] => {
    if (filters.length === 0) return data;

    return data.filter(item => {
      return filters.every(filter => {
        const value = item[filter.field];
        const filterValue = filter.value;
        const filterValue2 = filter.value2;

        switch (filter.operator) {
          case "equals":
            return String(value).toLowerCase() === String(filterValue).toLowerCase();
          case "contains":
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
          case "startsWith":
            return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
          case "greaterThan":
            return Number(value) > Number(filterValue);
          case "lessThan":
            return Number(value) < Number(filterValue);
          case "between":
            return Number(value) >= Number(filterValue) && Number(value) <= Number(filterValue2);
          case "isEmpty":
            return value === null || value === undefined || value === "";
          case "isNotEmpty":
            return value !== null && value !== undefined && value !== "";
          default:
            return true;
        }
      });
    });
  }, [filters]);

  return {
    filters,
    setFilters,
    applyFilters,
  };
}
