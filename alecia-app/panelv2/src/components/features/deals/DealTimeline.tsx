"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  CalendarRange, 
  ChevronLeft, 
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Flag,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  format, 
  differenceInDays, 
  addDays, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  isToday,
  isSameDay
} from "date-fns";
import { fr } from "date-fns/locale";

export interface DealMilestone {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: "pending" | "in_progress" | "completed" | "delayed";
  type: "phase" | "milestone" | "deadline";
  progress?: number; // 0-100
  dependencies?: string[]; // IDs of dependent milestones
}

interface DealTimelineProps {
  dealName: string;
  milestones: DealMilestone[];
  className?: string;
  onMilestoneClick?: (milestone: DealMilestone) => void;
}

const COLORS = {
  pending: "bg-gray-300 dark:bg-gray-600",
  in_progress: "bg-blue-500",
  completed: "bg-green-500",
  delayed: "bg-red-500",
};

const DAY_WIDTH = 40; // pixels per day

/**
 * Deal Timeline Component
 * Gantt-style visualization of deal milestones and phases
 */
export function DealTimeline({
  dealName,
  milestones,
  className,
  onMilestoneClick,
}: DealTimelineProps) {
  const [zoom, setZoom] = useState(1);

  // Calculate date range
  const { startDate, endDate, totalDays } = useMemo(() => {
    if (milestones.length === 0) {
      const today = new Date();
      return {
        startDate: startOfWeek(today),
        endDate: addDays(today, 90),
        totalDays: 90,
      };
    }

    let minDate = milestones[0].startDate;
    let maxDate = milestones[0].endDate;

    milestones.forEach(m => {
      if (m.startDate < minDate) minDate = m.startDate;
      if (m.endDate > maxDate) maxDate = m.endDate;
    });

    // Add padding
    const start = addDays(startOfWeek(minDate), -7);
    const end = addDays(endOfWeek(maxDate), 14);

    return {
      startDate: start,
      endDate: end,
      totalDays: differenceInDays(end, start),
    };
  }, [milestones]);

  // Generate day columns
  const days = useMemo(() => 
    eachDayOfInterval({ start: startDate, end: endDate }),
    [startDate, endDate]
  );

  // Group by weeks for header
  const weeks = useMemo(() => {
    const weekMap: { start: Date; days: Date[] }[] = [];
    let currentWeek: Date[] = [];
    let weekStart = days[0];

    days.forEach((day, i) => {
      currentWeek.push(day);
      if (day.getDay() === 0 || i === days.length - 1) {
        weekMap.push({ start: weekStart, days: [...currentWeek] });
        currentWeek = [];
        if (i < days.length - 1) weekStart = days[i + 1];
      }
    });

    return weekMap;
  }, [days]);

  const getBarPosition = (milestone: DealMilestone) => {
    const startOffset = differenceInDays(milestone.startDate, startDate);
    const duration = differenceInDays(milestone.endDate, milestone.startDate) + 1;
    return {
      left: startOffset * DAY_WIDTH * zoom,
      width: Math.max(duration * DAY_WIDTH * zoom, 20),
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "delayed": return <AlertCircle className="h-3 w-3 text-red-500" />;
      default: return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarRange className="h-4 w-4" />
              Timeline
            </CardTitle>
            <CardDescription>
              {dealName} • {milestones.length} étapes
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom(z => Math.min(2, z + 0.25))}
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {milestones.length === 0 ? (
          <div className="text-center py-8">
            <CalendarRange className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">
              Aucune étape définie pour ce dossier
            </p>
          </div>
        ) : (
          <ScrollArea className="w-full">
            <div style={{ minWidth: totalDays * DAY_WIDTH * zoom + 200 }}>
              {/* Week Headers */}
              <div className="flex border-b">
                <div className="w-48 flex-shrink-0 p-2 text-xs font-medium text-muted-foreground border-r">
                  Étape
                </div>
                <div className="flex">
                  {weeks.map((week, i) => (
                    <div
                      key={i}
                      className="text-center text-xs font-medium text-muted-foreground border-r"
                      style={{ width: week.days.length * DAY_WIDTH * zoom }}
                    >
                      {format(week.start, "d MMM", { locale: fr })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Day Headers */}
              <div className="flex border-b bg-muted/30">
                <div className="w-48 flex-shrink-0 border-r" />
                <div className="flex">
                  {days.map((day, i) => (
                    <div
                      key={i}
                      className={cn(
                        "text-center text-[10px] border-r",
                        isToday(day) && "bg-primary/10 font-bold",
                        day.getDay() === 0 && "bg-muted/50"
                      )}
                      style={{ width: DAY_WIDTH * zoom }}
                    >
                      {format(day, "d")}
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone Rows */}
              {milestones.map((milestone) => {
                const { left, width } = getBarPosition(milestone);

                return (
                  <div
                    key={milestone.id}
                    className="flex border-b hover:bg-muted/30 transition-colors"
                  >
                    {/* Milestone Name */}
                    <div className="w-48 flex-shrink-0 p-2 border-r">
                      <div className="flex items-center gap-2">
                        {milestone.type === "deadline" && (
                          <Flag className="h-3 w-3 text-red-500" />
                        )}
                        <span className="text-sm font-medium truncate">
                          {milestone.name}
                        </span>
                        {getStatusIcon(milestone.status)}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {format(milestone.startDate, "d MMM", { locale: fr })} - {format(milestone.endDate, "d MMM", { locale: fr })}
                      </div>
                    </div>

                    {/* Timeline Bar */}
                    <div className="relative flex-1 h-14">
                      {/* Today line */}
                      {days.some(d => isToday(d)) && (
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                          style={{
                            left: differenceInDays(new Date(), startDate) * DAY_WIDTH * zoom,
                          }}
                        />
                      )}

                      {/* Bar */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "absolute top-3 h-8 rounded cursor-pointer transition-all hover:opacity-80",
                                COLORS[milestone.status]
                              )}
                              style={{ left, width }}
                              onClick={() => onMilestoneClick?.(milestone)}
                            >
                              {/* Progress overlay */}
                              {milestone.progress !== undefined && milestone.progress < 100 && (
                                <div
                                  className="absolute inset-0 bg-black/20 rounded-r"
                                  style={{ left: `${milestone.progress}%` }}
                                />
                              )}
                              
                              {/* Label inside bar */}
                              {width > 60 && (
                                <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-medium truncate px-1">
                                  {milestone.name}
                                </span>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs space-y-1">
                              <p className="font-medium">{milestone.name}</p>
                              <p>{format(milestone.startDate, "d MMM yyyy")} → {format(milestone.endDate, "d MMM yyyy")}</p>
                              <p>Durée: {differenceInDays(milestone.endDate, milestone.startDate) + 1} jours</p>
                              {milestone.progress !== undefined && (
                                <p>Progression: {milestone.progress}%</p>
                              )}
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "text-[10px]",
                                  milestone.status === "completed" && "text-green-600",
                                  milestone.status === "delayed" && "text-red-600"
                                )}
                              >
                                {milestone.status}
                              </Badge>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}

        {/* Legend */}
        {milestones.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-gray-300" />
              En attente
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-blue-500" />
              En cours
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-500" />
              Terminé
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500" />
              Retard
            </span>
            <span className="flex items-center gap-1">
              <span className="w-0.5 h-3 bg-red-500" />
              Aujourd'hui
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Example data
export const exampleTimelineData: DealMilestone[] = [
  {
    id: "1",
    name: "Origination",
    startDate: new Date(2026, 0, 1),
    endDate: new Date(2026, 0, 15),
    status: "completed",
    type: "phase",
    progress: 100,
  },
  {
    id: "2",
    name: "NDA & Teaser",
    startDate: new Date(2026, 0, 10),
    endDate: new Date(2026, 0, 25),
    status: "completed",
    type: "phase",
    progress: 100,
  },
  {
    id: "3",
    name: "Due Diligence",
    startDate: new Date(2026, 0, 20),
    endDate: new Date(2026, 1, 28),
    status: "in_progress",
    type: "phase",
    progress: 45,
  },
  {
    id: "4",
    name: "LOI Deadline",
    startDate: new Date(2026, 1, 15),
    endDate: new Date(2026, 1, 15),
    status: "pending",
    type: "deadline",
  },
  {
    id: "5",
    name: "Négociation SPA",
    startDate: new Date(2026, 2, 1),
    endDate: new Date(2026, 2, 31),
    status: "pending",
    type: "phase",
  },
  {
    id: "6",
    name: "Closing",
    startDate: new Date(2026, 3, 15),
    endDate: new Date(2026, 3, 15),
    status: "pending",
    type: "milestone",
  },
];
