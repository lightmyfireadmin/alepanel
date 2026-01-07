"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Pencil,
  Trash2,
  Music,
  Image as ImageIcon,
  GripVertical,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface TileForm {
  title: string;
  description: string;
  imageUrl: string;
  soundUrl: string;
}

const emptyForm: TileForm = {
  title: "",
  description: "",
  imageUrl: "",
  soundUrl: "",
};

export default function TilesPage() {
  const tiles = useQuery(api.tiles.list);
  const createTile = useMutation(api.tiles.create);
  const updateTile = useMutation(api.tiles.update);
  const deleteTile = useMutation(api.tiles.remove);

  const [editingId, setEditingId] = useState<Id<"marketing_tiles"> | null>(null);
  const [form, setForm] = useState<TileForm>(emptyForm);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<Id<"marketing_tiles"> | null>(null);
  const [saving, setSaving] = useState(false);

  const handleCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsDialogOpen(true);
  };

  const handleEdit = (tile: typeof tiles extends (infer T)[] | undefined ? T : never) => {
    if (!tile) return;
    setEditingId(tile._id);
    setForm({
      title: tile.title,
      description: tile.description || "",
      imageUrl: tile.imageUrl || "",
      soundUrl: tile.soundUrl || "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title) {
      toast.error("Le titre est requis");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateTile({
          id: editingId,
          title: form.title,
          description: form.description || undefined,
          imageUrl: form.imageUrl || undefined,
          soundUrl: form.soundUrl || undefined,
        });
        toast.success("Tuile mise à jour");
      } else {
        await createTile({
          title: form.title,
          description: form.description || undefined,
          imageUrl: form.imageUrl || undefined,
          soundUrl: form.soundUrl || undefined,
        });
        toast.success("Tuile créée");
      }
      setIsDialogOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTile({ id: deleteId });
      toast.success("Tuile supprimée");
      setDeleteId(null);
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Galerie ambiance</h1>
          <p className="text-muted-foreground">
            Gérez les tuiles visuelles et sonores du site marketing
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle tuile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Modifier la tuile" : "Nouvelle tuile"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex: Ambiance bureau"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL de l&apos;image</Label>
                <Input
                  id="imageUrl"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="soundUrl">URL du son</Label>
                <Input
                  id="soundUrl"
                  value={form.soundUrl}
                  onChange={(e) => setForm({ ...form, soundUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              {form.imageUrl && (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={form.imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {editingId ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <p className="text-sm text-muted-foreground">
        {tiles?.length || 0} tuile{(tiles?.length || 0) > 1 ? "s" : ""}
      </p>

      {/* Tiles Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tiles?.map((tile) => (
          <Card
            key={tile._id}
            className="group relative overflow-hidden hover:ring-2 hover:ring-primary transition-all"
          >
            {/* Drag Handle */}
            <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="p-1 rounded bg-black/50 text-white cursor-move">
                <GripVertical className="w-4 h-4" />
              </div>
            </div>

            {/* Actions */}
            <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleEdit(tile)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={() => setDeleteId(tile._id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Image */}
            <div className="aspect-square relative bg-muted">
              {tile.imageUrl ? (
                <Image
                  src={tile.imageUrl}
                  alt={tile.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Info */}
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm truncate">{tile.title}</h3>
                {tile.soundUrl && (
                  <Music className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
              </div>
              {tile.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {tile.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {tiles?.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucune tuile</p>
          <Button variant="link" onClick={handleCreate} className="mt-2">
            <Plus className="w-4 h-4 mr-2" />
            Créer une première tuile
          </Button>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette tuile ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La tuile sera définitivement
              supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
