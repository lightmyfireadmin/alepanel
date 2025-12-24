"use client";

import { useState } from "react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Button } from "@/components/ui/button";
import { createPost } from "@/lib/actions/forum";
import { Loader2, Send } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export function ThreadReply({ threadId }: { threadId: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { success, error: errorToast } = useToast();

  const handleReply = async () => {
    if (!content.trim()) return;

    setLoading(true);
    const result = await createPost(threadId, content);
    
    if (result.success) {
      setContent(""); // Clear editor
      success("Réponse envoyée", "Votre message a été publié.");
    } else {
      errorToast("Erreur", "Impossible d'envoyer la réponse.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-1">
        <RichTextEditor 
            content={content} 
            onChange={setContent} 
            placeholder="Écrivez votre réponse..."
            className="border-0 shadow-none"
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={handleReply} disabled={loading || !content.trim()} className="bg-[var(--accent)] text-white">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            Répondre
        </Button>
      </div>
    </div>
  );
}
