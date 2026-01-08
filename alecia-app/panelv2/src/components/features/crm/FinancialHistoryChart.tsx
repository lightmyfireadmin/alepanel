"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialYear {
  year: number;
  revenue?: number;      // CA
  ebitda?: number;       // EBE
  netResult?: number;    // Résultat Net
  equity?: number;       // Capitaux Propres
  netDebt?: number;      // Dette Nette
  employees?: number;    // Effectif
}

interface FinancialHistoryChartProps {
  data: FinancialYear[];
  className?: string;
  title?: string;
  showGrowth?: boolean;
}

const formatValue = (value: number | undefined): string => {
  if (value === undefined || value === null) return "-";
  if (Math.abs(value) >= 1e9) return `${(value / 1e9).toFixed(1)}B€`;
  if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(1)}M€`;
  if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(0)}k€`;
  return `${value.toFixed(0)}€`;
};

const formatTooltipValue = (value: number): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
};

const calculateGrowth = (current?: number, previous?: number): number | null => {
  if (!current || !previous || previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
};

const GrowthBadge = ({ value }: { value: number | null }) => {
  if (value === null) return <Badge variant="outline" className="text-xs">N/A</Badge>;
  
  const isPositive = value > 0;
  const isNeutral = Math.abs(value) < 1;
  
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs gap-1",
        isNeutral && "text-muted-foreground",
        isPositive && "text-green-600 border-green-200 bg-green-50",
        !isPositive && !isNeutral && "text-red-600 border-red-200 bg-red-50"
      )}
    >
      {isNeutral ? (
        <Minus className="h-3 w-3" />
      ) : isPositive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {isPositive ? "+" : ""}{value.toFixed(1)}%
    </Badge>
  );
};

export function FinancialHistoryChart({
  data,
  className,
  title = "Historique Financier",
  showGrowth = true,
}: FinancialHistoryChartProps) {
  // Sort data by year
  const sortedData = useMemo(() => 
    [...data].sort((a, b) => a.year - b.year), 
    [data]
  );

  // Calculate YoY growth for latest year
  const latestYear = sortedData[sortedData.length - 1];
  const previousYear = sortedData[sortedData.length - 2];

  const growthMetrics = useMemo(() => ({
    revenue: calculateGrowth(latestYear?.revenue, previousYear?.revenue),
    ebitda: calculateGrowth(latestYear?.ebitda, previousYear?.ebitda),
    netResult: calculateGrowth(latestYear?.netResult, previousYear?.netResult),
  }), [latestYear, previousYear]);

  // Prepare chart data
  const chartData = useMemo(() => 
    sortedData.map(year => ({
      year: year.year.toString(),
      "Chiffre d'affaires": year.revenue,
      "EBITDA": year.ebitda,
      "Résultat Net": year.netResult,
    })),
    [sortedData]
  );

  const marginChartData = useMemo(() =>
    sortedData.map(year => ({
      year: year.year.toString(),
      "Marge EBITDA": year.revenue && year.ebitda ? (year.ebitda / year.revenue) * 100 : 0,
      "Marge Nette": year.revenue && year.netResult ? (year.netResult / year.revenue) * 100 : 0,
    })),
    [sortedData]
  );

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-sm text-muted-foreground">
            Aucune donnée financière historique disponible
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {title}
            </CardTitle>
            <CardDescription className="mt-1">
              {sortedData[0]?.year} - {sortedData[sortedData.length - 1]?.year}
            </CardDescription>
          </div>
        </div>
        
        {/* Key Metrics Summary */}
        {showGrowth && latestYear && (
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">CA ({latestYear.year})</p>
              <p className="text-lg font-semibold">{formatValue(latestYear.revenue)}</p>
              <GrowthBadge value={growthMetrics.revenue} />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">EBITDA</p>
              <p className="text-lg font-semibold">{formatValue(latestYear.ebitda)}</p>
              <GrowthBadge value={growthMetrics.ebitda} />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Résultat Net</p>
              <p className="text-lg font-semibold">{formatValue(latestYear.netResult)}</p>
              <GrowthBadge value={growthMetrics.netResult} />
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="absolute" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="absolute">Valeurs Absolues</TabsTrigger>
            <TabsTrigger value="margins">Marges (%)</TabsTrigger>
          </TabsList>

          <TabsContent value="absolute" className="mt-0">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEbitda" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatValue(value)}
                  className="text-muted-foreground"
                />
                <Tooltip
                  formatter={(value: number) => formatTooltipValue(value)}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="Chiffre d'affaires"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="EBITDA"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorEbitda)"
                />
                <Area
                  type="monotone"
                  dataKey="Résultat Net"
                  stroke="#f59e0b"
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="margins" className="mt-0">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={marginChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value.toFixed(0)}%`}
                  className="text-muted-foreground"
                />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="Marge EBITDA" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Marge Nette" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
