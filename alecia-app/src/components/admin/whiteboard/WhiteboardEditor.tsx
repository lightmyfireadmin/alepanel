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
import { Loader2, Save, FolderOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground gap-2 bg-muted/10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Loading Whiteboard...</p>
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
  const [whiteboardName, setWhiteboardName] = useState("New Deal Structure");
  const [savedBoards, setSavedBoards] = useState<SavedBoard[]>([]);
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
      const content = { elements, appState };

      const result = await saveWhiteboardState(whiteboardName, content);

      if (result.success) {
        success("Whiteboard saved", "Your diagram has been saved to Documents.");
        setSaveDialogOpen(false);
      } else {
        error("Save failed", "Could not save the whiteboard.");
      }
    } catch (err) {
      console.error(err);
      error("Error", "An unexpected error occurred while saving.");
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
                appState: content.appState
            });
            success("Loaded", "Whiteboard loaded successfully.");
        }
    } else {
        error("Error", "Failed to load whiteboard content.");
    }
  };

  if (!mounted) return null;

  return (
    <div className="h-[calc(100vh-180px)] w-full flex flex-col gap-4">
      <div className="flex justify-between items-center bg-card p-4 rounded-lg border border-border shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Canvas</h2>
        
        <div className="flex gap-2">
            <Dialog open={loadDialogOpen} onOpenChange={(open) => { setLoadDialogOpen(open); if(open) handleLoadList(); }}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <FolderOpen className="mr-2 h-4 w-4" />
                        Ouvrir
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ouvrir un tableau</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 py-4 max-h-[300px] overflow-y-auto">
                        {loadingList ? (
                            <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
                        ) : savedBoards.length === 0 ? (
                            <p className="text-center text-muted-foreground">Aucun tableau sauvegardé.</p>
                        ) : (
                            savedBoards.map(board => (
                                <div key={board.id} className="flex justify-between items-center p-3 hover:bg-muted rounded-md cursor-pointer border border-transparent hover:border-border" onClick={() => handleLoadBoard(board.id)}>
                                    <span className="font-medium">{board.name}</span>
                                    <span className="text-xs text-muted-foreground">{board.updatedAt ? formatDistanceToNow(new Date(board.updatedAt), { addSuffix: true, locale: fr }) : '-'}</span>
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Save Whiteboard</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                    id="name"
                    value={whiteboardName}
                    onChange={(e) => setWhiteboardName(e.target.value)}
                    placeholder="e.g. Q3 Deal Structure"
                    />
                </div>
                </div>
                <DialogFooter>
                <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save
                </Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        </div>
      </div>

      <div className="flex-1 border border-border rounded-lg overflow-hidden bg-card relative">
         <Excalidraw
           theme={theme === "dark" ? "dark" : "light"}
           excalidrawAPI={(api) => setExcalidrawAPI(api)}
         />
      </div>
    </div>
  );
}
