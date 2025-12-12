"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, User, MoreVertical, FileText } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PROJECT_STATUSES } from "@/lib/db/schema";

// Mock projects data - Replace with DB query
const mockProjects = [
  {
    id: "1",
    title: "Cession TechCorp",
    status: "Lead",
    clientName: "Jean Dupont",
    targetCloseDate: "2025-03-15",
  },
  {
    id: "2",
    title: "Acquisition MediSanté",
    status: "Due Diligence",
    clientName: "Marie Laurent",
    targetCloseDate: "2025-02-28",
  },
  {
    id: "3",
    title: "LBO Industries Nord",
    status: "Due Diligence",
    clientName: "Pierre Martin",
    targetCloseDate: "2025-04-01",
  },
  {
    id: "4",
    title: "Levée de fonds StartupAI",
    status: "Closing",
    clientName: "Sophie Bernard",
    targetCloseDate: "2025-01-31",
  },
];

const statusColors: Record<string, string> = {
  Lead: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  "Due Diligence": "bg-amber-500/10 border-amber-500/30 text-amber-400",
  Closing: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  Closed: "bg-gray-500/10 border-gray-500/30 text-gray-400",
};

export default function ProjectsPage() {
  const activeStatuses = PROJECT_STATUSES.filter((s) => s !== "Closed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] font-[family-name:var(--font-playfair)]">
            Projets
          </h1>
          <p className="text-[var(--foreground-muted)] mt-1">
            Pipeline des opérations en cours
          </p>
        </div>
        <Button className="btn-gold gap-2">
          <Plus className="w-4 h-4" />
          Nouveau projet
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeStatuses.map((status) => {
          const statusProjects = mockProjects.filter((p) => p.status === status);
          
          return (
            <div key={status} className="space-y-4">
              {/* Column Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[status]}`}
                  >
                    {status}
                  </span>
                  <span className="text-[var(--foreground-muted)] text-sm">
                    {statusProjects.length}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 min-h-[200px]">
                {statusProjects.map((project, idx) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link href={`/admin/projects/${project.id}`}>
                      <Card className="bg-[var(--card)] border-[var(--border)] hover:border-[var(--accent)] transition-colors cursor-pointer group">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-base font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                              {project.title}
                            </CardTitle>
                            <button className="p-1 rounded hover:bg-[var(--background-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="w-4 h-4 text-[var(--foreground-muted)]" />
                            </button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 text-sm text-[var(--foreground-muted)]">
                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5" />
                              <span>{project.clientName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                Closing: {new Date(project.targetCloseDate).toLocaleDateString("fr-FR")}
                              </span>
                            </div>
                          </div>
                          
                          {/* Quick Actions */}
                          <div className="mt-3 pt-3 border-t border-[var(--border)] flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs h-8 border-[var(--border)]"
                            >
                              <FileText className="w-3 h-3 mr-1" />
                              Teaser PDF
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}

                {/* Empty State */}
                {statusProjects.length === 0 && (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed border-[var(--border)] rounded-lg">
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Aucun projet
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
