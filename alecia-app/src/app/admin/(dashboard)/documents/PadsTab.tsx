"use client";

import { useState, useEffect } from "react";
import { Plus, FileText, Trash2, MoreVertical, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPads, createPad, deletePad } from "@/lib/actions/pads";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function PadsTab() {
  const [pads, setPads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { success, error: errorToast } = useToast();

  const fetchPads = async () => {
    setLoading(true);
    const res = await getPads();
    if (res.success) {
      setPads(res.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPads();
  }, []);

  const handleCreate = async () => {
    const title = prompt("Nom du document :", "Nouveau document");
    if (!title) return;

    setCreating(true);
    const res = await createPad(title);
    if (res.success) {
      success("Document créé", "Le document a été créé avec succès.");
      fetchPads();
    } else {
      errorToast("Erreur", res.error || "Impossible de créer le document.");
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce document ?")) return;
    const res = await deletePad(id);
    if (res.success) {
      success("Document supprimé");
      fetchPads();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-black dark:text-white">Documents Collaboratifs (Pads)</h3>
        <Button onClick={handleCreate} disabled={creating} className="btn-gold">
          {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
          Nouveau Pad
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : pads.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-xl border-stroke dark:border-strokedark">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-bodydark2">Aucun pad pour le moment.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pads.map((pad) => (
            <div key={pad.id} className="relative group bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded-xl p-4 hover:shadow-lg transition-all">
              <Link href={`/admin/documents/pad/${pad.id}`} className="block">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div onClick={(e) => e.preventDefault()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                                <Link href={`/admin/documents/pad/${pad.id}`} className="flex items-center cursor-pointer">
                                    <ExternalLink className="w-4 h-4 mr-2" /> Ouvrir
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(pad.id)} className="text-danger focus:text-danger cursor-pointer">
                                <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <h4 className="font-semibold text-black dark:text-white truncate mb-1">{pad.title}</h4>
                <div className="text-xs text-bodydark2 flex flex-col gap-1">
                  <span>Modifié {formatDistanceToNow(new Date(pad.updatedAt), { addSuffix: true, locale: fr })}</span>
                  <span>Par {pad.ownerName}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
