import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Actualités",
};

// Mock data
const posts = [
  {
    id: "1",
    title: "alecia conseille SAFE GROUPE dans le cadre de l'acquisition de Dogs Security",
    category: "Communiqué",
    publishedAt: "2024-12-12",
    isPublished: true,
  },
];

export default function AdminNewsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] font-[family-name:var(--font-playfair)]">
            Actualités
          </h1>
          <p className="text-[var(--foreground-muted)] mt-1">
            Gérez les articles et communiqués
          </p>
        </div>
        <Button asChild className="btn-gold rounded-lg">
          <Link href="/admin/news/new">
            <Plus className="w-4 h-4 mr-2" />
            Nouvel article
          </Link>
        </Button>
      </div>

      {/* Table Card */}
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--foreground)]">
            {posts.length} article{posts.length > 1 ? "s" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[var(--border)]">
                <TableHead className="text-[var(--foreground-muted)]">Titre</TableHead>
                <TableHead className="text-[var(--foreground-muted)]">Catégorie</TableHead>
                <TableHead className="text-[var(--foreground-muted)]">Date</TableHead>
                <TableHead className="text-[var(--foreground-muted)]">Statut</TableHead>
                <TableHead className="text-[var(--foreground-muted)] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id} className="border-[var(--border)]">
                  <TableCell className="font-medium text-[var(--foreground)] max-w-md truncate">
                    {post.title}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-[var(--accent)]/10 text-[var(--accent)]"
                    >
                      {post.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[var(--foreground-muted)]">
                    {post.publishedAt}
                  </TableCell>
                  <TableCell>
                    {post.isPublished ? (
                      <div className="flex items-center gap-1 text-emerald-400">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">Publié</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[var(--foreground-muted)]">
                        <EyeOff className="w-4 h-4" />
                        <span className="text-sm">Brouillon</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                      >
                        <Link href={`/admin/news/${post.id}/edit`}>
                          <Pencil className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[var(--foreground-muted)] hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
