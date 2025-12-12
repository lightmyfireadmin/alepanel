"use client";

import { motion } from "framer-motion";
import { Calendar, FileText, Users, Flag, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface TimelineEvent {
  id: string;
  type: "Meeting" | "Document" | "Milestone" | "Note";
  date: string;
  description: string;
  fileUrl?: string;
}

interface ProjectTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const eventTypeConfig = {
  Meeting: {
    icon: Users,
    color: "bg-blue-500",
    lightColor: "bg-blue-500/20 text-blue-400",
  },
  Document: {
    icon: FileText,
    color: "bg-amber-500",
    lightColor: "bg-amber-500/20 text-amber-400",
  },
  Milestone: {
    icon: Flag,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-500/20 text-emerald-400",
  },
  Note: {
    icon: Calendar,
    color: "bg-purple-500",
    lightColor: "bg-purple-500/20 text-purple-400",
  },
};

// Mock data for demonstration
const MOCK_EVENTS: TimelineEvent[] = [
  { id: "1", type: "Milestone", date: "2025-01-15", description: "Signature du mandat de cession" },
  { id: "2", type: "Meeting", date: "2025-01-20", description: "Réunion stratégique avec le client" },
  { id: "3", type: "Document", date: "2025-01-25", description: "Teaser envoyé à 15 prospects", fileUrl: "/docs/teaser.pdf" },
  { id: "4", type: "Meeting", date: "2025-02-01", description: "Premiers rendez-vous acquéreurs" },
  { id: "5", type: "Document", date: "2025-02-10", description: "LOI reçue de Cap Invest", fileUrl: "/docs/loi.pdf" },
  { id: "6", type: "Note", date: "2025-02-12", description: "Négociation prix en cours" },
  { id: "7", type: "Milestone", date: "2025-02-20", description: "Due diligence démarrée" },
];

export function ProjectTimeline({ events = MOCK_EVENTS, className }: ProjectTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Vertical Line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--accent)] via-[var(--border)] to-transparent" />

      {/* Events */}
      <div className="space-y-4">
        {sortedEvents.map((event, idx) => {
          const config = eventTypeConfig[event.type];
          const Icon = config.icon;
          const isExpanded = expandedId === event.id;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative pl-12"
            >
              {/* Icon Node */}
              <motion.div
                className={`absolute left-2 w-7 h-7 rounded-full ${config.color} flex items-center justify-center shadow-lg`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-3.5 h-3.5 text-white" />
              </motion.div>

              {/* Event Card */}
              <motion.div
                layout
                className={`p-4 rounded-lg bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors cursor-pointer ${
                  isExpanded ? "border-[var(--accent)]" : ""
                }`}
                onClick={() => setExpandedId(isExpanded ? null : event.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Date & Type */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-[var(--foreground-muted)]">
                        {formatDate(event.date)}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.lightColor}`}>
                        {event.type}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-[var(--foreground)] font-medium">
                      {event.description}
                    </p>
                  </div>

                  {/* Expand Toggle */}
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="p-1 rounded-full hover:bg-[var(--background-tertiary)]"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[var(--foreground-muted)]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[var(--foreground-muted)]" />
                    )}
                  </motion.div>
                </div>

                {/* Expanded Content */}
                <motion.div
                  initial={false}
                  animate={{
                    height: isExpanded ? "auto" : 0,
                    opacity: isExpanded ? 1 : 0,
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 mt-3 border-t border-[var(--border)]">
                    {event.fileUrl && (
                      <a
                        href={event.fileUrl}
                        className="inline-flex items-center gap-2 text-sm text-[var(--accent)] hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FileText className="w-4 h-4" />
                        Voir le document
                      </a>
                    )}
                    <p className="text-sm text-[var(--foreground-muted)] mt-2">
                      Ajouté le {formatDate(event.date)} à 14:30
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Start Indicator */}
      <div className="relative pl-12 pt-4">
        <div className="absolute left-3 w-5 h-5 rounded-full bg-[var(--background-tertiary)] border-2 border-[var(--border)] flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[var(--foreground-muted)]" />
        </div>
        <p className="text-sm text-[var(--foreground-muted)]">Début du projet</p>
      </div>
    </div>
  );
}
