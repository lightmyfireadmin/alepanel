"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
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
  FileText, 
  Plus, 
  Trash2, 
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export interface DocumentRequest {
  id: string;
  name: string;
  category: string;
  status: "pending" | "requested" | "received" | "na";
  requestedAt?: Date;
  receivedAt?: Date;
  priority: "high" | "medium" | "low";
  notes?: string;
  fileUrl?: string;
}

interface DocumentRequestListProps {
  dealId: string;
  dealName?: string;
  requests?: DocumentRequest[];
  className?: string;
  onRequestAdded?: (request: DocumentRequest) => void;
  onStatusChange?: (requestId: string, status: DocumentRequest["status"]) => void;
}

const STATUS_CONFIG = {
  pending: { label: "En attente", color: "text-gray-500 bg-gray-100 border-gray-200", icon: Clock },
  requested: { label: "Demandé", color: "text-amber-600 bg-amber-50 border-amber-200", icon: Send },
  received: { label: "Reçu", color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle },
  na: { label: "N/A", color: "text-gray-400 bg-gray-50 border-gray-200", icon: AlertCircle },
};

const PRIORITY_CONFIG = {
  high: { label: "Haute", color: "text-red-600" },
  medium: { label: "Moyenne", color: "text-amber-600" },
  low: { label: "Basse", color: "text-gray-500" },
};

const DEFAULT_DOCUMENTS = [
  { name: "Bilans des 3 derniers exercices", category: "Financier", priority: "high" as const },
  { name: "Comptes de résultat", category: "Financier", priority: "high" as const },
  { name: "Situation intermédiaire", category: "Financier", priority: "medium" as const },
  { name: "Budget prévisionnel", category: "Financier", priority: "medium" as const },
  { name: "Statuts à jour", category: "Juridique", priority: "high" as const },
  { name: "Kbis < 3 mois", category: "Juridique", priority: "high" as const },
  { name: "PV des AG", category: "Juridique", priority: "medium" as const },
  { name: "Contrats clients majeurs", category: "Commercial", priority: "high" as const },
  { name: "Organigramme", category: "RH", priority: "medium" as const },
  { name: "Liste des salariés", category: "RH", priority: "medium" as const },
];

/**
 * Document Request List Component
 * Track requested vs received documents during DD
 */
export function DocumentRequestList({
  dealId,
  dealName,
  requests: initialRequests = [],
  className,
  onRequestAdded,
  onStatusChange,
}: DocumentRequestListProps) {
  const [requests, setRequests] = useState<DocumentRequest[]>(
    initialRequests.length > 0 
      ? initialRequests 
      : DEFAULT_DOCUMENTS.map((d, i) => ({
          id: `doc-${i}`,
          ...d,
          status: "pending" as const,
        }))
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: "", category: "Financier", priority: "medium" as const });
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Calculate stats
  const stats = {
    total: requests.length,
    received: requests.filter(r => r.status === "received").length,
    requested: requests.filter(r => r.status === "requested").length,
    pending: requests.filter(r => r.status === "pending").length,
    na: requests.filter(r => r.status === "na").length,
  };
  const progressPercent = stats.total > 0 
    ? ((stats.received + stats.na) / stats.total) * 100 
    : 0;

  // Get unique categories
  const categories = [...new Set(requests.map(r => r.category))];

  // Filter requests
  const filteredRequests = filterCategory === "all" 
    ? requests 
    : requests.filter(r => r.category === filterCategory);

  const handleAddDocument = () => {
    if (!newDoc.name.trim()) {
      toast.error("Le nom est requis");
      return;
    }

    const request: DocumentRequest = {
      id: `doc-${Date.now()}`,
      name: newDoc.name.trim(),
      category: newDoc.category,
      priority: newDoc.priority,
      status: "pending",
    };

    setRequests([...requests, request]);
    onRequestAdded?.(request);
    setIsAddDialogOpen(false);
    setNewDoc({ name: "", category: "Financier", priority: "medium" });
    toast.success("Document ajouté");
  };

  const handleStatusChange = (requestId: string, status: DocumentRequest["status"]) => {
    setRequests(reqs =>
      reqs.map(r => {
        if (r.id === requestId) {
          return {
            ...r,
            status,
            requestedAt: status === "requested" ? new Date() : r.requestedAt,
            receivedAt: status === "received" ? new Date() : r.receivedAt,
          };
        }
        return r;
      })
    );
    onStatusChange?.(requestId, status);
  };

  const handleDelete = (requestId: string) => {
    setRequests(requests.filter(r => r.id !== requestId));
    toast.success("Document supprimé");
  };

  const markAllAsRequested = () => {
    setRequests(reqs =>
      reqs.map(r => ({
        ...r,
        status: r.status === "pending" ? "requested" : r.status,
        requestedAt: r.status === "pending" ? new Date() : r.requestedAt,
      }))
    );
    toast.success("Tous les documents marqués comme demandés");
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Data Room Request
            </CardTitle>
            <CardDescription>
              {stats.received}/{stats.total} documents reçus
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1 h-8">
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouveau document à demander</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium">Nom du document *</label>
                  <Input
                    placeholder="Ex: Baux commerciaux"
                    value={newDoc.name}
                    onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Catégorie</label>
                    <Select
                      value={newDoc.category}
                      onValueChange={(v) => setNewDoc({ ...newDoc, category: v })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Financier">Financier</SelectItem>
                        <SelectItem value="Juridique">Juridique</SelectItem>
                        <SelectItem value="Commercial">Commercial</SelectItem>
                        <SelectItem value="RH">RH</SelectItem>
                        <SelectItem value="Opérationnel">Opérationnel</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Priorité</label>
                    <Select
                      value={newDoc.priority}
                      onValueChange={(v) => setNewDoc({ ...newDoc, priority: v as any })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">Haute</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="low">Basse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddDocument}>Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Progress */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Progression</span>
            <span>{progressPercent.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Stats badges */}
        <div className="flex gap-2 mt-3">
          <Badge variant="outline" className={STATUS_CONFIG.received.color}>
            {stats.received} reçus
          </Badge>
          <Badge variant="outline" className={STATUS_CONFIG.requested.color}>
            {stats.requested} demandés
          </Badge>
          <Badge variant="outline" className={STATUS_CONFIG.pending.color}>
            {stats.pending} en attente
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Filter & Actions */}
        <div className="flex items-center justify-between gap-2">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            size="sm"
            variant="outline"
            className="gap-1 h-8 text-xs"
            onClick={markAllAsRequested}
          >
            <Send className="h-3.5 w-3.5" />
            Tout marquer demandé
          </Button>
        </div>

        {/* Document list */}
        <ScrollArea className="h-[300px] pr-3">
          <div className="space-y-2">
            {filteredRequests.map((request) => {
              const StatusIcon = STATUS_CONFIG[request.status].icon;

              return (
                <div
                  key={request.id}
                  className="flex items-center gap-3 p-2 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <Select
                    value={request.status}
                    onValueChange={(v) => handleStatusChange(request.id, v as DocumentRequest["status"])}
                  >
                    <SelectTrigger className="w-28 h-7 text-[10px]">
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

                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      request.status === "received" && "line-through text-muted-foreground"
                    )}>
                      {request.name}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{request.category}</span>
                      <span className={PRIORITY_CONFIG[request.priority].color}>
                        • {PRIORITY_CONFIG[request.priority].label}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => handleDelete(request.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
