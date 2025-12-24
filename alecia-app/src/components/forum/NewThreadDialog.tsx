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
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Plus, Loader2 } from "lucide-react";
import { createThread } from "@/lib/actions/forum";
import { useToast } from "@/components/ui/toast";

interface NewThreadDialogProps {
  categorySlug: string;
  categoryName: string;
}

export function NewThreadDialog({ categorySlug, categoryName }: NewThreadDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();
  const { success, error: errorToast } = useToast();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    const result = await createThread(categorySlug, title, content);
    
    if (result.success && result.threadId) {
      setOpen(false);
      setTitle("");
      setContent("");
      router.push(`/admin/forum/thread/${result.threadId}`);
      success("Discussion créée", "Votre sujet a été publié.");
    } else {
      errorToast("Erreur", result.error || "Impossible de créer la discussion.");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-gold">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau sujet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-[var(--card)] border-[var(--border)]">
        <DialogHeader>
          <DialogTitle>Nouvelle discussion dans {categoryName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Titre du sujet</Label>
            <Input 
                placeholder="Ex: Mise à jour deal Projet Alpha..." 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <RichTextEditor 
                content={content} 
                onChange={setContent} 
                placeholder="Détaillez votre sujet..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !title || !content} className="bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-white">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Publier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
