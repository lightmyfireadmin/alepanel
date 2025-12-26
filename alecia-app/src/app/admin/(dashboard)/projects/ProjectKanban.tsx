"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Calendar, User, MoreVertical, FileText, Loader2, Trash2, Settings2 } from "lucide-react";
import Link from "next/link";
import { getBoards, getBoardWithColumns, createBoard, deleteBoard, createColumn, deleteColumn, moveProject } from "@/lib/actions/kanban";
import { createProject } from "@/lib/actions/projects";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Board {
  id: string;
  name: string;
}

interface Column {
  id: string;
  name: string;
  boardId: string;
  order: number | null;
}

interface Project {
  id: string;
  title: string;
  clientName?: string | null;
  clientId?: string | null;
  targetCloseDate: string | Date | null;
  columnId: string | null;
  displayOrder: number | null;
}

export function ProjectKanban() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [movingId, setMovingId] = useState<string | null>(null);
  const { success } = useToast();

  const loadBoards = useCallback(async () => {
    const res = await getBoards();
    if (res.success && res.data) {
      setBoards(res.data);
      // Only set default board if none selected
      setCurrentBoardId(prev => prev || (res.data && res.data.length > 0 ? res.data[0].id : null));
    }
    setLoading(false);
  }, []);

  const loadBoardData = useCallback(async (boardId: string) => {
    const res = await getBoardWithColumns(boardId);
    if (res.success && res.data) {
      setColumns(res.data.columns);
      setProjects(res.data.projects);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => loadBoards(), 0);
  }, [loadBoards]);

  useEffect(() => {
    if (currentBoardId) {
      setTimeout(() => loadBoardData(currentBoardId), 0);
    }
  }, [currentBoardId, loadBoardData]);

  const handleCreateBoard = async () => {
    const name = prompt("Nom du nouveau tableau :");
    if (!name) return;
    const res = await createBoard(name);
    if (res.success && res.data) {
      success("Tableau créé");
      setCurrentBoardId(res.data.id);
      loadBoards();
    }
  };

  const handleDeleteBoard = async () => {
    if (!currentBoardId || !confirm("Supprimer ce tableau et tout son contenu ?")) return;
    const res = await deleteBoard(currentBoardId);
    if (res.success) {
      success("Tableau supprimé");
      setCurrentBoardId(null);
      loadBoards();
    }
  };

  const handleAddColumn = async () => {
    if (!currentBoardId) return;
    const name = prompt("Nom de la colonne :");
    if (!name) return;
    const res = await createColumn(currentBoardId, name, columns.length);
    if (res.success) {
      success("Colonne ajoutée");
      if (currentBoardId) loadBoardData(currentBoardId);
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    if (!confirm("Supprimer cette colonne ? Les projets seront perdus.")) return;
    const res = await deleteColumn(columnId);
    if (res.success) {
        success("Colonne supprimée");
        if (currentBoardId) loadBoardData(currentBoardId);
    }
  };

  const handleCreateProject = async (columnId: string) => {
    const title = prompt("Nom de l'opération :");
    if (!title) return;
    const res = await createProject(title);
    if (res.success && res.data) {
        // Move to current board/column
        await moveProject(res.data.id, columnId);
        if (currentBoardId) loadBoardData(currentBoardId);
        success("Opération créée");
    }
  };

  const handleMoveProject = async (projectId: string, newColumnId: string) => {
    setMovingId(projectId);
    const res = await moveProject(projectId, newColumnId);
    if (res.success) {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, columnId: newColumnId } : p));
    }
    setMovingId(null);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs value={currentBoardId || ""} onValueChange={setCurrentBoardId} className="w-full sm:w-auto">
            <TabsList className="bg-muted/50 border border-border">
                {boards.map(b => (
                    <TabsTrigger key={b.id} value={b.id}>{b.name}</TabsTrigger>
                ))}
                <Button variant="ghost" size="sm" onClick={handleCreateBoard} className="h-8 ml-2">
                    <Plus className="w-4 h-4" />
                </Button>
            </TabsList>
        </Tabs>

        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleAddColumn}>
                <Plus className="w-4 h-4 mr-2" /> Colonne
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm"><Settings2 className="w-4 h-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleDeleteBoard} className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Supprimer Tableau</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      {boards.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
              <p className="text-muted-foreground mb-4">Aucun tableau Kanban.</p>
              <Button onClick={handleCreateBoard}>Créer mon premier tableau</Button>
          </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide min-h-[600px]">
            {columns.map((col) => {
            const columnProjects = projects.filter((p) => p.columnId === col.id);
            
            return (
                <div key={col.id} className="flex flex-col gap-4 bg-muted p-4 rounded-xl border border-border min-w-[300px] w-[300px]">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
                            {col.name}
                        </h4>
                        <span className="inline-flex rounded-full bg-background py-0.5 px-2 text-xs font-bold border border-border text-foreground">
                            {columnProjects.length}
                        </span>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6"><MoreVertical className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleDeleteColumn(col.id)} className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex flex-col gap-4 flex-1">
                    <AnimatePresence mode="popLayout">
                        {columnProjects.map((project) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <div className="rounded-xl border border-border bg-card p-4 shadow-sm hover:border-primary transition-all group relative">
                                    {movingId === project.id && (
                                        <div className="absolute inset-0 bg-background/50 z-10 flex items-center justify-center rounded-xl">
                                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                        </div>
                                    )}
                                    <div className="flex items-start justify-between mb-3">
                                        <Link href={`/admin/projects/${project.id}`} className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 pr-6">
                                            {project.title}
                                        </Link>
                                        <div className="absolute right-2 top-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6"><MoreVertical className="w-4 h-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem asChild><Link href={`/admin/projects/${project.id}`}>Ouvrir</Link></DropdownMenuItem>
                                                    {columns.filter(c => c.id !== col.id).map(c => (
                                                        <DropdownMenuItem key={c.id} onClick={() => handleMoveProject(project.id, c.id)}>Déplacer vers {c.name}</DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-xs text-muted-foreground">
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

                                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                                        <span className="text-[9px] font-bold uppercase text-muted-foreground/50">Dossier #{project.id.slice(0,4)}</span>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                                            <Link href={`/admin/projects/${project.id}`}><FileText className="w-3 h-3" /></Link>
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <Button variant="ghost" size="sm" className="w-full border border-dashed border-border text-muted-foreground hover:text-foreground mt-2" onClick={() => handleCreateProject(col.id)}>
                        <Plus className="w-3 h-3 mr-2" /> Ajouter un dossier
                    </Button>
                </div>
                </div>
            );
            })}
        </div>
      )}
    </div>
  );
}