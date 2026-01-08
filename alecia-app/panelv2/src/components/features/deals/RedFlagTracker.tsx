"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Flag, 
  AlertCircle,
  FileWarning,
  Scale,
  Coins,
  Users,
  Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export interface RedFlag {
  id: string;
  title: string;
  description: string;
  category: "legal" | "financial" | "operational" | "hr" | "compliance" | "other";
  severity: "critical" | "major" | "minor";
  status: "open" | "investigating" | "mitigated" | "resolved";
  discoveredAt: Date;
  discoveredBy?: string;
  mitigationPlan?: string;
}

interface RedFlagTrackerProps {
  dealId: string;
  dealName?: string;
  flags?: RedFlag[];
  className?: string;
  onFlagAdded?: (flag: RedFlag) => void;
  onFlagUpdated?: (flag: RedFlag) => void;
  onFlagDeleted?: (flagId: string) => void;
}

const CATEGORY_CONFIG = {
  legal: { label: "Juridique", icon: Scale, color: "text-purple-600 bg-purple-50 border-purple-200" },
  financial: { label: "Financier", icon: Coins, color: "text-blue-600 bg-blue-50 border-blue-200" },
  operational: { label: "Opérationnel", icon: FileWarning, color: "text-amber-600 bg-amber-50 border-amber-200" },
  hr: { label: "RH", icon: Users, color: "text-green-600 bg-green-50 border-green-200" },
  compliance: { label: "Conformité", icon: Shield, color: "text-red-600 bg-red-50 border-red-200" },
  other: { label: "Autre", icon: AlertCircle, color: "text-gray-600 bg-gray-50 border-gray-200" },
};

const SEVERITY_CONFIG = {
  critical: { label: "Critique", color: "bg-red-500 text-white" },
  major: { label: "Majeur", color: "bg-amber-500 text-white" },
  minor: { label: "Mineur", color: "bg-gray-400 text-white" },
};

const STATUS_CONFIG = {
  open: { label: "Ouvert", color: "text-red-600 border-red-200 bg-red-50" },
  investigating: { label: "Investigation", color: "text-amber-600 border-amber-200 bg-amber-50" },
  mitigated: { label: "Atténué", color: "text-blue-600 border-blue-200 bg-blue-50" },
  resolved: { label: "Résolu", color: "text-green-600 border-green-200 bg-green-50" },
};

/**
 * Red Flag Tracker Component
 * Log and track issues discovered during Due Diligence
 */
export function RedFlagTracker({
  dealId,
  dealName,
  flags: initialFlags = [],
  className,
  onFlagAdded,
  onFlagUpdated,
  onFlagDeleted,
}: RedFlagTrackerProps) {
  const [flags, setFlags] = useState<RedFlag[]>(initialFlags);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFlag, setNewFlag] = useState<Partial<RedFlag>>({
    category: "legal",
    severity: "major",
    status: "open",
  });

  const handleAddFlag = () => {
    if (!newFlag.title?.trim()) {
      toast.error("Le titre est requis");
      return;
    }

    const flag: RedFlag = {
      id: `flag-${Date.now()}`,
      title: newFlag.title!.trim(),
      description: newFlag.description || "",
      category: newFlag.category as RedFlag["category"],
      severity: newFlag.severity as RedFlag["severity"],
      status: newFlag.status as RedFlag["status"],
      discoveredAt: new Date(),
      mitigationPlan: newFlag.mitigationPlan,
    };

    setFlags([...flags, flag]);
    onFlagAdded?.(flag);
    setIsAddDialogOpen(false);
    setNewFlag({ category: "legal", severity: "major", status: "open" });
    toast.success("Red flag ajouté");
  };

  const handleDeleteFlag = (flagId: string) => {
    setFlags(flags.filter(f => f.id !== flagId));
    onFlagDeleted?.(flagId);
    toast.success("Red flag supprimé");
  };

  const handleStatusChange = (flagId: string, status: RedFlag["status"]) => {
    setFlags(flags.map(f => {
      if (f.id === flagId) {
        const updated = { ...f, status };
        onFlagUpdated?.(updated);
        return updated;
      }
      return f;
    }));
  };

  // Count by severity
  const counts = {
    critical: flags.filter(f => f.severity === "critical" && f.status !== "resolved").length,
    major: flags.filter(f => f.severity === "major" && f.status !== "resolved").length,
    minor: flags.filter(f => f.severity === "minor" && f.status !== "resolved").length,
    total: flags.filter(f => f.status !== "resolved").length,
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Red Flags
            </CardTitle>
            <CardDescription>
              {counts.total} point(s) d'attention actif(s)
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1 h-8">
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-red-500" />
                  Nouveau Red Flag
                </DialogTitle>
                <DialogDescription>
                  Signaler un point d'attention découvert en Due Diligence
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium">Titre *</label>
                  <Input
                    placeholder="Ex: Litige en cours avec fournisseur"
                    value={newFlag.title || ""}
                    onChange={(e) => setNewFlag({ ...newFlag, title: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Catégorie</label>
                    <Select
                      value={newFlag.category}
                      onValueChange={(v) => setNewFlag({ ...newFlag, category: v as any })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Sévérité</label>
                    <Select
                      value={newFlag.severity}
                      onValueChange={(v) => setNewFlag({ ...newFlag, severity: v as any })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(SEVERITY_CONFIG).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Détails du problème identifié..."
                    value={newFlag.description || ""}
                    onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Plan de mitigation</label>
                  <Textarea
                    placeholder="Actions proposées pour résoudre ce point..."
                    value={newFlag.mitigationPlan || ""}
                    onChange={(e) => setNewFlag({ ...newFlag, mitigationPlan: e.target.value })}
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddFlag} className="bg-red-600 hover:bg-red-700 gap-1">
                  <Flag className="h-4 w-4" />
                  Ajouter le Red Flag
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Severity counts */}
        {counts.total > 0 && (
          <div className="flex gap-2 mt-3">
            {counts.critical > 0 && (
              <Badge className={SEVERITY_CONFIG.critical.color}>
                {counts.critical} Critique{counts.critical > 1 ? "s" : ""}
              </Badge>
            )}
            {counts.major > 0 && (
              <Badge className={SEVERITY_CONFIG.major.color}>
                {counts.major} Majeur{counts.major > 1 ? "s" : ""}
              </Badge>
            )}
            {counts.minor > 0 && (
              <Badge className={SEVERITY_CONFIG.minor.color}>
                {counts.minor} Mineur{counts.minor > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {flags.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-10 w-10 mx-auto text-green-500 mb-3" />
            <p className="text-sm text-muted-foreground">
              Aucun red flag identifié
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              C'est bon signe ! 🎉
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[350px] pr-3">
            <div className="space-y-3">
              {flags.map((flag) => {
                const catConfig = CATEGORY_CONFIG[flag.category];
                const CatIcon = catConfig.icon;

                return (
                  <div
                    key={flag.id}
                    className={cn(
                      "p-3 border rounded-lg",
                      flag.status === "resolved" && "opacity-60"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <Badge 
                          className={cn("text-[10px] shrink-0", SEVERITY_CONFIG[flag.severity].color)}
                        >
                          {SEVERITY_CONFIG[flag.severity].label}
                        </Badge>
                        <div>
                          <p className="font-medium text-sm">{flag.title}</p>
                          {flag.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {flag.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => handleDeleteFlag(flag.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={cn("text-[10px]", catConfig.color)}>
                        <CatIcon className="h-2.5 w-2.5 mr-1" />
                        {catConfig.label}
                      </Badge>
                      <Select
                        value={flag.status}
                        onValueChange={(v) => handleStatusChange(flag.id, v as RedFlag["status"])}
                      >
                        <SelectTrigger className="h-6 w-28 text-[10px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                            <SelectItem key={key} value={key} className="text-xs">
                              {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-[10px] text-muted-foreground ml-auto">
                        {format(flag.discoveredAt, "d MMM yyyy", { locale: fr })}
                      </span>
                    </div>

                    {flag.mitigationPlan && (
                      <div className="mt-2 p-2 bg-muted/30 rounded text-xs">
                        <p className="font-medium text-muted-foreground mb-0.5">Plan de mitigation:</p>
                        <p>{flag.mitigationPlan}</p>
                      </div>
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

// Example data
export const exampleRedFlags: RedFlag[] = [
  {
    id: "1",
    title: "Litige prud'homal en cours",
    description: "Ex-directeur commercial demande 150k€ de dommages et intérêts",
    category: "hr",
    severity: "major",
    status: "investigating",
    discoveredAt: new Date(2026, 0, 5),
    mitigationPlan: "Réduction du prix de 100k€ proposée",
  },
  {
    id: "2",
    title: "Clause de changement de contrôle client majeur",
    description: "Le contrat avec le client #1 (35% du CA) inclut une clause de résiliation automatique",
    category: "legal",
    severity: "critical",
    status: "open",
    discoveredAt: new Date(2026, 0, 7),
  },
];
