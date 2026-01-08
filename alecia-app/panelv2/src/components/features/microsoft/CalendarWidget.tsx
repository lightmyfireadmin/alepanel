"use client";

import { useState, useEffect } from "react";
import { useMicrosoftCalendar, CalendarEvent } from "@/hooks/use-microsoft-calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  Video, 
  MapPin, 
  Clock, 
  Users, 
  ExternalLink,
  RefreshCw,
  AlertCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO, isToday, isTomorrow, differenceInMinutes } from "date-fns";
import { fr } from "date-fns/locale";

interface CalendarWidgetProps {
  className?: string;
  daysAhead?: number;
  maxEvents?: number;
  onEventClick?: (event: CalendarEvent) => void;
}

export function CalendarWidget({
  className,
  daysAhead = 14,
  maxEvents = 10,
  onEventClick,
}: CalendarWidgetProps) {
  const { getUpcomingEvents, loading, error } = useMicrosoftCalendar();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadEvents = async () => {
    setIsRefreshing(true);
    const data = await getUpcomingEvents(daysAhead);
    setEvents(data.slice(0, maxEvents));
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadEvents();
  }, [daysAhead, maxEvents]);

  const formatEventTime = (event: CalendarEvent) => {
    const start = parseISO(event.start);
    const end = parseISO(event.end);
    const duration = differenceInMinutes(end, start);
    
    let datePrefix = "";
    if (isToday(start)) {
      datePrefix = "Aujourd'hui";
    } else if (isTomorrow(start)) {
      datePrefix = "Demain";
    } else {
      datePrefix = format(start, "EEEE d MMM", { locale: fr });
    }

    return {
      date: datePrefix,
      time: format(start, "HH:mm"),
      duration: duration >= 60 ? `${Math.floor(duration / 60)}h${duration % 60 > 0 ? duration % 60 : ""}` : `${duration}min`,
    };
  };

  if (loading && events.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Agenda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-12 w-12 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Agenda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span>Connectez-vous avec Microsoft pour voir votre agenda</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Agenda
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={loadEvents}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
          </Button>
        </div>
        <CardDescription>
          {events.length} événement{events.length !== 1 ? "s" : ""} à venir
        </CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            Aucun événement prévu
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-3">
            <div className="space-y-3">
              {events.map((event) => {
                const { date, time, duration } = formatEventTime(event);
                
                return (
                  <div
                    key={event.id}
                    className={cn(
                      "flex gap-3 p-2 rounded-lg border bg-card hover:bg-muted/50 transition-colors",
                      onEventClick && "cursor-pointer"
                    )}
                    onClick={() => onEventClick?.(event)}
                  >
                    {/* Time block */}
                    <div className="flex-shrink-0 w-14 text-center bg-muted/50 rounded p-1.5">
                      <div className="text-xs text-muted-foreground">{date}</div>
                      <div className="text-sm font-semibold">{time}</div>
                    </div>

                    {/* Event details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm truncate">{event.subject}</h4>
                        {event.isOnlineMeeting && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 flex-shrink-0">
                            <Video className="h-3 w-3 mr-1" />
                            Teams
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {duration}
                        </span>
                        
                        {event.location && (
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </span>
                        )}
                        
                        {event.attendees.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.attendees.length}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Join meeting button */}
                    {event.onlineMeetingUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(event.onlineMeetingUrl, "_blank");
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
