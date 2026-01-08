"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  Clock,
  DollarSign,
  Percent
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ClosedDeal {
  id: string;
  name: string;
  outcome: "won" | "lost";
  amount: number;
  closedDate: Date;
  stage: string;
  lostReason?: string;
  daysToClose: number;
  sector?: string;
}

interface WinLossAnalysisProps {
  deals: ClosedDeal[];
  className?: string;
  period?: "all" | "year" | "quarter";
}

const formatCurrency = (value: number) => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B€`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M€`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}k€`;
  return `${value}€`;
};

/**
 * Win/Loss Analysis Dashboard
 * Comprehensive analysis of closed deals with insights
 */
export function WinLossAnalysis({
  deals,
  className,
  period = "all",
}: WinLossAnalysisProps) {
  // Calculate metrics
  const metrics = useMemo(() => {
    const won = deals.filter(d => d.outcome === "won");
    const lost = deals.filter(d => d.outcome === "lost");

    const totalValue = deals.reduce((sum, d) => sum + d.amount, 0);
    const wonValue = won.reduce((sum, d) => sum + d.amount, 0);
    const lostValue = lost.reduce((sum, d) => sum + d.amount, 0);

    const avgDaysToClose = won.length > 0
      ? won.reduce((sum, d) => sum + d.daysToClose, 0) / won.length
      : 0;

    const winRate = deals.length > 0 ? (won.length / deals.length) * 100 : 0;
    const valueWinRate = totalValue > 0 ? (wonValue / totalValue) * 100 : 0;

    // Lost reasons breakdown
    const lostReasons: Record<string, number> = {};
    lost.forEach(d => {
      const reason = d.lostReason || "Non spécifié";
      lostReasons[reason] = (lostReasons[reason] || 0) + 1;
    });

    // Monthly breakdown
    const monthlyData: Record<string, { won: number; lost: number; value: number }> = {};
    deals.forEach(d => {
      const month = d.closedDate.toISOString().slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { won: 0, lost: 0, value: 0 };
      }
      if (d.outcome === "won") {
        monthlyData[month].won++;
        monthlyData[month].value += d.amount;
      } else {
        monthlyData[month].lost++;
      }
    });

    return {
      total: deals.length,
      won: won.length,
      lost: lost.length,
      totalValue,
      wonValue,
      lostValue,
      winRate,
      valueWinRate,
      avgDaysToClose,
      avgDealSize: won.length > 0 ? wonValue / won.length : 0,
      lostReasons: Object.entries(lostReasons).map(([name, value]) => ({ name, value })),
      monthlyData: Object.entries(monthlyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, data]) => ({ month, ...data })),
    };
  }, [deals]);

  const pieData = [
    { name: "Gagnés", value: metrics.won, color: "#22c55e" },
    { name: "Perdus", value: metrics.lost, color: "#ef4444" },
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Analyse Win/Loss
            </CardTitle>
            <CardDescription>
              {metrics.total} dossiers clôturés
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              "text-sm",
              metrics.winRate >= 50 ? "text-green-600 border-green-200" : "text-red-600 border-red-200"
            )}
          >
            {metrics.winRate.toFixed(0)}% win rate
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {deals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              Aucun dossier clôturé à analyser
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-2xl font-bold">{metrics.won}</span>
                </div>
                <p className="text-xs text-muted-foreground">Gagnés</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-2xl font-bold">{metrics.lost}</span>
                </div>
                <p className="text-xs text-muted-foreground">Perdus</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-2xl font-bold">{formatCurrency(metrics.wonValue)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Valeur gagnée</p>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-2xl font-bold">{Math.round(metrics.avgDaysToClose)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Jours moyens</p>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="trends">Tendances</TabsTrigger>
                <TabsTrigger value="reasons">Raisons</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Pie Chart */}
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <p className="text-xs text-muted-foreground">Taille moyenne de deal</p>
                      <p className="text-lg font-semibold">{formatCurrency(metrics.avgDealSize)}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-xs text-muted-foreground">Win Rate en valeur</p>
                      <p className="text-lg font-semibold flex items-center gap-1">
                        <Percent className="h-4 w-4" />
                        {metrics.valueWinRate.toFixed(1)}%
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-xs text-muted-foreground">Valeur perdue</p>
                      <p className="text-lg font-semibold text-red-600">{formatCurrency(metrics.lostValue)}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trends" className="mt-4">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={metrics.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="won" name="Gagnés" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="lost" name="Perdus" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="reasons" className="mt-4">
                {metrics.lostReasons.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucune raison de perte enregistrée
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={metrics.lostReasons} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={120} />
                      <Tooltip />
                      <Bar dataKey="value" name="Dossiers" fill="#ef4444" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Example data
export const exampleWinLossData: ClosedDeal[] = [
  { id: "1", name: "Acquisition Alpha", outcome: "won", amount: 15000000, closedDate: new Date(2025, 10, 15), stage: "Closing", daysToClose: 120 },
  { id: "2", name: "Cession Beta", outcome: "won", amount: 8000000, closedDate: new Date(2025, 11, 1), stage: "Closing", daysToClose: 90 },
  { id: "3", name: "M&A Gamma", outcome: "lost", amount: 12000000, closedDate: new Date(2025, 11, 10), stage: "DD", lostReason: "Prix trop élevé", daysToClose: 60 },
  { id: "4", name: "Deal Delta", outcome: "lost", amount: 5000000, closedDate: new Date(2025, 11, 20), stage: "Négociation", lostReason: "Concurrent", daysToClose: 45 },
  { id: "5", name: "Acquisition Epsilon", outcome: "won", amount: 22000000, closedDate: new Date(2026, 0, 5), stage: "Closing", daysToClose: 150 },
];
