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
import { Plus, Pencil, Trash2, Newspaper, Calendar, Search, Eye, EyeOff, ExternalLink } from "lucide-react";

interface NewsArticle {
  id: string;
  titleFr: string;
  titleEn: string;
  slug: string;
  excerptFr: string;
  excerptEn: string;
  contentFr: string;
  contentEn: string;
  category: string;
  imageUrl: string;
  isPublished: boolean;
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
}

const INITIAL_ARTICLES: NewsArticle[] = [
  {
    id: "1",
    titleFr: "alecia conseille SAFE GROUPE dans le cadre de l'acquisition de Dogs Security",
    titleEn: "alecia advises SAFE GROUPE on the acquisition of Dogs Security",
    slug: "safe-groupe-dogs-security",
    excerptFr: "alecia a accompagné SAFE GROUPE, acteur majeur de la sécurité privée, dans l'acquisition stratégique de Dogs Security.",
    excerptEn: "alecia advised SAFE GROUPE, a major player in private security, on the strategic acquisition of Dogs Security.",
    contentFr: "alecia a eu le plaisir d'accompagner SAFE GROUPE dans le cadre de cette opération structurante...",
    contentEn: "alecia was pleased to advise SAFE GROUPE on this structuring transaction...",
    category: "Communiqué",
    imageUrl: "",
    isPublished: true,
    publishedAt: "2024-12-12",
    metaTitle: "alecia conseille SAFE GROUPE | Acquisition Dogs Security",
    metaDescription: "alecia a accompagné SAFE GROUPE dans l'acquisition de Dogs Security, consolidant sa position sur le marché de la sécurité privée.",
  },
  {
    id: "2",
    titleFr: "Les multiples de valorisation dans le secteur Tech en 2024",
    titleEn: "Tech sector valuation multiples in 2024",
    slug: "multiples-valorisation-tech-2024",
    excerptFr: "Analyse des tendances de valorisation dans le secteur technologique français pour l'année 2024.",
    excerptEn: "Analysis of valuation trends in the French technology sector for 2024.",
    contentFr: "Le secteur technologique français continue d'attirer l'intérêt des investisseurs...",
    contentEn: "The French technology sector continues to attract investor interest...",
    category: "Analyse",
    imageUrl: "",
    isPublished: false,
    publishedAt: "2024-12-10",
    metaTitle: "Valorisation Tech 2024 | alecia",
    metaDescription: "Découvrez notre analyse des multiples de valorisation dans le secteur technologique français en 2024.",
  },
];

const EMPTY_ARTICLE: NewsArticle = {
  id: "",
  titleFr: "",
  titleEn: "",
  slug: "",
  excerptFr: "",
  excerptEn: "",
  contentFr: "",
  contentEn: "",
  category: "Communiqué",
  imageUrl: "",
  isPublished: false,
  publishedAt: new Date().toISOString().split("T")[0],
  metaTitle: "",
  metaDescription: "",
};

const CATEGORIES = [
  { value: "Communiqué", label: "Communiqué de presse" },
  { value: "Analyse", label: "Analyse de marché" },
  { value: "Point de vue", label: "Point de vue" },
  { value: "Guide", label: "Guide pratique" },
];

export default function NewsAdminPage() {
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_ARTICLES);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [formData, setFormData] = useState<NewsArticle>(EMPTY_ARTICLE);

  const filteredArticles = articles.filter((article) =>
    article.titleFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publishedCount = articles.filter((a) => a.isPublished).length;

  const handleOpenDialog = (article?: NewsArticle) => {
    if (article) {
      setEditingArticle(article);
      setFormData({ ...article });
    } else {
      setEditingArticle(null);
      setFormData({ ...EMPTY_ARTICLE, id: Date.now().toString() });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingArticle) {
      setArticles((prev) =>
        prev.map((a) => (a.id === formData.id ? { ...formData } : a))
      );
    } else {
      setArticles((prev) => [...prev, formData]);
    }
    setIsDialogOpen(false);
    setFormData(EMPTY_ARTICLE);
  };

  const handleDelete = (id: string) => {
    if (confirm("Supprimer cet article ?")) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const togglePublished = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isPublished: !a.isPublished } : a))
    );
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
                        metaTitle: formData.metaTitle || title,
                      });
                    }}
                    placeholder="Titre de l'article"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Titre (EN)</Label>
                  <Input
                    value={formData.titleEn}
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
                    value={formData.category}
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

              {/* Excerpt */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Extrait (FR) *</Label>
                  <Textarea
                    value={formData.excerptFr}
                    onChange={(e) => setFormData({ ...formData, excerptFr: e.target.value })}
                    rows={2}
                    placeholder="Résumé court pour les listings (150 car. max)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Extrait (EN)</Label>
                  <Textarea
                    value={formData.excerptEn}
                    onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                    rows={2}
                    placeholder="Short summary for listings"
                  />
                </div>
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
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  rows={6}
                  placeholder="Full article content (Markdown supported)"
                />
              </div>

              {/* SEO */}
              <div className="p-4 bg-[var(--background-secondary)] rounded-lg space-y-4">
                <h4 className="font-medium text-[var(--foreground)]">SEO</h4>
                <div className="space-y-2">
                  <Label>Meta title</Label>
                  <Input
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="Titre pour les moteurs de recherche (60 car.)"
                  />
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {formData.metaTitle.length}/60 caractères
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Meta description</Label>
                  <Textarea
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    rows={2}
                    placeholder="Description pour les moteurs de recherche (160 car.)"
                  />
                  <p className="text-xs text-[var(--foreground-muted)]">
                    {formData.metaDescription.length}/160 caractères
                  </p>
                </div>
              </div>

              {/* Status & Date */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Date de publication</Label>
                  <Input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
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
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    className="btn-gold" 
                    disabled={!formData.titleFr || !formData.slug || !formData.excerptFr}
                  >
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
                      {new Date(article.publishedAt).toLocaleDateString("fr-FR")}
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
                    onClick={() => togglePublished(article.id)}
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
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--foreground-muted)] line-clamp-2">
                {article.excerptFr}
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
