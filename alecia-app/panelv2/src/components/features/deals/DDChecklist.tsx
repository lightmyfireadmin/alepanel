"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ClipboardCheck, 
  ChevronDown,
  ChevronRight,
  FileText,
  Users,
  Building2,
  Scale,
  Coins,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  notes?: string;
  priority?: "required" | "recommended" | "optional";
}

export interface ChecklistCategory {
  id: string;
  name: string;
  icon: string;
  items: ChecklistItem[];
}

interface DDChecklistProps {
  dealId: string;
  dealType?: "acquisition" | "cession" | "levee" | "custom";
  categories?: ChecklistCategory[];
  className?: string;
  onItemChange?: (categoryId: string, itemId: string, completed: boolean) => void;
}

const TEMPLATES: Record<string, ChecklistCategory[]> = {
  acquisition: [
    {
      id: "legal",
      name: "Juridique & Corporate",
      icon: "Scale",
      items: [
        { id: "l1", label: "Statuts à jour", completed: false, priority: "required" },
        { id: "l2", label: "Extrait Kbis < 3 mois", completed: false, priority: "required" },
        { id: "l3", label: "PV des AG (3 dernières années)", completed: false, priority: "required" },
        { id: "l4", label: "Liste des actionnaires", completed: false, priority: "required" },
        { id: "l5", label: "Pacte d'actionnaires", completed: false, priority: "recommended" },
        { id: "l6", label: "Contrats significatifs", completed: false, priority: "required" },
        { id: "l7", label: "Litiges en cours", completed: false, priority: "required" },
        { id: "l8", label: "Propriété intellectuelle", completed: false, priority: "recommended" },
      ],
    },
    {
      id: "financial",
      name: "Financier",
      icon: "Coins",
      items: [
        { id: "f1", label: "Bilans (3 derniers exercices)", completed: false, priority: "required" },
        { id: "f2", label: "Comptes de résultat", completed: false, priority: "required" },
        { id: "f3", label: "Balance âgée clients", completed: false, priority: "required" },
        { id: "f4", label: "Balance âgée fournisseurs", completed: false, priority: "required" },
        { id: "f5", label: "Budget prévisionnel", completed: false, priority: "recommended" },
        { id: "f6", label: "Détail des dettes", completed: false, priority: "required" },
        { id: "f7", label: "Rapports CAC", completed: false, priority: "required" },
        { id: "f8", label: "Situation fiscale", completed: false, priority: "required" },
      ],
    },
    {
      id: "hr",
      name: "Ressources Humaines",
      icon: "Users",
      items: [
        { id: "h1", label: "Organigramme", completed: false, priority: "required" },
        { id: "h2", label: "Liste des salariés", completed: false, priority: "required" },
        { id: "h3", label: "Contrats de travail clés", completed: false, priority: "required" },
        { id: "h4", label: "Convention collective applicable", completed: false, priority: "recommended" },
        { id: "h5", label: "Accords d'entreprise", completed: false, priority: "optional" },
        { id: "h6", label: "Contentieux prud'hommaux", completed: false, priority: "required" },
      ],
    },
    {
      id: "operational",
      name: "Opérationnel",
      icon: "Building2",
      items: [
        { id: "o1", label: "Baux commerciaux", completed: false, priority: "required" },
        { id: "o2", label: "Assurances", completed: false, priority: "required" },
        { id: "o3", label: "Fournisseurs clés", completed: false, priority: "recommended" },
        { id: "o4", label: "Clients principaux (top 10)", completed: false, priority: "required" },
        { id: "o5", label: "Autorisations/Licences", completed: false, priority: "required" },
        { id: "o6", label: "Conformité RGPD", completed: false, priority: "recommended" },
      ],
    },
  ],
  cession: [
    {
      id: "preparation",
      name: "Préparation Cession",
      icon: "FileText",
      items: [
        { id: "p1", label: "Info Memo préparé", completed: false, priority: "required" },
        { id: "p2", label: "Teaser validé", completed: false, priority: "required" },
        { id: "p3", label: "Data Room structurée", completed: false, priority: "required" },
        { id: "p4", label: "Liste d'acquéreurs potentiels", completed: false, priority: "required" },
        { id: "p5", label: "Valorisation indicative", completed: false, priority: "required" },
      ],
    },
    // ... more categories
  ],
  levee: [
    {
      id: "pitch",
      name: "Documents de Pitch",
      icon: "FileText",
      items: [
        { id: "pi1", label: "Pitch Deck", completed: false, priority: "required" },
        { id: "pi2", label: "Business Plan", completed: false, priority: "required" },
        { id: "pi3", label: "Modèle financier", completed: false, priority: "required" },
        { id: "pi4", label: "Pack investisseur", completed: false, priority: "recommended" },
      ],
    },
  ],
  custom: [],
};

const ICON_MAP: Record<string, React.ReactNode> = {
  Scale: <Scale className="h-4 w-4" />,
  Coins: <Coins className="h-4 w-4" />,
  Users: <Users className="h-4 w-4" />,
  Building2: <Building2 className="h-4 w-4" />,
  FileText: <FileText className="h-4 w-4" />,
};

/**
 * Due Diligence Checklist Component
 * Predefined checklists per deal type with progress tracking
 */
export function DDChecklist({
  dealId,
  dealType = "acquisition",
  categories: initialCategories,
  className,
  onItemChange,
}: DDChecklistProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(dealType);
  const [categories, setCategories] = useState<ChecklistCategory[]>(
    initialCategories || TEMPLATES[dealType] || []
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map(c => c.id))
  );

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    setCategories(TEMPLATES[template] || []);
    setExpandedCategories(new Set((TEMPLATES[template] || []).map(c => c.id)));
  };

  const handleItemToggle = (categoryId: string, itemId: string, completed: boolean) => {
    setCategories(cats =>
      cats.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map(item =>
                item.id === itemId ? { ...item, completed } : item
              ),
            }
          : cat
      )
    );
    onItemChange?.(categoryId, itemId, completed);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Calculate overall progress
  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
  const completedItems = categories.reduce(
    (sum, cat) => sum + cat.items.filter(i => i.completed).length,
    0
  );
  const progressPercent = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Checklist Due Diligence
            </CardTitle>
            <CardDescription>
              {completedItems}/{totalItems} éléments complétés
            </CardDescription>
          </div>
          <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue placeholder="Template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="acquisition">Acquisition</SelectItem>
              <SelectItem value="cession">Cession</SelectItem>
              <SelectItem value="levee">Levée de fonds</SelectItem>
              <SelectItem value="custom">Personnalisé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Progression</span>
            <span>{progressPercent.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px] pr-3">
          <div className="space-y-3">
            {categories.map((category) => {
              const categoryCompleted = category.items.filter(i => i.completed).length;
              const categoryTotal = category.items.length;
              const isExpanded = expandedCategories.has(category.id);

              return (
                <Collapsible
                  key={category.id}
                  open={isExpanded}
                  onOpenChange={() => toggleCategory(category.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        {ICON_MAP[category.icon] || <FileText className="h-4 w-4" />}
                        <span className="font-medium text-sm">{category.name}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          categoryCompleted === categoryTotal && "bg-green-50 text-green-600 border-green-200"
                        )}
                      >
                        {categoryCompleted}/{categoryTotal}
                      </Badge>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="pl-8 pr-2 py-2 space-y-2">
                      {category.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 py-1"
                        >
                          <Checkbox
                            id={item.id}
                            checked={item.completed}
                            onCheckedChange={(checked) =>
                              handleItemToggle(category.id, item.id, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={item.id}
                            className={cn(
                              "text-sm flex-1 cursor-pointer",
                              item.completed && "line-through text-muted-foreground"
                            )}
                          >
                            {item.label}
                          </label>
                          {item.priority === "required" && (
                            <Badge variant="destructive" className="text-[10px] px-1 py-0">
                              Requis
                            </Badge>
                          )}
                          {item.priority === "optional" && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 text-muted-foreground">
                              Optionnel
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </ScrollArea>

        {/* Complete all button */}
        {progressPercent < 100 && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => {
                setCategories(cats =>
                  cats.map(cat => ({
                    ...cat,
                    items: cat.items.map(item => ({ ...item, completed: true })),
                  }))
                );
                toast.success("Tous les éléments marqués comme complétés");
              }}
            >
              <CheckCircle2 className="h-4 w-4" />
              Tout marquer comme complété
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
