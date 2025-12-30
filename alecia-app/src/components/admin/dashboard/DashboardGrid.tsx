"use client";

import React, { useState } from "react";
import * as echarts from "echarts";
import { 
  Plus, 
  Search, 
  UserPlus, 
  FileText, 
  ArrowUpRight,
  MessageSquare,
  Clock,
  Settings2
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
import { OfficeWidgets, OfficeData } from "@/components/admin/dashboard/OfficeWidgets";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Thread {
  id: string;
  title: string;
  categoryName: string | null;
  authorName: string | null;
  lastPostAt: string | Date | null;
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

interface ChartSettings {
    type: "line" | "bar" | "pie";
    color: string;
    source: "internal" | "google" | "microsoft";
}

const ChartConfigDialog = ({ 
    id, 
    title, 
    settings, 
    updateSetting 
}: { 
    id: string, 
    title: string, 
    settings: Record<string, ChartSettings>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateSetting: (id: string, key: keyof ChartSettings, value: any) => void
}) => (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Settings2 className="w-4 h-4 text-muted-foreground" />
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader><DialogTitle>Configurer {title}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label>Type de graphique</Label>
                    <Select value={settings[id].type} onValueChange={(v) => updateSetting(id, 'type', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="line">Ligne</SelectItem>
                            <SelectItem value="bar">Barres</SelectItem>
                            <SelectItem value="pie">Camembert</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Source de données</Label>
                    <Select value={settings[id].source} onValueChange={(v) => updateSetting(id, 'source', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="internal">Interne (DB)</SelectItem>
                            <SelectItem value="google">Google Sheets (OAuth)</SelectItem>
                            <SelectItem value="microsoft">Microsoft Excel (OAuth)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Couleur</Label>
                    <div className="flex gap-2">
                        <Input type="color" value={settings[id].color} onChange={(e) => updateSetting(id, 'color', e.target.value)} className="w-12 p-1 border-none" />
                        <Input value={settings[id].color} onChange={(e) => updateSetting(id, 'color', e.target.value)} className="flex-1" />
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline">Annuler</Button>
                <Button>Sauvegarder</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

export function DashboardGrid({ recentThreads, metrics, officeData }: DashboardGridProps) {
  
  const [settings, setSettings] = useState<Record<string, ChartSettings>>({
    deals: { type: "line", color: "#3b82f6", source: "internal" },
    pipeline: { type: "line", color: "#f59e0b", source: "internal" },
    leads: { type: "line", color: "#10b981", source: "internal" },
    research: { type: "line", color: "#8b5cf6", source: "internal" }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateSetting = (id: string, key: keyof ChartSettings, value: any) => {
    setSettings(prev => ({
        ...prev,
        [id]: { ...prev[id], [key]: value }
    }));
  };

  // Chart Options Helpers
  const getChartOption = (id: string, title: string, value: number | string, data: number[]): echarts.EChartsOption => {
    const config = settings[id];
    
    if (config.type === 'pie') {
        return {
            title: { text: title, subtext: value.toString(), textStyle: { fontSize: 14 }, subtextStyle: { fontSize: 20, fontWeight: 'bold' } },
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                data: data.map((v, i) => ({ value: v, name: `Day ${i+1}` })),
                color: [config.color, '#e2e8f0', '#cbd5e1']
            }]
        };
    }

    return {
        title: { 
            text: title, 
            subtext: value.toString(),
            textStyle: { fontSize: 14, color: '#64748b' },
            subtextStyle: { fontSize: 24, fontWeight: 'bold' as const, color: '#0f172a' } 
        },
        tooltip: { trigger: 'axis' },
        grid: { left: 0, right: 0, top: 50, bottom: 0 },
        xAxis: { show: false, type: 'category' },
        yAxis: { show: false, type: 'value' },
        series: [{
            data: data,
            type: config.type,
            smooth: true,
            areaStyle: config.type === 'line' ? {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: config.color },
                    { offset: 1, color: 'rgba(255, 255, 255, 0)' }
                ]),
                opacity: 0.2 
            } : undefined,
            itemStyle: { color: config.color },
            lineStyle: { width: 3 }
        }]
    };
  };

  return (
    <div className="space-y-6">
        
        {/* OFFICE WIDGETS */}
        <OfficeWidgets data={officeData} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        
        {/* METRIC 1: ACTIVE DEALS */}
        <Card className="group relative">
            <ChartConfigDialog id="deals" title="Deals Actifs" settings={settings} updateSetting={updateSetting} />
            <CardContent className="pt-6">
                <EChart 
                    height="120px"
                    options={getChartOption("deals", "Deals Actifs", metrics.activeDeals, [5, 8, 9, 10, 12, 11, metrics.activeDeals])}
                />
            </CardContent>
        </Card>

        {/* METRIC 2: PIPELINE VALUE */}
        <Card className="group relative">
            <ChartConfigDialog id="pipeline" title="Pipeline" settings={settings} updateSetting={updateSetting} />
            <CardContent className="pt-6">
                <EChart 
                    height="120px"
                    options={getChartOption("pipeline", "Pipeline", metrics.pipelineValue, [18, 20, 21, 22, 23, 24, parseFloat(metrics.pipelineValue.replace(/[^0-9.]/g, ''))])}
                />
            </CardContent>
        </Card>

        {/* METRIC 3: NEW LEADS */}
        <Card className="group relative">
            <ChartConfigDialog id="leads" title="Nouveaux Leads" settings={settings} updateSetting={updateSetting} />
            <CardContent className="pt-6">
                <EChart 
                    height="120px"
                    options={getChartOption("leads", "Nouveaux Leads", metrics.newLeads, [100, 200, 150, 300, 250, 400, metrics.newLeads])}
                />
            </CardContent>
        </Card>

        {/* METRIC 4: ACTIVE RESEARCH */}
        <Card className="group relative">
            <ChartConfigDialog id="research" title="Recherches" settings={settings} updateSetting={updateSetting} />
            <CardContent className="pt-6">
                <EChart 
                    height="120px"
                    options={getChartOption("research", "Recherches", metrics.activeResearch, [1, 1, 2, 2, 3, 2, metrics.activeResearch])}
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
