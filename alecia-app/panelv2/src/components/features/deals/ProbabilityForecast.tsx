"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Calculator, 
  TrendingUp,
  Scale,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Deal {
  id: string;
  name: string;
  amount: number;
  probability: number; // 0-100
  stage: string;
  expectedClose?: Date;
}

interface ProbabilityForecastProps {
  deals: Deal[];
  className?: string;
  onProbabilityChange?: (dealId: string, probability: number) => void;
  editable?: boolean;
}

const STAGE_PROBABILITIES: Record<string, number> = {
  "Origination": 10,
  "Prospection": 15,
  "NDA": 25,
  "Premier contact": 30,
  "Teaser envoyé": 35,
  "IM envoyé": 45,
  "Due Diligence": 60,
  "LOI": 70,
  "Négociation SPA": 80,
  "Signing": 90,
  "Closing": 95,
};

const formatCurrency = (value: number) => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B€`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M€`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}k€`;
  return `${value.toFixed(0)}€`;
};

/**
 * Probability Weighting Component
 * Calculates weighted pipeline value based on deal probabilities
 */
export function ProbabilityForecast({
  deals,
  className,
  onProbabilityChange,
  editable = true,
}: ProbabilityForecastProps) {
  const [localDeals, setLocalDeals] = useState(deals);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalPipeline = localDeals.reduce((sum, d) => sum + d.amount, 0);
    const weightedValue = localDeals.reduce(
      (sum, d) => sum + (d.amount * d.probability) / 100,
      0
    );
    const avgProbability = localDeals.length > 0
      ? localDeals.reduce((sum, d) => sum + d.probability, 0) / localDeals.length
      : 0;

    // Group by probability range
    const byRange = {
      high: localDeals.filter(d => d.probability >= 70),
      medium: localDeals.filter(d => d.probability >= 40 && d.probability < 70),
      low: localDeals.filter(d => d.probability < 40),
    };

    return {
      totalPipeline,
      weightedValue,
      avgProbability,
      byRange,
      highValue: byRange.high.reduce((sum, d) => sum + d.amount, 0),
      mediumValue: byRange.medium.reduce((sum, d) => sum + d.amount, 0),
      lowValue: byRange.low.reduce((sum, d) => sum + d.amount, 0),
    };
  }, [localDeals]);

  const handleProbabilityChange = (dealId: string, newProbability: number) => {
    setLocalDeals(deals => 
      deals.map(d => 
        d.id === dealId ? { ...d, probability: newProbability } : d
      )
    );
    onProbabilityChange?.(dealId, newProbability);
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 70) return "text-green-600";
    if (prob >= 40) return "text-amber-600";
    return "text-red-600";
  };

  const getProbabilityBg = (prob: number) => {
    if (prob >= 70) return "bg-green-500";
    if (prob >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Prévisions Pondérées
            </CardTitle>
            <CardDescription>
              Pipeline × Probabilité de closing
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-primary text-sm">
            {formatCurrency(metrics.weightedValue)} pondéré
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {localDeals.length === 0 ? (
          <div className="text-center py-8">
            <Calculator className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              Aucun dossier actif à prévoir
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 border rounded-lg bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-muted-foreground">Haute (≥70%)</span>
                </div>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(metrics.highValue)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {metrics.byRange.high.length} dossier(s)
                </p>
              </div>

              <div className="p-3 border rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-1">
                  <Scale className="h-4 w-4 text-amber-600" />
                  <span className="text-xs text-muted-foreground">Moyenne (40-69%)</span>
                </div>
                <p className="text-lg font-semibold text-amber-600">
                  {formatCurrency(metrics.mediumValue)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {metrics.byRange.medium.length} dossier(s)
                </p>
              </div>

              <div className="p-3 border rounded-lg bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-xs text-muted-foreground">Basse (&lt;40%)</span>
                </div>
                <p className="text-lg font-semibold text-red-600">
                  {formatCurrency(metrics.lowValue)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {metrics.byRange.low.length} dossier(s)
                </p>
              </div>
            </div>

            {/* Pipeline vs Weighted comparison */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Pipeline Total</span>
                <span className="text-lg font-bold">{formatCurrency(metrics.totalPipeline)}</span>
              </div>
              <Progress value={100} className="h-2 mb-3" />
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Valeur Pondérée</span>
                <span className="text-lg font-bold text-primary">{formatCurrency(metrics.weightedValue)}</span>
              </div>
              <Progress 
                value={(metrics.weightedValue / metrics.totalPipeline) * 100} 
                className="h-2"
              />
              
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Probabilité moyenne: {metrics.avgProbability.toFixed(0)}%
              </p>
            </div>

            {/* Deals Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dossier</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead className="w-[150px]">Probabilité</TableHead>
                  <TableHead className="text-right">Pondéré</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localDeals.map((deal) => {
                  const weightedAmount = (deal.amount * deal.probability) / 100;
                  
                  return (
                    <TableRow key={deal.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{deal.name}</p>
                          <p className="text-xs text-muted-foreground">{deal.stage}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatCurrency(deal.amount)}
                      </TableCell>
                      <TableCell>
                        {editable ? (
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[deal.probability]}
                              onValueChange={([v]) => handleProbabilityChange(deal.id, v)}
                              max={100}
                              step={5}
                              className="w-20"
                            />
                            <span className={cn("text-sm font-medium w-10", getProbabilityColor(deal.probability))}>
                              {deal.probability}%
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={deal.probability} 
                              className={cn("h-2 w-16", getProbabilityBg(deal.probability))}
                            />
                            <span className={cn("text-sm font-medium", getProbabilityColor(deal.probability))}>
                              {deal.probability}%
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn("text-sm font-semibold", getProbabilityColor(deal.probability))}>
                          {formatCurrency(weightedAmount)}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper to get default probability from stage
export function getDefaultProbability(stage: string): number {
  return STAGE_PROBABILITIES[stage] || 50;
}

// Example data
export const exampleForecastData: Deal[] = [
  { id: "1", name: "Acquisition Alpha", amount: 15000000, probability: 75, stage: "Négociation SPA" },
  { id: "2", name: "Cession Beta", amount: 8000000, probability: 60, stage: "Due Diligence" },
  { id: "3", name: "M&A Gamma", amount: 22000000, probability: 30, stage: "Teaser envoyé" },
  { id: "4", name: "Deal Delta", amount: 5000000, probability: 45, stage: "IM envoyé" },
  { id: "5", name: "Acquisition Epsilon", amount: 12000000, probability: 85, stage: "Signing" },
];
