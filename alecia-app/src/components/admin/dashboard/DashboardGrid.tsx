"use client";

import React from "react";
import { 
  Plus, 
  Search, 
  UserPlus, 
  FileText, 
  Activity,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Users,
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

interface DashboardGridProps {
  recentThreads: any[];
}

export function DashboardGrid({ recentThreads }: DashboardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      
      {/* METRIC 1: ACTIVE DEALS */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Deals Actifs</CardTitle>
          <BriefcaseIcon className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-bodydark2">
            +2 depuis le mois dernier
          </p>
        </CardContent>
      </Card>

      {/* METRIC 2: PIPELINE VALUE */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valeur du Pipeline</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€24.5M</div>
          <p className="text-xs text-bodydark2">
            +18% depuis le mois dernier
          </p>
        </CardContent>
      </Card>

      {/* METRIC 3: NEW LEADS */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nouveaux Leads</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+573</div>
          <p className="text-xs text-bodydark2">
            +201 cette semaine
          </p>
        </CardContent>
      </Card>

      {/* METRIC 4: ACTIVE RESEARCH */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Analyses en Cours</CardTitle>
          <Activity className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-bodydark2">
            Secteurs sous surveillance
          </p>
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
                                {formatDistanceToNow(new Date(thread.lastPostAt), { addSuffix: true, locale: fr })}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </CardContent>
      </Card>
      
    </div>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );
}
