"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Newspaper, Calendar, Search, Eye, EyeOff, ExternalLink, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPost, updatePost, deletePost, togglePostPublish, type PostFormData } from "@/lib/actions/posts";

interface NewsArticle {
  id: string;
  titleFr: string;
  titleEn?: string | null;
  slug: string;
  excerpt?: string | null;
  contentFr: string;
  contentEn?: string | null;
  category?: string | null;
  coverImage?: string | null;
  isPublished: boolean;
  publishedAt?: Date | null;
}

interface NewsClientProps {
  initialArticles: NewsArticle[];
}

const EMPTY_ARTICLE: NewsArticle = {
  id: "",
  titleFr: "",
  titleEn: "",
  slug: "",
  excerpt: "",
  contentFr: "",
  contentEn: "",
  category: "Communiqué",
  coverImage: "",
  isPublished: false,
  publishedAt: new Date(),
};

const CATEGORIES = [
  { value: "Communiqué", label: "Communiqué de presse" },
  { value: "Analyse", label: "Analyse de marché" },
  { value: "Point de vue", label: "Point de vue" },
  { value: "Guide", label: "Guide pratique" },
];

export default function NewsClient({ initialArticles }: NewsClientProps) {
  const router = useRouter();
  const [articles, setArticles] = useState<NewsArticle[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [formData, setFormData] = useState<NewsArticle>(EMPTY_ARTICLE);
  const [isLoading, setIsLoading] = useState(false);

  const filteredArticles = articles.filter((article) =>
    article.titleFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (article.category && article.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const publishedCount = articles.filter((a) => a.isPublished).length;

  const handleOpenDialog = (article?: NewsArticle) => {
    if (article) {
      setEditingArticle(article);
      setFormData({ ...article });
    } else {
      setEditingArticle(null);
      setFormData({ ...EMPTY_ARTICLE });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const postData: PostFormData = {
        slug: formData.slug,
        titleFr: formData.titleFr,
        titleEn: formData.titleEn,
        contentFr: formData.contentFr,
        contentEn: formData.contentEn,
        excerpt: formData.excerpt,
        coverImage: formData.coverImage,
        category: formData.category,
        publishedAt: formData.publishedAt,
        isPublished: formData.isPublished,
      };

      if (editingArticle) {
        const result = await updatePost(editingArticle.id, postData);
        if (result.success) {
          setArticles((prev) =>
            prev.map((a) => (a.id === editingArticle.id ? { ...formData, id: editingArticle.id } : a))
          );
          setIsDialogOpen(false);
          setFormData(EMPTY_ARTICLE);
          router.refresh();
        } else {
          alert("Erreur lors de la mise à jour : " + result.error);
        }
      } else {
        const result = await createPost(postData);
        if (result.success && result.id) {
          setArticles((prev) => [...prev, { ...formData, id: result.id! }]);
          setIsDialogOpen(false);
          setFormData(EMPTY_ARTICLE);
          router.refresh();
        } else {
          alert("Erreur lors de la création : " + result.error);
        }
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer cet article ?")) {
      setIsLoading(true);
      try {
        const result = await deletePost(id);
        if (result.success) {
          setArticles((prev) => prev.filter((a) => a.id !== id));
          router.refresh();
        } else {
          alert("Erreur lors de la suppression : " + result.error);
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Une erreur est survenue.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const togglePublishedState = async (id: string, currentState: boolean) => {
    try {
      const result = await togglePostPublish(id, !currentState);
      if (result.success) {
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? { ...a, isPublished: !currentState } : a))
        );
        router.refresh();
      } else {
        alert("Erreur lors de la modification : " + result.error);
      }
    } catch (error) {
      console.error("Error toggling publish:", error);
      alert("Une erreur est survenue.");
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60);
  };

  // Helper to format date for input type="date"
  const formatDateForInput = (date?: Date | null) => {
    if (!date) return new Date().toISOString().split("T")[0];
    try {
        return new Date(date).toISOString().split("T")[0];
    } catch (e) {
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <Newspaper className="w-6 h-6" />
            Actualités &amp; Articles
          </h1>
          <p className="text-[var(--foreground-muted)]">
            {publishedCount} article{publishedCount > 1 ? "s" : ""} publié{publishedCount > 1 ? "s" : ""} sur {articles.length}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="btn-gold">
              <Plus className="w-4 h-4 mr-2" />
              Nouvel article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[var(--card)] border-[var(--border)]">
            <DialogHeader>
              <DialogTitle className="text-[var(--foreground)]">
                {editingArticle ? "Modifier l'article" : "Nouvel article"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Titre (FR) *</Label>
                  <Input
                    value={formData.titleFr}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData({
                        ...formData,
                        titleFr: title,
                        slug: formData.slug || generateSlug(title),
                      });
                    }}
                    placeholder="Titre de l'article"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Titre (EN)</Label>
                  <Input
                    value={formData.titleEn || ""}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="Article title"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Slug (URL) *</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="mon-article"
                  />
                  <p className="text-xs text-[var(--foreground-muted)]">
                    URL: /actualites/{formData.slug || "..."}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Catégorie *</Label>
                  <Select
                    value={formData.category || ""}
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

               {/* Cover Image */}
               <div className="space-y-2">
                  <Label>Image de couverture (URL)</Label>
                  <Input
                    value={formData.coverImage || ""}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://..."
                  />
                  {formData.coverImage && (
                    <div className="mt-2 h-32 w-full relative border rounded bg-white overflow-hidden">
                       <img src={formData.coverImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
               </div>

              {/* Excerpt */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Extrait (FR) *</Label>
                  <Textarea
                    value={formData.excerpt || ""}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={2}
                    placeholder="Résumé court pour les listings (150 car. max)"
                  />
                </div>
                {/* Note: Excerpt EN is not in Schema currently, using contentEn for now or ignoring */}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label>Contenu (FR) *</Label>
                <Textarea
                  value={formData.contentFr}
                  onChange={(e) => setFormData({ ...formData, contentFr: e.target.value })}
                  rows={8}
                  placeholder="Contenu complet de l'article (Markdown supporté)"
                />
                <p className="text-xs text-[var(--foreground-muted)]">
                  Supporte le format Markdown : **gras**, *italique*, [lien](url), etc.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Contenu (EN)</Label>
                <Textarea
                  value={formData.contentEn || ""}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  rows={6}
                  placeholder="Full article content (Markdown supported)"
                />
              </div>

              {/* Status & Date */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Date de publication</Label>
                  <Input
                    type="date"
                    value={formatDateForInput(formData.publishedAt)}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.valueAsDate })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-[var(--background-secondary)] rounded-lg">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">Publier</p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      L&apos;article sera visible sur le site
                    </p>
                  </div>
                  <Switch
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t border-[var(--border)]">
                <Button variant="outline" asChild>
                  <a href={`/actualites/${formData.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Prévisualiser
                  </a>
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="btn-gold"
                    disabled={!formData.titleFr || !formData.slug || !formData.contentFr || isLoading}
                  >
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {editingArticle ? "Mettre à jour" : "Créer"}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
        <Input
          placeholder="Rechercher un article..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <Card key={article.id} className={`bg-[var(--card)] border-[var(--border)] ${!article.isPublished ? "opacity-70" : ""}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg text-[var(--foreground)] line-clamp-1">{article.titleFr}</CardTitle>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[var(--foreground-muted)]">
                    <Badge variant="outline" className="bg-[var(--accent)]/10 text-[var(--accent)]">
                      {article.category}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("fr-FR") : "N/A"}
                    </span>
                    <Badge variant={article.isPublished ? "default" : "secondary"} className={article.isPublished ? "bg-green-500/10 text-green-500" : ""}>
                      {article.isPublished ? "Publié" : "Brouillon"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePublishedState(article.id, article.isPublished)}
                    className="h-8 w-8 p-0"
                    title={article.isPublished ? "Dépublier" : "Publier"}
                  >
                    {article.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(article)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(article.id)}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--foreground-muted)] line-clamp-2">
                {article.excerpt}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 text-[var(--foreground-muted)]">
          Aucun article trouvé
        </div>
      )}
    </div>
  );
}
