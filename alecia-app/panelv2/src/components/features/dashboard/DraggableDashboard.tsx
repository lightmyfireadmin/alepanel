"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import dynamic from "next/dynamic";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, TrendingUp, Users, GripVertical, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { VoiceNoteRecorder } from "@/components/features/productivity/VoiceNoteRecorder";
import { Whiteboard } from "@/components/features/productivity/Whiteboard";

// Import react-grid-layout dynamically to avoid SSR issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ResponsiveGridLayout: any = null;
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RGL = require("react-grid-layout");
  const WidthProvider = RGL.WidthProvider;
  const Responsive = RGL.Responsive;
  if (WidthProvider && Responsive) {
    ResponsiveGridLayout = WidthProvider(Responsive);
  }
}

interface DashboardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialLayout?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLayoutChange?: (layout: any) => void;
}

export function DraggableDashboard({ initialLayout, onLayoutChange }: DashboardProps) {
  const stats = useQuery(api.dashboard.getDashboardStats);

  const defaultLayout = [
    { i: "stats", x: 0, y: 0, w: 12, h: 2 },
    { i: "deals", x: 0, y: 2, w: 6, h: 6 },
    { i: "activity", x: 6, y: 2, w: 3, h: 6 },
    { i: "voice", x: 9, y: 2, w: 3, h: 6 },
    { i: "whiteboard", x: 0, y: 8, w: 12, h: 10 },
  ];

  const [layout, setLayout] = useState(initialLayout || defaultLayout);
  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLayoutChange = (newLayout: any) => {
    setLayout(newLayout);
    if (onLayoutChange) onLayoutChange(newLayout);
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `€${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `€${(amount / 1000).toFixed(0)}k`;
    return `€${amount}`;
  };

  const renderWidget = (key: string) => {
    switch (key) {
      case "stats":
        return (
          <CardContent className="p-6 h-full flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Dossiers actifs</p>
              <div className="text-3xl font-bold flex items-center gap-2">
                {stats?.activeDeals ?? "-"} <Briefcase className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Valeur pipeline</p>
              <div className="text-3xl font-bold flex items-center gap-2">
                {stats?.pipelineValue ? formatAmount(stats.pipelineValue) : "-"} <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Équipe</p>
              <div className="text-3xl font-bold flex items-center gap-2">
                {stats?.teamSize ?? "-"} <Users className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Sociétés</p>
              <div className="text-3xl font-bold flex items-center gap-2">
                {stats?.companiesCount ?? "-"} <Building2 className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        );
      case "deals":
        return (
          <>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Dossiers récents</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {stats?.recentDeals?.length ? (
                  stats.recentDeals.map((deal: { id: string; title: string; stage: string }) => (
                    <div key={deal.id} className="p-3 flex justify-between items-center text-sm">
                      <span className="font-medium">{deal.title}</span>
                      <Badge variant="secondary" className="text-xs">{deal.stage}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    Aucun dossier
                  </div>
                )}
              </div>
            </CardContent>
          </>
        );
      case "activity":
        return (
          <>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Pipeline par étape</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mt-2">
                {stats?.dealsByStage ? (
                  Object.entries(stats.dealsByStage).map(([stage, count]) => (
                    <div key={stage} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{stage}</span>
                      <Badge variant="outline">{count as number}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground italic">Chargement...</div>
                )}
              </div>
            </CardContent>
          </>
        );
      case "voice":
        return <VoiceNoteRecorder />;
      case "whiteboard":
        return <Whiteboard />;
      default:
        return <div>Widget inconnu</div>;
    }
  };

  if (!mounted) return null;

  // Don't render grid during SSR
  if (!ResponsiveGridLayout) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        Chargement du tableau de bord...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className={cn(isEditing && "bg-accent text-accent-foreground")}
        >
          {isEditing ? "Enregistrer" : "Personnaliser"}
        </Button>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        isDraggable={isEditing}
        isResizable={isEditing}
        onLayoutChange={(currentLayout: Array<{ i: string; x: number; y: number; w: number; h: number }>) => handleLayoutChange(currentLayout)}
        draggableHandle=".drag-handle"
      >
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {layout.map((item: any) => (
          <div key={item.i} className={cn("relative group", isEditing && "ring-2 ring-primary/20 rounded-xl")}>
            <Card className="h-full overflow-hidden shadow-sm hover:shadow-md transition-shadow border-muted">
              {isEditing && (
                <div className="drag-handle absolute top-2 right-2 p-1 cursor-move bg-muted rounded z-50 hover:bg-muted/80">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              {renderWidget(item.i)}
            </Card>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}

