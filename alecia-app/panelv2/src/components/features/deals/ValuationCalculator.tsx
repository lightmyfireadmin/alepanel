"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calculator, 
  TrendingUp, 
  DollarSign,
  Scale,
  Download,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FinancialData {
  revenue?: number;
  ebitda?: number;
  netIncome?: number;
  equity?: number;
  netDebt?: number;
}

interface ComparableMultiple {
  name: string;
  evEbitda?: number;
  evRevenue?: number;
  peRatio?: number;
}

interface ValuationCalculatorProps {
  companyName?: string;
  financials?: FinancialData;
  comparables?: ComparableMultiple[];
  className?: string;
  onValuationChange?: (valuation: ValuationResult) => void;
}

interface ValuationResult {
  method: string;
  enterpriseValue: number;
  equityValue: number;
  multiple: number;
  metric: number;
}

const SECTOR_MULTIPLES: Record<string, { evEbitda: number; evRevenue: number; pe: number }> = {
  "tech-saas": { evEbitda: 15, evRevenue: 6, pe: 25 },
  "tech-hardware": { evEbitda: 10, evRevenue: 2, pe: 18 },
  "industrie": { evEbitda: 7, evRevenue: 1, pe: 12 },
  "distribution": { evEbitda: 6, evRevenue: 0.5, pe: 10 },
  "services": { evEbitda: 8, evRevenue: 1.5, pe: 14 },
  "sante": { evEbitda: 12, evRevenue: 3, pe: 20 },
  "immobilier": { evEbitda: 10, evRevenue: 4, pe: 15 },
  "agroalimentaire": { evEbitda: 7, evRevenue: 1, pe: 11 },
};

const formatCurrency = (value: number) => {
  if (!value || isNaN(value)) return "-";
  if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(2)}B€`;
  if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(2)}M€`;
  if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(0)}k€`;
  return `${value.toFixed(0)}€`;
};

/**
 * Valuation Calculator Component
 * Interactive multiples-based valuation with multiple methods
 */
export function ValuationCalculator({
  companyName = "Entreprise",
  financials: initialFinancials,
  comparables = [],
  className,
  onValuationChange,
}: ValuationCalculatorProps) {
  const [financials, setFinancials] = useState<FinancialData>(initialFinancials || {
    revenue: 10000000,
    ebitda: 1500000,
    netIncome: 800000,
    equity: 3000000,
    netDebt: 500000,
  });

  const [sector, setSector] = useState("services");
  const [customMultiples, setCustomMultiples] = useState({
    evEbitda: SECTOR_MULTIPLES.services.evEbitda,
    evRevenue: SECTOR_MULTIPLES.services.evRevenue,
    pe: SECTOR_MULTIPLES.services.pe,
  });

  // Update custom multiples when sector changes
  const handleSectorChange = (newSector: string) => {
    setSector(newSector);
    if (SECTOR_MULTIPLES[newSector]) {
      setCustomMultiples(SECTOR_MULTIPLES[newSector]);
    }
  };

  // Calculate valuations
  const valuations = useMemo(() => {
    const results: ValuationResult[] = [];
    const netDebt = financials.netDebt || 0;

    // EV/EBITDA method
    if (financials.ebitda) {
      const ev = financials.ebitda * customMultiples.evEbitda;
      results.push({
        method: "EV/EBITDA",
        enterpriseValue: ev,
        equityValue: ev - netDebt,
        multiple: customMultiples.evEbitda,
        metric: financials.ebitda,
      });
    }

    // EV/Revenue method
    if (financials.revenue) {
      const ev = financials.revenue * customMultiples.evRevenue;
      results.push({
        method: "EV/CA",
        enterpriseValue: ev,
        equityValue: ev - netDebt,
        multiple: customMultiples.evRevenue,
        metric: financials.revenue,
      });
    }

    // P/E method
    if (financials.netIncome) {
      const equityValue = financials.netIncome * customMultiples.pe;
      results.push({
        method: "P/E (RN)",
        enterpriseValue: equityValue + netDebt,
        equityValue: equityValue,
        multiple: customMultiples.pe,
        metric: financials.netIncome,
      });
    }

    return results;
  }, [financials, customMultiples]);

  // Average valuation
  const averageValuation = useMemo(() => {
    if (valuations.length === 0) return null;
    const avgEquity = valuations.reduce((sum, v) => sum + v.equityValue, 0) / valuations.length;
    const avgEv = valuations.reduce((sum, v) => sum + v.enterpriseValue, 0) / valuations.length;
    return { equityValue: avgEquity, enterpriseValue: avgEv };
  }, [valuations]);

  const updateFinancial = (key: keyof FinancialData, value: string) => {
    const numValue = parseFloat(value.replace(/[^0-9.-]/g, ""));
    setFinancials({ ...financials, [key]: isNaN(numValue) ? 0 : numValue });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculateur de Valorisation
            </CardTitle>
            <CardDescription>
              {companyName}
            </CardDescription>
          </div>
          {averageValuation && (
            <Badge variant="outline" className="text-primary text-sm font-semibold">
              {formatCurrency(averageValuation.equityValue)}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="inputs" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inputs">Données</TabsTrigger>
            <TabsTrigger value="multiples">Multiples</TabsTrigger>
            <TabsTrigger value="results">Résultats</TabsTrigger>
          </TabsList>

          {/* Inputs Tab */}
          <TabsContent value="inputs" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Chiffre d'affaires (€)</Label>
                <Input
                  type="text"
                  value={financials.revenue?.toLocaleString("fr-FR") || ""}
                  onChange={(e) => updateFinancial("revenue", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">EBITDA (€)</Label>
                <Input
                  type="text"
                  value={financials.ebitda?.toLocaleString("fr-FR") || ""}
                  onChange={(e) => updateFinancial("ebitda", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Résultat Net (€)</Label>
                <Input
                  type="text"
                  value={financials.netIncome?.toLocaleString("fr-FR") || ""}
                  onChange={(e) => updateFinancial("netIncome", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Dette Nette (€)</Label>
                <Input
                  type="text"
                  value={financials.netDebt?.toLocaleString("fr-FR") || ""}
                  onChange={(e) => updateFinancial("netDebt", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Calculated metrics */}
            {financials.revenue && financials.ebitda && (
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Métriques calculées</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Marge EBITDA:</span>
                    <span className="font-medium ml-2">
                      {((financials.ebitda / financials.revenue) * 100).toFixed(1)}%
                    </span>
                  </div>
                  {financials.netIncome && (
                    <div>
                      <span className="text-muted-foreground">Marge Nette:</span>
                      <span className="font-medium ml-2">
                        {((financials.netIncome / financials.revenue) * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Multiples Tab */}
          <TabsContent value="multiples" className="mt-4 space-y-4">
            <div>
              <Label className="text-xs">Secteur de référence</Label>
              <Select value={sector} onValueChange={handleSectorChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech-saas">Tech / SaaS</SelectItem>
                  <SelectItem value="tech-hardware">Tech / Hardware</SelectItem>
                  <SelectItem value="industrie">Industrie</SelectItem>
                  <SelectItem value="distribution">Distribution</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="sante">Santé</SelectItem>
                  <SelectItem value="immobilier">Immobilier</SelectItem>
                  <SelectItem value="agroalimentaire">Agroalimentaire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs">Multiple EV/EBITDA</Label>
                  <span className="text-sm font-semibold">{customMultiples.evEbitda.toFixed(1)}x</span>
                </div>
                <Slider
                  value={[customMultiples.evEbitda]}
                  onValueChange={([v]) => setCustomMultiples({ ...customMultiples, evEbitda: v })}
                  min={3}
                  max={25}
                  step={0.5}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs">Multiple EV/CA</Label>
                  <span className="text-sm font-semibold">{customMultiples.evRevenue.toFixed(1)}x</span>
                </div>
                <Slider
                  value={[customMultiples.evRevenue]}
                  onValueChange={([v]) => setCustomMultiples({ ...customMultiples, evRevenue: v })}
                  min={0.5}
                  max={10}
                  step={0.25}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs">Multiple P/E</Label>
                  <span className="text-sm font-semibold">{customMultiples.pe.toFixed(1)}x</span>
                </div>
                <Slider
                  value={[customMultiples.pe]}
                  onValueChange={([v]) => setCustomMultiples({ ...customMultiples, pe: v })}
                  min={5}
                  max={40}
                  step={1}
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1"
              onClick={() => {
                if (SECTOR_MULTIPLES[sector]) {
                  setCustomMultiples(SECTOR_MULTIPLES[sector]);
                  toast.success("Multiples réinitialisés");
                }
              }}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Réinitialiser aux multiples secteur
            </Button>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="mt-4 space-y-4">
            {valuations.length === 0 ? (
              <div className="text-center py-8">
                <Calculator className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  Renseignez les données financières
                </p>
              </div>
            ) : (
              <>
                {/* Valuation methods */}
                <div className="space-y-3">
                  {valuations.map((val) => (
                    <div
                      key={val.method}
                      className="p-3 border rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-sm">{val.method}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(val.metric)} × {val.multiple.toFixed(1)}x
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(val.equityValue)}</p>
                        <p className="text-xs text-muted-foreground">
                          EV: {formatCurrency(val.enterpriseValue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Average */}
                {averageValuation && (
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Valorisation Moyenne</p>
                        <p className="text-xs text-muted-foreground">
                          ({valuations.length} méthodes)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">
                          {formatCurrency(averageValuation.equityValue)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          EV: {formatCurrency(averageValuation.enterpriseValue)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Range */}
                {valuations.length > 1 && (
                  <div className="p-3 bg-muted/30 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Fourchette de valorisation</p>
                    <p className="text-sm font-medium">
                      {formatCurrency(Math.min(...valuations.map(v => v.equityValue)))}
                      {" - "}
                      {formatCurrency(Math.max(...valuations.map(v => v.equityValue)))}
                    </p>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
