"use client";

import { useState } from "react";
import { Plus, Calendar, User, MoreVertical, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { PROJECT_STATUSES } from "@/lib/db/schema";
import { updateProjectStatus, createProject } from "@/lib/actions/projects";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function ProjectKanban({ initialProjects }: { initialProjects: any[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { success, error: errorToast } = useToast();

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    const res = await updateProjectStatus(id, newStatus);
    if (res.success) {
      setProjects(projects.map(p => p.id === id ? { ...p, status: newStatus } : p));
      success("Statut mis à jour");
    } else {
      errorToast("Erreur de mise à jour");
    }
    setLoadingId(null);
  };

  const handleCreate = async () => {
    const title = prompt("Nom de l'opération :");
    if (!title) return;
    const res = await createProject(title);
    if (res.success && res.data) {
        setProjects([{ ...res.data, clientName: "Nouveau" }, ...projects]);
        success("Opération créée");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleCreate} className="btn-gold">
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Dossier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PROJECT_STATUSES.map((status) => {
          const statusProjects = projects.filter((p) => p.status === status);
          
          return (
            <div key={status} className="flex flex-col gap-4 bg-gray-50/50 dark:bg-meta-4/10 p-4 rounded-xl border border-stroke dark:border-strokedark min-h-[500px]">
              <div className="flex items-center justify-between mb-2">
                 <h4 className="text-sm font-bold uppercase tracking-wider text-bodydark2">
                    {status}
                 </h4>
                 <span className="inline-flex rounded-full bg-white dark:bg-boxdark py-0.5 px-2 text-xs font-bold border border-stroke dark:border-strokedark">
                    {statusProjects.length}
                 </span>
              </div>

              <div className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                    {statusProjects.map((project) => (
                        <motion.div
                            key={project.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="rounded-xl border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark hover:border-primary transition-all group relative">
                                {loadingId === project.id && (
                                    <div className="absolute inset-0 bg-white/50 dark:bg-black/50 z-10 flex items-center justify-center rounded-xl">
                                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                    </div>
                                )}
                                <div className="flex items-start justify-between mb-3">
                                    <Link href={`/admin/projects/${project.id}`} className="font-semibold text-black dark:text-white hover:text-primary transition-colors line-clamp-2 pr-6">
                                        {project.title}
                                    </Link>
                                    <div className="absolute right-2 top-2">
                                        <MoreVertical className="w-4 h-4 text-bodydark2" />
                                    </div>
                                </div>

                                <div className="space-y-2 text-xs text-bodydark2">
                                    <div className="flex items-center gap-2">
                                        <User className="w-3 h-3" />
                                        <span className="truncate">{project.clientName || "Client inconnu"}</span>
                                    </div>
                                    {project.targetCloseDate && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            <span>Closing: {new Date(project.targetCloseDate).toLocaleDateString("fr-FR")}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-3 border-t border-stroke dark:border-strokedark flex items-center justify-between">
                                    <select 
                                        value={status}
                                        onChange={(e) => handleStatusChange(project.id, e.target.value)}
                                        className="text-[10px] font-bold uppercase bg-gray-100 dark:bg-meta-4 border-0 rounded px-2 py-1 outline-none cursor-pointer hover:bg-primary/10 transition-colors"
                                    >
                                        {PROJECT_STATUSES.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FileText className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {statusProjects.length === 0 && (
                  <div className="rounded-xl border border-dashed border-stroke py-8 text-center opacity-40">
                    <p className="text-xs font-medium">Glisser-déposer ici</p>
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
