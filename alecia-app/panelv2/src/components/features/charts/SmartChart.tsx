"use client";

import { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface SmartChartProps {
  title: string;
  description?: string;
  type: "bar" | "line" | "pie";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any[]; // Static data
  dataUrl?: string; // For fetching external JSON/CSV
  config?: {
    xAxisKey: string;
    seriesKeys: { key: string; color: string; name?: string }[];
  };
}

const COLORS = ["#0ea5e9", "#22c55e", "#eab308", "#f97316", "#ef4444", "#8b5cf6"];

export function SmartChart({ title, description, type, data: initialData, config }: SmartChartProps) {
  const [data, setData] = useState(initialData || []);
  const [loading, setLoading] = useState(!initialData);

  // Mock data loader if URL provided (placeholder for real fetch)
  useEffect(() => {
    let isMounted = true;
    if (!initialData) {
        // Simulate fetch
        const timer = setTimeout(() => {
            if (isMounted) {
                setData([
                    { name: "2021", revenue: 4000, ebitda: 2400 },
                    { name: "2022", revenue: 3000, ebitda: 1398 },
                    { name: "2023", revenue: 2000, ebitda: 9800 },
                    { name: "2024", revenue: 2780, ebitda: 3908 },
                    { name: "2025", revenue: 1890, ebitda: 4800 },
                ]);
                setLoading(false);
            }
        }, 1000);
        return () => { isMounted = false; clearTimeout(timer); };
    } else {
        setLoading(false);
    }
  }, [initialData]);

  const renderChart = () => {
    if (loading) return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>;
    if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No data available</div>;

    const xKey = config?.xAxisKey || "name";
    const series = config?.seriesKeys || [{ key: "value", color: "#8884d8" }];

    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey={xKey} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value}`} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              {series.map((s, i) => (
                <Bar 
                    key={s.key} 
                    dataKey={s.key} 
                    fill={s.color || COLORS[i % COLORS.length]} 
                    radius={[4, 4, 0, 0]} 
                    name={s.name || s.key}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey={xKey} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `€${value}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              {series.map((s, i) => (
                <Line 
                    key={s.key} 
                    type="monotone" 
                    dataKey={s.key} 
                    stroke={s.color || COLORS[i % COLORS.length]} 
                    strokeWidth={2}
                    dot={false}
                    name={s.name || s.key}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey={series[0].key}
                    >
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {data.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        )
      default:
        return null;
    }
  };

  return (
    <Card className="flex flex-col h-[350px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
        </div>
        {/* Placeholder for export/filter */}
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pb-4">
        {renderChart()}
      </CardContent>
    </Card>
  );
}
