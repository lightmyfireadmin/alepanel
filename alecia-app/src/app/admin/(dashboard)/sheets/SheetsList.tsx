"use client";

import { useState } from "react";
import { Plus, Table, Trash2, MoreVertical, ExternalLink, Loader2, Clock, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSheet, deleteSheet } from "@/lib/actions/sheets";
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

interface Sheet {
  id: string;
  title: string;
  updatedAt: string | Date | null;
  ownerName: string | null;
}

export function SheetsList({ initialSheets }: { initialSheets: Sheet[] }) {
  const [sheets, setSheets] = useState(initialSheets);
  const [creating, setCreating] = useState(false);
  const { success, error: errorToast } = useToast();

  const handleCreate = async () => {
    const title = prompt("Nom de la feuille :", "Nouveau Spreadsheet");
    if (!title) return;

    setCreating(true);
    const res = await createSheet(title);
    if (res.success && res.data) {
      success("Feuille créée");
      setSheets([res.data as unknown as Sheet, ...sheets]);
    } else {
      errorToast("Erreur lors de la création");
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette feuille ?")) return;
    const res = await deleteSheet(id);
    if (res.success) {
      success("Feuille supprimée");
      setSheets(sheets.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h3 className="text-lg font-bold text-black dark:text-white">Alecia Sheets</h3>
            <p className="text-xs text-bodydark2">Analyse de données et calculs financiers</p>
        </div>
        <Button onClick={handleCreate} disabled={creating} className="btn-gold">
          {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
          Nouveau Spreadsheet
        </Button>
      </div>

      {sheets.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl border-stroke dark:border-strokedark opacity-50">
          <Table className="w-12 h-12 mx-auto mb-4" />
          <p className="text-bodydark2">Aucune feuille de calcul pour le moment.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sheets.map((sheet) => (
            <div key={sheet.id} className="relative group bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded-xl p-5 hover:shadow-lg hover:border-primary transition-all duration-200">
              <Link href={`/admin/sheets/${sheet.id}`} className="block">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    <Table className="w-6 h-6" />
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
                                <Link href={`/admin/sheets/${sheet.id}`} className="flex items-center">
                                    <ExternalLink className="w-4 h-4 mr-2" /> Ouvrir
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(sheet.id)} className="text-danger focus:text-danger cursor-pointer">
                                <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <h4 className="font-bold text-black dark:text-white truncate mb-2 group-hover:text-primary transition-colors">{sheet.title}</h4>
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-bodydark2">
                        <Clock className="w-3 h-3" />
                        <span>Modifié {sheet.updatedAt ? formatDistanceToNow(new Date(sheet.updatedAt), { addSuffix: true, locale: fr }) : "à l'instant"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-bodydark2">
                        <UserIcon className="w-3 h-3 text-primary" />
                        <span>Par {sheet.ownerName}</span>
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