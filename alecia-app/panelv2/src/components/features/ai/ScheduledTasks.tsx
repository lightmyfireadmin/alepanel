"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  CalendarDays,
  Plus,
  Trash2,
  Bell,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ScheduledTasksProps {
  dealId?: string;
  className?: string;
  onTaskCreated?: (task: ScheduledTask) => void;
}

interface ScheduledTask {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  assignee?: string;
  isCompleted: boolean;
  reminder?: Date;
  recurring?: "none" | "daily" | "weekly" | "monthly";
}

const PRIORITY_CONFIG = {
  low: { label: "Basse", color: "text-gray-500 bg-gray-100" },
  medium: { label: "Moyenne", color: "text-amber-600 bg-amber-100" },
  high: { label: "Haute", color: "text-red-600 bg-red-100" },
};

export function ScheduledTasks({
  dealId,
  className = "",
  onTaskCreated,
}: ScheduledTasksProps) {
  const [tasks, setTasks] = useState<ScheduledTask[]>([
    {
      id: "1",
      title: "Envoyer NDA signé",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      priority: "high",
      isCompleted: false,
      assignee: "Marie",
    },
    {
      id: "2",
      title: "Préparer note de valorisation",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      priority: "medium",
      isCompleted: false,
      assignee: "Pierre",
    },
    {
      id: "3",
      title: "Collecter états financiers",
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      priority: "high",
      isCompleted: true,
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState<Partial<ScheduledTask>>({
    title: "",
    priority: "medium",
    dueDate: new Date(),
    recurring: "none",
  });

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success("Tâche supprimée");
  };

  const createTask = () => {
    if (!newTask.title) {
      toast.error("Veuillez saisir un titre");
      return;
    }

    const task: ScheduledTask = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate || new Date(),
      priority: newTask.priority as "low" | "medium" | "high",
      isCompleted: false,
      recurring: newTask.recurring as ScheduledTask["recurring"],
    };

    setTasks((prev) => [...prev, task]);
    onTaskCreated?.(task);
    setNewTask({ title: "", priority: "medium", dueDate: new Date(), recurring: "none" });
    setIsCreating(false);
    toast.success("Tâche créée");
  };

  const isOverdue = (date: Date) => date < new Date() && !tasks.find(t => t.dueDate === date)?.isCompleted;

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    return a.dueDate.getTime() - b.dueDate.getTime();
  });

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-indigo-500" />
              Tâches Planifiées
            </CardTitle>
            <CardDescription>
              Gérez les rappels et tâches à venir
            </CardDescription>
          </div>
          {!isCreating && (
            <Button size="sm" onClick={() => setIsCreating(true)} className="gap-1">
              <Plus className="h-3 w-3" />
              Nouvelle
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Task List */}
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex items-start gap-3 p-3 border rounded-lg transition-opacity",
              task.isCompleted && "opacity-60"
            )}
          >
            <Checkbox
              checked={task.isCompleted}
              onCheckedChange={() => toggleComplete(task.id)}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-sm font-medium",
                  task.isCompleted && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </span>
                <Badge
                  variant="outline"
                  className={cn("text-xs", PRIORITY_CONFIG[task.priority].color)}
                >
                  {PRIORITY_CONFIG[task.priority].label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span className={cn(
                  isOverdue(task.dueDate) && !task.isCompleted && "text-red-500"
                )}>
                  {format(task.dueDate, "d MMM yyyy", { locale: fr })}
                </span>
                {task.assignee && (
                  <>
                    <span>•</span>
                    <span>{task.assignee}</span>
                  </>
                )}
                {isOverdue(task.dueDate) && !task.isCompleted && (
                  <AlertCircle className="h-3 w-3 text-red-500" />
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => deleteTask(task.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}

        {/* Create New Task */}
        {isCreating && (
          <div className="p-4 border-2 border-dashed rounded-lg space-y-3">
            <div className="space-y-2">
              <Label htmlFor="task-title">Titre</Label>
              <Input
                id="task-title"
                placeholder="Ex: Envoyer document"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Échéance</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {newTask.dueDate
                        ? format(newTask.dueDate, "d MMM yyyy", { locale: fr })
                        : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newTask.dueDate}
                      onSelect={(date) => setNewTask({ ...newTask, dueDate: date })}
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Priorité</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Récurrence</Label>
              <Select
                value={newTask.recurring}
                onValueChange={(value) => setNewTask({ ...newTask, recurring: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  <SelectItem value="daily">Quotidienne</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="monthly">Mensuelle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Annuler
              </Button>
              <Button onClick={createTask} className="gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Créer
              </Button>
            </div>
          </div>
        )}

        {tasks.length === 0 && !isCreating && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>Aucune tâche planifiée</p>
          </div>
        )}

        {/* Summary */}
        {tasks.length > 0 && (
          <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
            <span>{tasks.filter(t => !t.isCompleted).length} tâches restantes</span>
            <span>{tasks.filter(t => t.isCompleted).length} terminées</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
