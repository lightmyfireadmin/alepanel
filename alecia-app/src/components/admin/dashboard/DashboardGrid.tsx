"use client";

import React from "react";
import * as echarts from "echarts";
import { 
  Plus, 
  Search, 
  UserPlus, 
  FileText, 
  ArrowUpRight,
  MessageSquare,
  Clock
} from "lucide-react";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { EChart } from "@/components/charts/EChart";
import { OfficeWidgets } from "@/components/admin/dashboard/OfficeWidgets";

interface Thread {
  id: string;
  title: string;
  categoryName: string | null;
  authorName: string | null;
  lastPostAt: string | Date | null;
}

interface OfficeData {
  city: string;
  weather: {
    temp: number;
    condition: string;
    icon: string;
  };
  transport: {
    nextTrain: { destination: string; time: string; status: string };
    nextFlight: { destination: string; time: string; status: string };
  };
}

interface DashboardGridProps {
  recentThreads: Thread[];
  metrics: {
    activeDeals: number;
    pipelineValue: string;
    newLeads: number;
    activeResearch: number;
  };
  officeData: OfficeData[];
}

export function DashboardGrid({ recentThreads, metrics, officeData }: DashboardGridProps) {
  
  // Chart Options Helpers
  const getLineChartOption = (title: string, value: number | string, data: number[], color: string): echarts.EChartsOption => ({
    title: { 
        text: title, 
        subtext: value.toString(),
        textStyle: { fontSize: 14, color: '#64748b' },
        subtextStyle: { fontSize: 24, fontWeight: 'bold' as const, color: '#0f172a' } 
    },
    tooltip: { trigger: 'axis' },
    grid: { left: 0, right: 0, top: 50, bottom: 0 },
    xAxis: { show: false, type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    yAxis: { show: false, type: 'value' },
    series: [{
        data: data,
        type: 'line',
        smooth: true,
        areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: color },
                { offset: 1, color: 'rgba(255, 255, 255, 0)' }
            ]),
            opacity: 0.2 
        },
        itemStyle: { color: color },
        lineStyle: { width: 3 }
    }]
  });

  return (
    <div className="space-y-6">
        
        {/* OFFICE WIDGETS */}
        <OfficeWidgets data={officeData} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        
        {/* METRIC 1: ACTIVE DEALS */}
        <Card>
            <CardContent className="pt-6">
                <EChart 
                    height="120px"
                    options={getLineChartOption("Deals Actifs", metrics.activeDeals, [5, 8, 9, 10, 12, 11, metrics.activeDeals], "#3b82f6")}
                />
            </CardContent>
        </Card>

        {/* METRIC 2: PIPELINE VALUE */}
        <Card>
            <CardContent className="pt-6">
                <EChart 
                    height="120px"
                    options={getLineChartOption("Pipeline", metrics.pipelineValue, [18, 20, 21, 22, 23, 24, parseFloat(metrics.pipelineValue.replace(/[^0-9.]/g, ''))], "#f59e0b")}
                />
            </CardContent>
        </Card>

        {/* METRIC 3: NEW LEADS */}
        <Card>
            <CardContent className="pt-6">
                <EChart 
                    height="120px"
                    options={getLineChartOption("Nouveaux Leads", metrics.newLeads, [100, 200, 150, 300, 250, 400, metrics.newLeads], "#10b981")}
                />
            </CardContent>
        </Card>

        {/* METRIC 4: ACTIVE RESEARCH */}
        <Card>
            <CardContent className="pt-6">
                <EChart 
                    height="120px"
                    options={getLineChartOption("Recherches", metrics.activeResearch, [1, 1, 2, 2, 3, 2, metrics.activeResearch], "#8b5cf6")}
                />
            </CardContent>
        </Card>

        {/* WIDGET: QUICK ACTIONS */}
        <Card className="col-span-1 md:col-span-2 xl:col-span-1 border border-stroke dark:border-strokedark">
            <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>Tâches fréquentes</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
            <Button variant="outline" className="w-full justify-start border-stroke dark:border-strokedark hover:bg-primary/5 hover:text-primary transition-all" asChild>
                <Link href="/admin/deals">
                    <Plus className="mr-2 h-4 w-4" /> Nouvelle Transaction
                </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start border-stroke dark:border-strokedark hover:bg-primary/5 hover:text-primary transition-all" asChild>
                <Link href="/admin/crm">
                    <UserPlus className="mr-2 h-4 w-4" /> Ajouter Contact
                </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start border-stroke dark:border-strokedark hover:bg-primary/5 hover:text-primary transition-all" asChild>
                <Link href="/admin/research">
                    <Search className="mr-2 h-4 w-4" /> Lancer Recherche
                </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start border-stroke dark:border-strokedark hover:bg-primary/5 hover:text-primary transition-all" asChild>
                <Link href="/admin/whiteboard">
                    <FileText className="mr-2 h-4 w-4" /> Nouvelle Note
                </Link>
            </Button>
            </CardContent>
        </Card>

        {/* WIDGET: RECENT DISCUSSIONS */}
        <Card className="col-span-1 md:col-span-2 xl:col-span-3 border border-stroke dark:border-strokedark">
            <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Discussions Récentes</CardTitle>
                <CardDescription>Derniers échanges sur le forum interne</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-primary hover:bg-primary/5">
                <Link href="/admin/forum" className="flex items-center gap-1">
                    Tout voir <ArrowUpRight className="w-4 h-4" />
                </Link>
            </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentThreads.length === 0 ? (
                        <p className="text-sm text-bodydark2 text-center py-4 italic">Aucune discussion récente.</p>
                    ) : (
                        recentThreads.map((thread) => (
                            <Link 
                                key={thread.id} 
                                href={`/admin/forum/thread/${thread.id}`}
                                className="flex items-center justify-between border-b border-stroke dark:border-strokedark pb-3 last:border-0 last:pb-0 hover:bg-gray-50 dark:hover:bg-meta-4/10 px-2 -mx-2 rounded transition-colors group"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-black dark:text-white truncate">
                                            {thread.title}
                                        </p>
                                        <p className="text-xs text-bodydark2 flex items-center gap-1">
                                            <span className="font-bold text-primary uppercase text-[9px] tracking-wider">{thread.categoryName}</span>
                                            <span>•</span>
                                            <span>Par {thread.authorName}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-xs text-bodydark2 shrink-0 flex items-center gap-1 ml-4 italic font-medium">
                                    <Clock className="w-3 h-3" />
                                    {formatDistanceToNow(new Date(thread.lastPostAt || new Date()), { addSuffix: true, locale: fr })}
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
        
        </div>
    </div>
  );
}