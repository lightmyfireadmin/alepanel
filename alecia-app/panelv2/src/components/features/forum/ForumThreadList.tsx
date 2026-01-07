"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { MessageSquare, Plus, Pin, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function ForumThreadList() {
  const threads = useQuery(api.forum.getThreads, {});
  const createThread = useMutation(api.forum.createThread);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const handleCreate = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Titre et contenu requis");
      return;
    }

    try {
      await createThread({
        title: newTitle,
        initialPostContent: newContent,
      });
      toast.success("Discussion créée !");
      setIsDialogOpen(false);
      setNewTitle("");
      setNewContent("");
    } catch (e) {
      toast.error("Erreur lors de la création");
    }
  };

  if (!threads) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Chargement...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Discussions</h2>
          <p className="text-sm text-muted-foreground">
            Forum interne pour l'équipe
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle discussion
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une discussion</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Titre de la discussion"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <Textarea
                placeholder="Écrivez votre message..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={5}
              />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreate}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Thread List */}
      {threads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucune discussion</p>
            <p className="text-sm text-muted-foreground">
              Créez la première discussion !
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {threads.map((thread) => (
            <Card
              key={thread._id}
              className="hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={thread.authorAvatar} />
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {thread.isPinned && (
                          <Pin className="w-3 h-3 text-primary" />
                        )}
                        {thread.isLocked && (
                          <Lock className="w-3 h-3 text-muted-foreground" />
                        )}
                        <h3 className="font-semibold truncate">{thread.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Par {thread.authorName} •{" "}
                        {formatDistanceToNow(thread._creationTime, {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    <span>{thread.postCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
