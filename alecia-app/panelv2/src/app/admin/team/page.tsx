"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  MoreHorizontal,
  Pencil,
  Trash2,
  ExternalLink,
  Linkedin,
  Mail,
  GripVertical,
} from "lucide-react";
import { toast } from "sonner";

export default function TeamPage() {
  const teamMembers = useQuery(api.team.list, { includeInactive: true });
  const toggleActive = useMutation(api.team.toggleActive);
  const deleteMember = useMutation(api.team.remove);

  const [deleteId, setDeleteId] = useState<Id<"team_members"> | null>(null);

  const handleToggleActive = async (id: Id<"team_members">) => {
    try {
      await toggleActive({ id });
      toast.success("Statut mis à jour");
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMember({ id: deleteId });
      toast.success("Membre supprimé");
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
          <h1 className="text-3xl font-bold">Équipe</h1>
          <p className="text-muted-foreground">
            Gérez les profils de l&apos;équipe affichés sur le site
          </p>
        </div>
        <Link href="/admin/team/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau membre
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>
          {teamMembers?.filter((m) => m.isActive).length || 0} actifs
        </span>
        <span>•</span>
        <span>
          {teamMembers?.filter((m) => !m.isActive).length || 0} inactifs
        </span>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {teamMembers?.map((member) => (
          <Card
            key={member._id}
            className={`group relative ${!member.isActive ? "opacity-60" : ""}`}
          >
            <CardContent className="p-4">
              {/* Drag Handle */}
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
              </div>

              {/* Actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/team/${member._id}`}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Modifier
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a
                        href={`/equipe/${member.slug}`}
                        target="_blank"
                        rel="noopener"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Voir sur le site
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setDeleteId(member._id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Photo */}
              <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-center space-y-1">
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>

              {/* Links */}
              <div className="flex justify-center gap-2 mt-3">
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Expertise Tags */}
              {member.sectorsExpertise && member.sectorsExpertise.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center mt-3">
                  {member.sectorsExpertise.slice(0, 2).map((sector) => (
                    <Badge key={sector} variant="secondary" className="text-xs">
                      {sector}
                    </Badge>
                  ))}
                  {member.sectorsExpertise.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{member.sectorsExpertise.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              {/* Active Toggle */}
              <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t">
                <span className="text-xs text-muted-foreground">Actif</span>
                <Switch
                  checked={member.isActive}
                  onCheckedChange={() => handleToggleActive(member._id)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce membre ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le profil sera définitivement
              supprimé.
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
