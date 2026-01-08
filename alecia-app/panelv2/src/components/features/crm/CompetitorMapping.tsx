"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Target, 
  Plus, 
  X, 
  RefreshCw,
  Building2,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface Competitor {
  id: string;
  name: string;
  siren?: string;
  sector: string;
  revenue?: number;
  employees?: number;
  marketShare?: number;
  position: "leader" | "challenger" | "follower" | "niche";
  trend?: "up" | "down" | "stable";
  source?: "pappers" | "manual" | "ai";
  website?: string;
}

interface CompetitorMappingProps {
  companyId: string;
  companyName: string;
  companySector?: string;
  companyRevenue?: number;
  className?: string;
  onCompetitorAdded?: (competitor: Competitor) => void;
}

/**
 * Competitor Mapping Component
 * Identifies and displays competitors based on sector/region
 */
export function CompetitorMapping({
  companyId,
  companyName,
  companySector,
  companyRevenue,
  className,
  onCompetitorAdded,
}: CompetitorMappingProps) {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [manualName, setManualName] = useState("");

  // Load competitors on mount
  useEffect(() => {
    loadCompetitors();
  }, [companyId]);

  const loadCompetitors = async () => {
    setIsLoading(true);
    try {
      // Try API call
      const response = await fetch(`/api/intelligence/competitors?companyId=${companyId}`);
      if (response.ok) {
        const data = await response.json();
        setCompetitors(data.competitors || []);
      } else {
        // Use demo data
        setCompetitors(generateMockCompetitors(companyName, companySector, companyRevenue));
      }
    } catch {
      setCompetitors(generateMockCompetitors(companyName, companySector, companyRevenue));
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/ai/competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          sector: companySector,
          revenue: companyRevenue,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newCompetitors = data.competitors.map((c: any) => ({
          ...c,
          id: `ai-${Date.now()}-${Math.random()}`,
          source: "ai",
        }));
        setCompetitors([...competitors, ...newCompetitors]);
        toast.success(`${newCompetitors.length} concurrents identifiés par l'IA`);
      } else {
        toast.error("Analyse IA indisponible");
      }
    } catch {
      toast.error("Erreur lors de l'analyse");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addManualCompetitor = () => {
    if (!manualName.trim()) return;

    const newCompetitor: Competitor = {
      id: `manual-${Date.now()}`,
      name: manualName.trim(),
      sector: companySector || "Non spécifié",
      position: "challenger",
      source: "manual",
    };

    setCompetitors([...competitors, newCompetitor]);
    setManualName("");
    onCompetitorAdded?.(newCompetitor);
    toast.success("Concurrent ajouté");
  };

  const removeCompetitor = (id: string) => {
    setCompetitors(competitors.filter(c => c.id !== id));
    toast.success("Concurrent retiré");
  };

  const formatRevenue = (value?: number) => {
    if (!value) return "-";
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B€`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M€`;
    return `${(value / 1e3).toFixed(0)}k€`;
  };

  const getPositionBadge = (position: string) => {
    const configs: Record<string, { color: string; label: string }> = {
      leader: { color: "bg-amber-500 text-white", label: "Leader" },
      challenger: { color: "bg-blue-500 text-white", label: "Challenger" },
      follower: { color: "bg-gray-500 text-white", label: "Suiveur" },
      niche: { color: "bg-purple-500 text-white", label: "Niche" },
    };
    const config = configs[position] || configs.follower;
    return <Badge className={cn("text-xs", config.color)}>{config.label}</Badge>;
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-3.5 w-3.5 text-green-500" />;
      case "down": return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
      default: return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Mapping Concurrentiel
            </CardTitle>
            <CardDescription>
              {competitors.length} concurrent{competitors.length !== 1 ? "s" : ""} identifié{competitors.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="gap-1 h-7"
              onClick={analyzeWithAI}
              disabled={isAnalyzing}
            >
              <Sparkles className={cn("h-3.5 w-3.5", isAnalyzing && "animate-pulse")} />
              {isAnalyzing ? "Analyse..." : "IA"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={loadCompetitors}
              disabled={isLoading}
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add competitor manually */}
        <div className="flex gap-2">
          <Input
            placeholder="Ajouter un concurrent..."
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addManualCompetitor()}
            className="h-8 text-sm"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={addManualCompetitor}
            disabled={!manualName.trim()}
            className="h-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Competitors Table */}
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : competitors.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              Aucun concurrent identifié
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={analyzeWithAI}
              className="mt-2 gap-1"
            >
              <Sparkles className="h-4 w-4" />
              Analyser avec l'IA
            </Button>
          </div>
        ) : (
          <ScrollArea className="max-h-[350px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Entreprise</TableHead>
                  <TableHead>CA</TableHead>
                  <TableHead>Part marché</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead className="w-[40px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {competitors.map((competitor) => (
                  <TableRow key={competitor.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-sm flex items-center gap-1">
                            {competitor.name}
                            {competitor.website && (
                              <a
                                href={competitor.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {competitor.sector}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{formatRevenue(competitor.revenue)}</span>
                        {getTrendIcon(competitor.trend)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {competitor.marketShare ? (
                        <Badge variant="outline" className="text-xs">
                          {competitor.marketShare.toFixed(1)}%
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getPositionBadge(competitor.position)}
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => removeCompetitor(competitor.id)}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Retirer</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}

        {/* Source legend */}
        {competitors.length > 0 && (
          <div className="flex gap-3 text-xs text-muted-foreground pt-2 border-t">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Pappers
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              IA
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-gray-500" />
              Manuel
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Mock competitor data generator
function generateMockCompetitors(
  companyName: string,
  sector?: string,
  revenue?: number
): Competitor[] {
  const baseRevenue = revenue || 10000000;
  
  return [
    {
      id: "mock-1",
      name: "LEADER INDUSTRIES",
      sector: sector || "Industrie",
      revenue: baseRevenue * 2.5,
      employees: 450,
      marketShare: 28.5,
      position: "leader",
      trend: "up",
      source: "pappers",
    },
    {
      id: "mock-2", 
      name: "CHALLENGER SAS",
      sector: sector || "Industrie",
      revenue: baseRevenue * 1.3,
      employees: 180,
      marketShare: 15.2,
      position: "challenger",
      trend: "up",
      source: "pappers",
    },
    {
      id: "mock-3",
      name: "EUROPE TECH GROUP",
      sector: sector || "Industrie",
      revenue: baseRevenue * 0.8,
      employees: 95,
      marketShare: 8.7,
      position: "follower",
      trend: "stable",
      source: "pappers",
    },
  ];
}
