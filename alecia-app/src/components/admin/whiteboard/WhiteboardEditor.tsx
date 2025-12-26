"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { saveWhiteboardState, getSavedWhiteboards, getWhiteboardContent } from "@/lib/actions/whiteboard";
import { Loader2, Save, FolderOpen, Maximize2, Minimize2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

// Excalidraw must be imported dynamically with SSR disabled
const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground gap-2 bg-muted/10 min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Initialisation du tableau blanc...</p>
      </div>
    ),
  }
);

interface SavedBoard {
  id: string;
  name: string;
  updatedAt: Date | null;
}

export function WhiteboardEditor() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [whiteboardName, setWhiteboardName] = useState("Opération Sans Nom");
  const [savedBoards, setSavedBoards] = useState<SavedBoard[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { theme } = useTheme();
  const { success, error } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = async () => {
    if (!excalidrawAPI || !whiteboardName.trim()) return;

    setSaving(true);
    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();
      const content = { elements, appState, files };

      const result = await saveWhiteboardState(whiteboardName, content);

      if (result.success) {
        success("Tableau sauvegardé", "Votre diagramme a été enregistré dans Documents.");
        setSaveDialogOpen(false);
      } else {
        error("Erreur", "Impossible de sauvegarder le tableau.");
      }
    } catch (err) {
      console.error(err);
      error("Erreur", "Une erreur inattendue est survenue.");
    } finally {
      setSaving(false);
    }
  };

  const handleLoadList = async () => {
    setLoadingList(true);
    const res = await getSavedWhiteboards();
    if (res.success) {
      setSavedBoards(res.data || []);
    }
    setLoadingList(false);
  };

  const handleLoadBoard = async (id: string) => {
    setLoadDialogOpen(false);
    const res = await getWhiteboardContent(id);
    if (res.success && res.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const content = res.data as any;
        if (content.elements) {
            excalidrawAPI.updateScene({
                elements: content.elements,
                appState: { ...content.appState, collaborator: null },
                files: content.files
            });
            success("Chargé", "Le tableau a été chargé avec succès.");
        }
    } else {
        error("Erreur", "Impossible de charger le contenu.");
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!mounted) return null;

  return (
    <div className={`flex flex-col gap-4 transition-all duration-300 ${
      isFullscreen 
        ? "fixed inset-0 z-9999 bg-background p-4" 
        : "h-[calc(100vh-200px)] min-h-[600px] w-full"
    }`}>
      {/* TOOLBAR */}
      <div className="flex justify-between items-center bg-card p-3 rounded-xl border border-border shadow-sm shrink-0">
        <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Maximize2 className="w-4 h-4" />
            </div>
            <div>
                <h2 className="text-sm font-bold text-foreground leading-none">{whiteboardName}</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">Éditeur de structure Alecia</p>
            </div>
        </div>
        
        <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={toggleFullscreen} title={isFullscreen ? "Réduire" : "Plein écran"}>
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>

            <Dialog open={loadDialogOpen} onOpenChange={(open) => { setLoadDialogOpen(open); if(open) handleLoadList(); }}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <FolderOpen className="mr-2 h-4 w-4" />
                        Ouvrir
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Mes Tableaux</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 py-4 max-h-[400px] overflow-y-auto">
                        {loadingList ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                        ) : savedBoards.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>Aucun tableau sauvegardé.</p>
                            </div>
                        ) : (
                            savedBoards.map(board => (
                                <div 
                                    key={board.id} 
                                    className="flex justify-between items-center p-4 hover:bg-primary/5 rounded-xl cursor-pointer border border-transparent hover:border-primary/20 transition-all group" 
                                    onClick={() => handleLoadBoard(board.id)}
                                >
                                    <span className="font-semibold group-hover:text-primary transition-colors">{board.name}</span>
                                    <span className="text-xs text-muted-foreground">{board.updatedAt ? formatDistanceToNow(new Date(board.updatedAt), { addSuffix: true, locale: fr }) : '-'}</span>
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Enregistrer le tableau</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nom du diagramme</Label>
                    <Input
                    id="name"
                    value={whiteboardName}
                    onChange={(e) => setWhiteboardName(e.target.value)}
                    placeholder="ex: Structure Deal Projet X"
                    />
                </div>
                </div>
                <DialogFooter>
                <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enregistrer
                </Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        </div>
      </div>

      {/* CANVAS CONTAINER */}
      <div className="flex-1 border border-border rounded-xl overflow-hidden bg-card relative isolate shadow-inner">
         <Excalidraw
           theme={theme === "dark" ? "dark" : "light"}
           excalidrawAPI={(api) => setExcalidrawAPI(api)}
           initialData={{
             appState: {
               viewBackgroundColor: theme === "dark" ? "#020617" : "#ffffff",
               currentItemFontFamily: 1,
             }
           }}
           UIOptions={{
             canvasActions: {
               saveToActiveFile: false,
               loadScene: false,
               export: { saveFileToDisk: true },
               toggleTheme: false, // We control theme via next-themes
             },
           }}
         />
      </div>
      
      <style jsx global>{`
        .excalidraw {
            --color-primary: var(--primary);
            --color-primary-darker: var(--primary);
            --color-primary-darkest: var(--primary);
        }
        /* Fix for Excalidraw in flex container */
        .excalidraw-wrapper {
            height: 100% !important;
            width: 100% !important;
        }
      `}</style>
    </div>
  );
}