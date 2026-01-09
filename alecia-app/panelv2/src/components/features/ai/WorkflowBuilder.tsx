"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Workflow as WorkflowIcon, 
  Plus,
  Trash2,
  Play,
  Pause,
  Zap,
  Mail,
  Bell,
  Clock,
  Users,
  FileText,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

interface WorkflowBuilderProps {
  className?: string;
  onWorkflowSaved?: (workflow: Workflow) => void;
}

interface Workflow {
  id: string;
  name: string;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  isActive: boolean;
}

interface WorkflowTrigger {
  type: "deal_stage_change" | "new_deal" | "deal_assigned" | "scheduled";
  config: Record<string, string>;
}

interface WorkflowAction {
  id: string;
  type: "send_email" | "create_task" | "notify_team" | "update_field" | "webhook";
  config: Record<string, string>;
}

const TRIGGER_TYPES = [
  { value: "deal_stage_change", label: "Changement d'étape", icon: ArrowRight },
  { value: "new_deal", label: "Nouveau dossier", icon: Plus },
  { value: "deal_assigned", label: "Dossier assigné", icon: Users },
  { value: "scheduled", label: "Planifié (cron)", icon: Clock },
];

const ACTION_TYPES = [
  { value: "send_email", label: "Envoyer un email", icon: Mail },
  { value: "create_task", label: "Créer une tâche", icon: FileText },
  { value: "notify_team", label: "Notifier l'équipe", icon: Bell },
  { value: "update_field", label: "Mettre à jour un champ", icon: Zap },
];

const DEAL_STAGES = [
  "sourcing", "screening", "nda", "loi", "due_diligence", "negotiation", "closing"
];

export function WorkflowBuilder({
  className = "",
  onWorkflowSaved,
}: WorkflowBuilderProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "Notification NDA",
      trigger: { type: "deal_stage_change", config: { toStage: "nda" } },
      actions: [
        { id: "1", type: "notify_team", config: { message: "NDA initié" } },
        { id: "2", type: "create_task", config: { title: "Préparer NDA" } },
      ],
      isActive: true,
    },
    {
      id: "2",
      name: "Alerte Due Diligence",
      trigger: { type: "deal_stage_change", config: { toStage: "due_diligence" } },
      actions: [
        { id: "1", type: "send_email", config: { template: "dd_start" } },
      ],
      isActive: false,
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState<Partial<Workflow>>({
    name: "",
    trigger: { type: "deal_stage_change", config: {} },
    actions: [],
  });

  const toggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isActive: !w.isActive } : w))
    );
    toast.success("Workflow mis à jour");
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
    toast.success("Workflow supprimé");
  };

  const addAction = () => {
    setNewWorkflow((prev) => ({
      ...prev,
      actions: [
        ...(prev.actions || []),
        { id: Date.now().toString(), type: "notify_team", config: {} },
      ],
    }));
  };

  const removeAction = (actionId: string) => {
    setNewWorkflow((prev) => ({
      ...prev,
      actions: prev.actions?.filter((a) => a.id !== actionId) || [],
    }));
  };

  const saveWorkflow = () => {
    if (!newWorkflow.name) {
      toast.error("Veuillez nommer le workflow");
      return;
    }

    const workflow: Workflow = {
      id: Date.now().toString(),
      name: newWorkflow.name,
      trigger: newWorkflow.trigger!,
      actions: newWorkflow.actions || [],
      isActive: true,
    };

    setWorkflows((prev) => [...prev, workflow]);
    onWorkflowSaved?.(workflow);
    setNewWorkflow({ name: "", trigger: { type: "deal_stage_change", config: {} }, actions: [] });
    setIsCreating(false);
    toast.success("Workflow créé");
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <WorkflowIcon className="h-4 w-4 text-orange-500" />
              Automatisations
            </CardTitle>
            <CardDescription>
              Créez des règles pour automatiser vos processus
            </CardDescription>
          </div>
          {!isCreating && (
            <Button size="sm" onClick={() => setIsCreating(true)} className="gap-1">
              <Plus className="h-3 w-3" />
              Nouveau
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Existing Workflows */}
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="p-3 border rounded-lg space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={workflow.isActive}
                  onCheckedChange={() => toggleWorkflow(workflow.id)}
                />
                <span className="font-medium text-sm">{workflow.name}</span>
                <Badge variant={workflow.isActive ? "default" : "secondary"} className="text-xs">
                  {workflow.isActive ? "Actif" : "Inactif"}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                onClick={() => deleteWorkflow(workflow.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="gap-1">
                <Zap className="h-3 w-3" />
                {TRIGGER_TYPES.find((t) => t.value === workflow.trigger.type)?.label}
              </Badge>
              <ArrowRight className="h-3 w-3" />
              {workflow.actions.map((action, i) => (
                <Badge key={action.id} variant="outline" className="gap-1">
                  {ACTION_TYPES.find((a) => a.value === action.type)?.label}
                </Badge>
              ))}
            </div>
          </div>
        ))}

        {/* Create New Workflow */}
        {isCreating && (
          <div className="p-4 border-2 border-dashed rounded-lg space-y-4">
            <h4 className="font-medium text-sm">Nouveau Workflow</h4>

            <div className="space-y-2">
              <Label htmlFor="wf-name">Nom</Label>
              <Input
                id="wf-name"
                placeholder="Ex: Notification closing"
                value={newWorkflow.name}
                onChange={(e) =>
                  setNewWorkflow({ ...newWorkflow, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Déclencheur</Label>
              <Select
                value={newWorkflow.trigger?.type}
                onValueChange={(value) =>
                  setNewWorkflow({
                    ...newWorkflow,
                    trigger: { type: value as WorkflowTrigger["type"], config: {} },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un déclencheur" />
                </SelectTrigger>
                <SelectContent>
                  {TRIGGER_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      <div className="flex items-center gap-2">
                        <t.icon className="h-4 w-4" />
                        {t.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newWorkflow.trigger?.type === "deal_stage_change" && (
              <div className="space-y-2">
                <Label>Vers l'étape</Label>
                <Select
                  value={newWorkflow.trigger?.config?.toStage || ""}
                  onValueChange={(value) =>
                    setNewWorkflow({
                      ...newWorkflow,
                      trigger: {
                        ...newWorkflow.trigger!,
                        config: { toStage: value },
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une étape" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEAL_STAGES.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
              <Label>Actions</Label>
              {newWorkflow.actions?.map((action, i) => (
                <div key={action.id} className="flex items-center gap-2">
                  <Select
                    value={action.type}
                    onValueChange={(value) => {
                      const updated = [...(newWorkflow.actions || [])];
                      updated[i] = { ...action, type: value as WorkflowAction["type"] };
                      setNewWorkflow({ ...newWorkflow, actions: updated });
                    }}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTION_TYPES.map((a) => (
                        <SelectItem key={a.value} value={a.value}>
                          <div className="flex items-center gap-2">
                            <a.icon className="h-4 w-4" />
                            {a.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAction(action.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addAction} className="gap-1">
                <Plus className="h-3 w-3" />
                Ajouter une action
              </Button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsCreating(false)}
              >
                Annuler
              </Button>
              <Button onClick={saveWorkflow} className="gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Créer
              </Button>
            </div>
          </div>
        )}

        {workflows.length === 0 && !isCreating && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            <WorkflowIcon className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>Aucun workflow configuré</p>
            <p className="text-xs">Créez votre premier workflow d'automatisation</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
