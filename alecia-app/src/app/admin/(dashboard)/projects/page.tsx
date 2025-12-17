"use client";

import { Button } from "@/components/ui/button"; // Keeping some shadcn as helpers for now or adapt if needed
import Breadcrumb from "@/components/admin/ui/Breadcrumb";
import { Plus, Calendar, User, MoreVertical, FileText } from "lucide-react";
import Link from "next/link";
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
    <>
      <Breadcrumb pageName="Projects" />

      <div className="flex items-center justify-end mb-6">
        <button className="flex items-center gap-2 rounded bg-primary py-2 px-4.5 font-medium text-white hover:bg-opacity-90">
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeStatuses.map((status) => {
          const statusProjects = mockProjects.filter((p) => p.status === status);
          
          return (
            <div key={status} className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                 <h4 className="text-xl font-bold text-black dark:text-white capitalize">
                    {status}
                 </h4>
                 <span className="inline-flex rounded-full bg-gray-2 py-1 px-3 text-sm font-medium dark:bg-meta-4">
                    {statusProjects.length}
                 </span>
              </div>

              <div className="flex flex-col gap-4">
                {statusProjects.map((project, idx) => (
                    <Link href={`/admin/projects/${project.id}`} key={project.id}>
                      <div className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark hover:border-primary dark:hover:border-primary transition-colors cursor-pointer group">
                        <div className="flex items-start justify-between mb-4">
                            <h5 className="font-semibold text-black dark:text-white group-hover:text-primary transition-colors">
                                {project.title}
                            </h5>
                            <button className="text-bodydark2 hover:text-primary">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-2 text-sm text-bodydark2">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {project.clientName}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Closing: {new Date(project.targetCloseDate).toLocaleDateString("fr-FR")}
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-stroke dark:border-strokedark flex gap-2">
                             <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                                 <FileText className="w-3 h-3" />
                                 Teaser PDF
                             </button>
                        </div>
                      </div>
                    </Link>
                ))}

                {statusProjects.length === 0 && (
                  <div className="rounded-sm border border-dashed border-stroke bg-gray p-5 text-center dark:border-strokedark dark:bg-meta-4">
                    <p className="text-sm text-bodydark2">No projects</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
