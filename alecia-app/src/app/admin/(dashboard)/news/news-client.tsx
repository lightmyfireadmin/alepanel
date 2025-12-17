"use client";

import { useState } from "react";
import Breadcrumb from "@/components/admin/ui/Breadcrumb";
import {
  Plus, Pencil, Trash2, Newspaper, Calendar, Search, Eye, EyeOff, ExternalLink, Loader2, Image as ImageIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createPost, updatePost, deletePost, togglePostPublish, type PostFormData } from "@/lib/actions/posts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const formatDateForInput = (date?: Date | null) => {
    if (!date) return new Date().toISOString().split("T")[0];
    try {
        return new Date(date).toISOString().split("T")[0];
    } catch (e) {
        return "";
    }
  };

  return (
    <>
      <Breadcrumb pageName="News Management" />

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between mb-5">
         <div className="relative w-full md:w-1/3">
             <input
                 type="text"
                 placeholder="Search articles..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full rounded-md border border-stroke bg-transparent py-2.5 px-5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary"
             />
             <Search className="absolute right-4 top-3 text-bodydark2 w-5 h-5" />
         </div>

         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button onClick={() => handleOpenDialog()} className="rounded-md bg-primary py-3 px-6 font-medium text-white hover:bg-opacity-90 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Article
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-boxdark border-stroke dark:border-strokedark text-black dark:text-white">
            <DialogHeader>
              <DialogTitle className="text-black dark:text-white">
                {editingArticle ? "Edit Article" : "New Article"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
               {/* Simplified Form Wrapper for consistency */}
               <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                      <Label className="text-black dark:text-white">Title (FR)</Label>
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
                        className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      />
                  </div>
                  <div className="space-y-2">
                      <Label className="text-black dark:text-white">Category</Label>
                      <Select
                            value={formData.category || ""}
                            onValueChange={(v) => setFormData({ ...formData, category: v })}
                        >
                            <SelectTrigger className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white">
                            <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                            {CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                  </div>
               </div>

               <div className="grid gap-4 md:grid-cols-2">
                   <div className="space-y-2">
                      <Label className="text-black dark:text-white">Slug</Label>
                      <Input
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      />
                   </div>
                   <div className="space-y-2">
                       <Label className="text-black dark:text-white">Publish Date</Label>
                       <Input
                            type="date"
                            value={formatDateForInput(formData.publishedAt)}
                            onChange={(e) => setFormData({ ...formData, publishedAt: e.target.valueAsDate })}
                            className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white"
                        />
                   </div>
               </div>

               <div className="space-y-2">
                    <Label className="text-black dark:text-white">Excerpt (FR)</Label>
                    <Textarea
                        value={formData.excerpt || ""}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        rows={2}
                        className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    />
               </div>

               <div className="space-y-2">
                    <Label className="text-black dark:text-white">Content (FR)</Label>
                    <Textarea
                        value={formData.contentFr}
                        onChange={(e) => setFormData({ ...formData, contentFr: e.target.value })}
                        rows={6}
                        className="border-stroke dark:border-strokedark dark:bg-meta-4 dark:text-white"
                    />
               </div>

                <div className="flex items-center gap-4 py-2">
                   <Label className="text-black dark:text-white">Published</Label>
                   <Switch
                        checked={formData.isPublished}
                        onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-stroke dark:border-strokedark">
                    <button
                        onClick={() => setIsDialogOpen(false)}
                        className="rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Save"}
                    </button>
                </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
                <thead>
                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                        <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Article</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Category</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Published Date</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                        <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredArticles.map((article) => (
                        <tr key={article.id} className="border-b border-[#eee] dark:border-strokedark last:border-0">
                            <td className="py-5 px-4 pl-9 xl:pl-11">
                                <h5 className="font-medium text-black dark:text-white line-clamp-1">{article.titleFr}</h5>
                                <p className="text-sm text-bodydark2 line-clamp-1">{article.slug}</p>
                            </td>
                            <td className="py-5 px-4">
                                <p className="text-black dark:text-white">{article.category}</p>
                            </td>
                            <td className="py-5 px-4">
                                <p className="text-black dark:text-white">
                                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("fr-FR") : "N/A"}
                                </p>
                            </td>
                            <td className="py-5 px-4">
                                <span className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                                    article.isPublished ? "bg-success text-success" : "bg-warning text-warning"
                                }`}>
                                    {article.isPublished ? "Published" : "Draft"}
                                </span>
                            </td>
                            <td className="py-5 px-4">
                                <div className="flex items-center space-x-3.5">
                                    <button
                                        onClick={() => togglePublishedState(article.id, article.isPublished)}
                                        className="hover:text-primary"
                                        title={article.isPublished ? "Unpublish" : "Publish"}
                                    >
                                        {article.isPublished ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                    <button onClick={() => handleOpenDialog(article)} className="hover:text-primary">
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(article.id)} className="hover:text-danger">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
             {filteredArticles.length === 0 && (
                 <div className="py-10 text-center text-bodydark2">
                     No articles found.
                 </div>
             )}
        </div>
      </div>
    </>
  );
}
