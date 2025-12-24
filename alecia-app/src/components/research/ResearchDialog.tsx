"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { startResearch } from "@/lib/actions/research";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export function ResearchDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { success, error: errorToast } = useToast();

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setLoading(true);
    const result = await startResearch(query);
    
    if (result.success && result.taskId) {
      setOpen(false);
      setQuery("");
      router.push(`/admin/research/${result.taskId}`);
      success("Recherche lancée", "Les agents AI sont au travail.");
    } else {
      errorToast("Erreur", result.error || "Impossible de lancer la recherche.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-gold">
          <Sparkles className="w-4 h-4 mr-2" />
          Nouvelle étude
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[var(--card)] border-[var(--border)]">
        <DialogHeader>
          <DialogTitle>Market Intelligence AI</DialogTitle>
          <DialogDescription>
            Lancez une étude de marché, une analyse concurrentielle ou une recherche de cibles.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Votre demande</Label>
            <Textarea 
                placeholder="Ex: Analyse le marché des logiciels RH en France pour les PME du BTP. Identifie les acteurs clés et les tendances de consolidation." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-32"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !query} className="bg-[var(--accent)] text-white">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Lancer l&apos;analyse
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
