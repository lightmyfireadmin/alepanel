"use client";

import { useState } from "react";
import { useMicrosoft } from "@/hooks/use-microsoft";
import { 
  FolderPlus, 
  Briefcase, 
  FileText, 
  Scale, 
  Calculator, 
  Users, 
  CheckSquare,
  Loader2,
  FolderOpen
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Pre-defined Data Room templates for M&A
const DATA_ROOM_TEMPLATES = [
  {
    id: "acquisition",
    name: "Acquisition",
    icon: Briefcase,
    description: "Structure complète pour une acquisition",
    folders: [
      "01 - Informations Générales",
      "02 - Documents Juridiques",
      "03 - Données Financières",
      "04 - Ressources Humaines",
      "05 - Propriété Intellectuelle",
      "06 - Contrats Commerciaux",
      "07 - Conformité & Réglementaire",
      "08 - Environnement",
      "09 - IT & Systèmes",
      "10 - Due Diligence Reports",
      "11 - Q&A",
    ],
  },
  {
    id: "cession",
    name: "Cession",
    icon: Scale,
    description: "Structure pour préparer une cession",
    folders: [
      "Teaser & IM",
      "Data Room Vendeur",
      "Financiers Audités",
      "Business Plan",
      "Contrats Clés",
      "Juridique & Statuts",
      "Management Presentations",
      "Q&A Acheteurs",
    ],
  },
  {
    id: "due-diligence",
    name: "Due Diligence",
    icon: CheckSquare,
    description: "Checklist de DD approfondie",
    folders: [
      "DD Financière",
      "DD Juridique",
      "DD Fiscale",
      "DD Sociale",
      "DD Environnementale",
      "DD IT & Cyber",
      "DD Commerciale",
      "DD Stratégique",
      "Red Flags",
      "Synthèse",
    ],
  },
  {
    id: "levee-fonds",
    name: "Levée de Fonds",
    icon: Calculator,
    description: "Documentation pour investisseurs",
    folders: [
      "Pitch Deck",
      "Business Plan",
      "Financiers Prévisionnels",
      "Cap Table",
      "Term Sheet",
      "Due Diligence",
      "Juridique",
    ],
  },
  {
    id: "custom",
    name: "Personnalisé",
    icon: FolderPlus,
    description: "Créer votre propre structure",
    folders: [],
  },
];

interface DataRoomBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dealName?: string;
  onComplete?: (folderId: string) => void;
}

export function DataRoomBuilder({ 
  open, 
  onOpenChange, 
  dealName = "",
  onComplete 
}: DataRoomBuilderProps) {
  const { createFolder } = useMicrosoft();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("acquisition");
  const [roomName, setRoomName] = useState(dealName ? `Data Room - ${dealName}` : "");
  const [isCreating, setIsCreating] = useState(false);
  const [customFolders, setCustomFolders] = useState<string>("");

  const currentTemplate = DATA_ROOM_TEMPLATES.find((t) => t.id === selectedTemplate);

  const handleCreate = async () => {
    if (!roomName.trim()) {
      toast.error("Veuillez entrer un nom pour la Data Room");
      return;
    }

    setIsCreating(true);

    try {
      // Create root folder
      const rootFolder = await createFolder(roomName);
      
      if (!rootFolder?.id) {
        throw new Error("Échec de création du dossier principal");
      }

      // Get folders to create
      let foldersToCreate = currentTemplate?.folders || [];
      if (selectedTemplate === "custom" && customFolders.trim()) {
        foldersToCreate = customFolders.split("\n").filter((f) => f.trim());
      }

      // Create subfolders
      for (const folderName of foldersToCreate) {
        if (folderName.trim()) {
          await createFolder(folderName.trim(), rootFolder.id);
        }
      }

      toast.success(`Data Room "${roomName}" créée avec ${foldersToCreate.length} dossiers`);
      onComplete?.(rootFolder.id);
      onOpenChange(false);
      
      // Reset form
      setRoomName("");
      setCustomFolders("");
    } catch (error) {
      console.error("Error creating data room:", error);
      toast.error("Erreur lors de la création de la Data Room");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Créer une Data Room
          </DialogTitle>
          <DialogDescription>
            Sélectionnez un template ou créez votre propre structure de dossiers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Room Name */}
          <div className="space-y-2">
            <Label htmlFor="room-name">Nom de la Data Room</Label>
            <Input
              id="room-name"
              placeholder="Ex: Data Room - Acquisition Target Corp"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>

          {/* Template Selection */}
          <div className="space-y-3">
            <Label>Template</Label>
            <RadioGroup
              value={selectedTemplate}
              onValueChange={setSelectedTemplate}
              className="grid grid-cols-2 gap-3"
            >
              {DATA_ROOM_TEMPLATES.map((template) => {
                const Icon = template.icon;
                return (
                  <div key={template.id}>
                    <RadioGroupItem
                      value={template.id}
                      id={template.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={template.id}
                      className={cn(
                        "flex flex-col gap-2 rounded-lg border p-4 cursor-pointer transition-all",
                        "hover:bg-muted/50",
                        "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{template.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {template.description}
                      </span>
                      {template.folders.length > 0 && (
                        <span className="text-xs text-muted-foreground/70">
                          {template.folders.length} dossiers
                        </span>
                      )}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Folder Preview or Custom Input */}
          {selectedTemplate === "custom" ? (
            <div className="space-y-2">
              <Label>Dossiers (un par ligne)</Label>
              <textarea
                className="w-full h-32 p-3 text-sm border rounded-lg resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="01 - Documents&#10;02 - Financiers&#10;03 - Juridique"
                value={customFolders}
                onChange={(e) => setCustomFolders(e.target.value)}
              />
            </div>
          ) : currentTemplate && currentTemplate.folders.length > 0 ? (
            <div className="space-y-2">
              <Label>Structure prévue</Label>
              <div className="max-h-40 overflow-y-auto bg-muted/30 rounded-lg p-3 space-y-1">
                {currentTemplate.folders.map((folder, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FolderOpen className="h-3.5 w-3.5" />
                    {folder}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
            Annuler
          </Button>
          <Button onClick={handleCreate} disabled={isCreating || !roomName.trim()}>
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <FolderPlus className="h-4 w-4 mr-2" />
                Créer la Data Room
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
