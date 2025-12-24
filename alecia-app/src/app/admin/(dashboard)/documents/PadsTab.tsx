"use client";

import { useState, useEffect } from "react";
import { Plus, FileText, Trash2, MoreVertical, ExternalLink, Loader2, Clock, User as UserIcon } from "lucide-react";
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
      <div className="flex justify-between items-center mb-6">
        <div>
            <h3 className="text-lg font-bold text-black dark:text-white">Alecia Pads</h3>
            <p className="text-xs text-bodydark2">Documents collaboratifs en temps réel</p>
        </div>
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
        <div className="text-center py-20 border-2 border-dashed rounded-xl border-stroke dark:border-strokedark opacity-50">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-bodydark2">Aucun pad pour le moment.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pads.map((pad) => (
            <div key={pad.id} className="relative group bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded-xl p-5 hover:shadow-lg hover:border-primary transition-all duration-200">
              <Link href={`/admin/documents/pad/${pad.id}`} className="block">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div onClick={(e) => e.preventDefault()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-bodydark2 hover:text-primary">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white dark:bg-boxdark border-stroke dark:border-strokedark">
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href={`/admin/documents/pad/${pad.id}`} className="flex items-center">
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
                <h4 className="font-bold text-black dark:text-white truncate mb-2 group-hover:text-primary transition-colors">{pad.title}</h4>
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-bodydark2">
                        <Clock className="w-3 h-3" />
                        <span>Modifié {formatDistanceToNow(new Date(pad.updatedAt), { addSuffix: true, locale: fr })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-bodydark2">
                        <UserIcon className="w-3 h-3 text-primary" />
                        <span>Par {pad.ownerName}</span>
                    </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}