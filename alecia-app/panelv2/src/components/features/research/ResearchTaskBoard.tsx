"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, CheckCircle2, Circle, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  todo: <Circle className="w-4 h-4 text-slate-400" />,
  in_progress: <Clock className="w-4 h-4 text-blue-500" />,
  review: <AlertCircle className="w-4 h-4 text-orange-500" />,
  done: <CheckCircle2 className="w-4 h-4 text-green-500" />,
};

export function ResearchTaskBoard() {
  const tasks = useQuery(api.research.getTasks, {});
  const stats = useQuery(api.research.getTaskStats);
  const createTask = useMutation(api.research.createTask);
  const moveTask = useMutation(api.research.moveTask);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");

  const handleCreate = async () => {
    if (!newTitle.trim()) {
      toast.error("Titre requis");
      return;
    }

    try {
      await createTask({
        title: newTitle,
        description: newDescription || undefined,
        priority: newPriority,
      });
      toast.success("Tâche créée !");
      setIsDialogOpen(false);
      setNewTitle("");
      setNewDescription("");
      setNewPriority("medium");
    } catch (e) {
      toast.error("Erreur lors de la création");
    }
  };

  const handleStatusChange = async (taskId: Id<"research_tasks">, newStatus: any) => {
    try {
      await moveTask({ taskId, newStatus });
    } catch (e) {
      toast.error("Erreur");
    }
  };

  const columns = [
    { key: "todo", label: "À faire" },
    { key: "in_progress", label: "En cours" },
    { key: "review", label: "En revue" },
    { key: "done", label: "Terminé" },
  ];

  if (!tasks) {
    return <div className="text-center text-muted-foreground py-12">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Tâches de recherche</h2>
          {stats && (
            <p className="text-sm text-muted-foreground">
              {stats.total} tâches • {stats.overdue > 0 && (
                <span className="text-red-500">{stats.overdue} en retard</span>
              )}
            </p>
          )}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle tâche
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une tâche</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Titre de la tâche"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <Textarea
                placeholder="Description (optionnel)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
              />
              <Select value={newPriority} onValueChange={(v: any) => setNewPriority(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Basse</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreate}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4">
        {columns.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div key={col.key} className="space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {col.label}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {columnTasks.length}
                </Badge>
              </div>
              <div className="bg-muted/30 rounded-lg p-2 min-h-[200px] space-y-2">
                {columnTasks.map((task) => (
                  <Card key={task._id} className="shadow-sm">
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium leading-tight">
                          {task.title}
                        </h4>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] shrink-0 ${PRIORITY_COLORS[task.priority]}`}
                        >
                          {task.priority === "high" ? "!" : task.priority === "low" ? "↓" : "~"}
                        </Badge>
                      </div>
                      {task.assigneeName !== "Non assigné" && (
                        <p className="text-xs text-muted-foreground">
                          → {task.assigneeName}
                        </p>
                      )}
                      {/* Quick status buttons */}
                      {col.key !== "done" && (
                        <div className="flex gap-1 pt-1">
                          {columns
                            .filter((c) => c.key !== col.key)
                            .slice(0, 2)
                            .map((targetCol) => (
                              <Button
                                key={targetCol.key}
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-[10px]"
                                onClick={() => handleStatusChange(task._id, targetCol.key)}
                              >
                                <ChevronRight className="w-3 h-3 mr-1" />
                                {targetCol.label}
                              </Button>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
