"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Eye, Edit2, Globe, Lock } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: "Brouillon", color: "bg-slate-100 text-slate-700", icon: <Lock className="w-3 h-3" /> },
  published: { label: "Publié", color: "bg-green-100 text-green-700", icon: <Globe className="w-3 h-3" /> },
  archived: { label: "Archivé", color: "bg-amber-100 text-amber-700", icon: <FileText className="w-3 h-3" /> },
};

export default function BlogPage() {
  const posts = useQuery(api.blog.getPosts, {});
  const createPost = useMutation(api.blog.createPost);
  const generateSlug = useMutation(api.blog.generateSlug);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newExcerpt, setNewExcerpt] = useState("");
  const [newStatus, setNewStatus] = useState<"draft" | "published">("draft");

  const handleTitleChange = async (title: string) => {
    setNewTitle(title);
    if (title.length > 3) {
      const slug = await generateSlug({ title });
      setNewSlug(slug);
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Titre et contenu requis");
      return;
    }

    try {
      await createPost({
        title: newTitle,
        slug: newSlug || newTitle.toLowerCase().replace(/\s+/g, "-"),
        content: newContent,
        excerpt: newExcerpt || undefined,
        status: newStatus,
      });
      toast.success(newStatus === "published" ? "Article publié !" : "Brouillon enregistré");
      setIsDialogOpen(false);
      setNewTitle("");
      setNewSlug("");
      setNewContent("");
      setNewExcerpt("");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const draftPosts = posts?.filter((p: { status: string }) => p.status === "draft") ?? [];
  const publishedPosts = posts?.filter((p: { status: string }) => p.status === "published") ?? [];

  return (
    <div className="h-full flex flex-col p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
          <p className="text-muted-foreground">Gérez vos articles et publications.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvel article
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un article</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Titre</label>
                  <Input
                    placeholder="Titre de l'article"
                    value={newTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <Input
                    placeholder="url-de-l-article"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Extrait</label>
                <Textarea
                  placeholder="Résumé de l'article pour l'aperçu..."
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contenu</label>
                <Textarea
                  placeholder="Écrivez votre article..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>
              <Select value={newStatus} onValueChange={(v: any) => setNewStatus(v)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publier maintenant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreate}>
                {newStatus === "published" ? "Publier" : "Enregistrer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Tous ({posts?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="draft">Brouillons ({draftPosts.length})</TabsTrigger>
          <TabsTrigger value="published">Publiés ({publishedPosts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <PostGrid posts={posts ?? []} />
        </TabsContent>
        <TabsContent value="draft" className="mt-4">
          <PostGrid posts={draftPosts} />
        </TabsContent>
        <TabsContent value="published" className="mt-4">
          <PostGrid posts={publishedPosts} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PostGrid({ posts }: { posts: any[] }) {
  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <FileText className="w-10 h-10 mx-auto mb-2 opacity-50" />
          Aucun article
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => {
        const statusConfig = STATUS_CONFIG[post.status];
        return (
          <Card key={post._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base leading-tight line-clamp-2">
                  {post.title}
                </CardTitle>
                <Badge className={`shrink-0 gap-1 ${statusConfig.color}`}>
                  {statusConfig.icon}
                  {statusConfig.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {post.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Par {post.authorName}</span>
                <span>
                  {formatDistanceToNow(post._creationTime, { addSuffix: true, locale: fr })}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit2 className="w-3 h-3 mr-1" />
                  Éditer
                </Button>
                {post.status === "published" && (
                  <Button variant="ghost" size="sm">
                    <Eye className="w-3 h-3 mr-1" />
                    Voir
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
