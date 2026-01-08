"use client";

import { useState } from "react";
import { MessageSquare, Send, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";

interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  isEdited?: boolean;
}

interface CommentsThreadProps {
  entityType: "deal" | "company" | "contact";
  entityId: string;
  className?: string;
}

// Mock comments for demo
const mockComments: Comment[] = [
  {
    id: "1",
    content: "La valorisation semble élevée par rapport aux comparables du secteur. Proposer un multiple de 6x EBITDA plutôt que 8x.",
    authorId: "user1",
    authorName: "Marie Dupont",
    authorAvatar: undefined,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "2",
    content: "D'accord avec Marie. J'ai mis à jour le modèle avec les nouveaux multiples. @Jean peux-tu vérifier les hypothèses de croissance ?",
    authorId: "user2",
    authorName: "Pierre Martin",
    authorAvatar: undefined,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    isEdited: true,
  },
];

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes}m`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  return date.toLocaleDateString("fr-FR");
}

export function CommentsThread({
  entityType,
  entityId,
  className = "",
}: CommentsThreadProps) {
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [comments, setComments] = useState<Comment[]>(mockComments);

  // In full implementation, use these:
  // const commentsData = useQuery(api.comments.getComments, { entityType, entityId });
  // const addComment = useMutation(api.comments.addComment);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    // Add optimistic comment
    const newCommentObj: Comment = {
      id: Date.now().toString(),
      content: newComment,
      authorId: "current",
      authorName: "Moi",
      createdAt: new Date(),
    };

    setComments((prev) => [...prev, newCommentObj]);
    setNewComment("");
    toast.success("Commentaire ajouté");
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = (id: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, content: editContent, isEdited: true } : c
      )
    );
    setEditingId(null);
    setEditContent("");
    toast.success("Commentaire modifié");
  };

  const handleDelete = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    toast.success("Commentaire supprimé");
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Commentaires ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comments List */}
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun commentaire. Soyez le premier à commenter !
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={comment.authorAvatar} />
                    <AvatarFallback className="text-xs">
                      {comment.authorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {comment.authorName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(comment.createdAt)}
                        </span>
                        {comment.isEdited && (
                          <span className="text-xs text-muted-foreground">
                            (modifié)
                          </span>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(comment)}>
                            <Pencil className="h-3 w-3 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(comment.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {editingId === comment.id ? (
                      <div className="mt-1 space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[60px] text-sm"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(comment.id)}
                          >
                            Enregistrer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* New Comment Input */}
        <div className="flex gap-2 pt-2 border-t">
          <Textarea
            placeholder="Ajouter un commentaire... (utilisez @ pour mentionner)"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[60px] text-sm flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleSubmit();
              }
            }}
          />
          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Appuyez sur Cmd+Entrée pour envoyer
        </p>
      </CardContent>
    </Card>
  );
}
