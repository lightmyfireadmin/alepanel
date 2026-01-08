"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2, 
  FileText, 
  Calendar,
  ArrowRight,
  Clock,
  Target
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const stats = useQuery(api.dashboard.getDashboardStats);
  const currentUser = useQuery(api.queries.getCurrentUser);

  if (!stats) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: "Deals Actifs",
      value: stats.activeDeals || 0,
      icon: Target,
      color: "text-blue-500",
      href: "/admin/deals",
    },
    {
      title: "Valeur Pipeline",
      value: stats.pipelineValue 
        ? `${(stats.pipelineValue / 1000000).toFixed(1)}M€` 
        : "0€",
      icon: TrendingUp,
      color: "text-green-500",
      href: "/admin/deals",
    },
    {
      title: "Entreprises",
      value: stats.companiesCount || 0,
      icon: Building2,
      color: "text-purple-500",
      href: "/admin/crm/companies",
    },
    {
      title: "Équipe",
      value: stats.teamSize || 0,
      icon: Users,
      color: "text-orange-500",
      href: "/admin/team",
    },
  ];

  const quickActions = [
    { label: "Pipeline Deals", href: "/admin/deals", icon: BarChart3 },
    { label: "CRM Entreprises", href: "/admin/crm/companies", icon: Building2 },
    { label: "CRM Contacts", href: "/admin/crm/contacts", icon: Users },
    { label: "Recherche", href: "/admin/research", icon: FileText },
    { label: "Signatures", href: "/admin/signatures", icon: Calendar },
    { label: "Paramètres", href: "/admin/settings", icon: Clock },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Bonjour, {currentUser?.name?.split(" ")[0] || "Conseiller"} 👋
          </h1>
          <p className="text-muted-foreground">
            Voici un aperçu de votre activité
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {currentUser?.role === "sudo" ? "Super Admin" : 
           currentUser?.role === "partner" ? "Partner" : "Conseiller"}
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Link key={kpi.title} href={kpi.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Accès Rapide</CardTitle>
            <CardDescription>Navigation vers les modules principaux</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 h-auto py-3"
                  >
                    <action.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{action.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Deals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Deals Récents</CardTitle>
              <CardDescription>Derniers dossiers en cours</CardDescription>
            </div>
            <Link href="/admin/deals">
              <Button variant="ghost" size="sm" className="gap-1">
                Voir tout <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentDeals && stats.recentDeals.length > 0 ? (
              <div className="space-y-3">
                {stats.recentDeals.map((deal: { id: string; title: string; stage: string; amount?: number }) => (
                  <div 
                    key={deal.id} 
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{deal.title}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {deal.stage}
                      </Badge>
                    </div>
                    {deal.amount && (
                      <span className="text-sm font-medium text-muted-foreground">
                        {(deal.amount / 1000).toFixed(0)}k€
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun deal récent
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Deals by Stage */}
      {stats.dealsByStage && Object.keys(stats.dealsByStage).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pipeline par Étape</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.dealsByStage).map(([stage, count]) => (
                <Badge key={stage} variant="outline" className="py-1.5 px-3">
                  {stage}: <span className="font-bold ml-1">{count as number}</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
