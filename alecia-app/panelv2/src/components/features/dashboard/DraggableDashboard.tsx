"use client";

import { useState, useEffect } from "react";
import * as ReactGridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, TrendingUp, Users, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { VoiceNoteRecorder } from "@/components/features/productivity/VoiceNoteRecorder";
import { Whiteboard } from "@/components/features/productivity/Whiteboard";

// Make grid responsive
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Responsive = (ReactGridLayout as any).Responsive || (ReactGridLayout as any).default?.Responsive;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WidthProvider = (ReactGridLayout as any).WidthProvider || (ReactGridLayout as any).default?.WidthProvider;

const ResponsiveGridLayout = WidthProvider(Responsive);

// Widget Registry (Reserved for future "Add Widget" feature)
// const WIDGETS = { ... }

interface DashboardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialLayout?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLayoutChange?: (layout: any) => void;
}

export function DraggableDashboard({ initialLayout, onLayoutChange }: DashboardProps) {
  // Default layout if none provided
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

  // Fix hydration mismatch for grid layout
  useEffect(() => {
      setMounted(true);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLayoutChange = (newLayout: any) => {
    setLayout(newLayout);
    if (onLayoutChange) onLayoutChange(newLayout);
  };

  const renderWidget = (key: string) => {
    switch (key) {
      case "stats":
        return <StatsWidget />;
      case "deals":
        return <RecentDealsWidget />;
      case "activity":
        return <ActivityFeedWidget />;
      case "chart":
        return <ChartWidget />;
      case "voice":
        return <VoiceNoteRecorder />;
      case "whiteboard":
        return <Whiteboard />;
      default:
        return <div>Unknown Widget</div>;
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(!isEditing)}
            className={cn(isEditing && "bg-accent text-accent-foreground")}
        >
            {isEditing ? "Save Layout" : "Customize Dashboard"}
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
        onLayoutChange={(currentLayout) => handleLayoutChange(currentLayout)}
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

// --- Dummy Widgets for now (Replace with real ones later) ---

function StatsWidget() {
    return (
        <CardContent className="p-6 h-full flex items-center justify-between gap-4">
            <div className="flex-1">
                <p className="text-sm text-muted-foreground">Active Deals</p>
                <div className="text-3xl font-bold flex items-center gap-2">
                    12 <Briefcase className="w-5 h-5 text-blue-500" />
                </div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="flex-1">
                <p className="text-sm text-muted-foreground">Pipeline Value</p>
                <div className="text-3xl font-bold flex items-center gap-2">
                    €42M <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="flex-1">
                <p className="text-sm text-muted-foreground">Team</p>
                <div className="text-3xl font-bold flex items-center gap-2">
                    8 <Users className="w-5 h-5 text-purple-500" />
                </div>
            </div>
        </CardContent>
    )
}

function RecentDealsWidget() {
    return (
        <>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Recent Deals</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="divide-y">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="p-3 flex justify-between items-center text-sm">
                            <span>Project Alpha</span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">NDA</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </>
    )
}

function ActivityFeedWidget() {
    return (
        <>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 mt-2">
                    <div className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Christophe</span> updated Project Beta
                        <div className="text-xs opacity-70">2h ago</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Micou</span> added a file
                        <div className="text-xs opacity-70">5h ago</div>
                    </div>
                </div>
            </CardContent>
        </>
    )
}

function ChartWidget() {
    return (
        <>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Performance</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full pb-10">
                <div className="text-muted-foreground text-sm italic">Chart Placeholder</div>
            </CardContent>
        </>
    )
}
