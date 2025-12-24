"use client";

import { useState } from "react";
import { Plus, Table, Trash2, MoreVertical, ExternalLink, Loader2 } from "lucide-react";
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

export function SheetsList({ initialSheets }: { initialSheets: any[] }) {
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
      setSheets([res.data, ...sheets]);
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
      <div className="flex justify-end">
        <Button onClick={handleCreate} disabled={creating} className="btn-gold">
          {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
          Nouveau Spreadsheet
        </Button>
      </div>

      {sheets.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl border-stroke dark:border-strokedark opacity-50">
          <Table className="w-12 h-12 mx-auto mb-4" />
          <p>Aucune feuille de calcul pour le moment.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sheets.map((sheet) => (
            <div key={sheet.id} className="relative group bg-white dark:bg-boxdark border border-stroke dark:border-strokedark rounded-xl p-4 hover:shadow-lg transition-all">
              <Link href={`/admin/sheets/${sheet.id}`} className="block">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-success/10 rounded-lg text-success">
                    <Table className="w-6 h-6" />
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
                                <Link href={`/admin/sheets/${sheet.id}`} className="flex items-center cursor-pointer">
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
                <h4 className="font-semibold text-black dark:text-white truncate mb-1">{sheet.title}</h4>
                <div className="text-xs text-bodydark2 flex flex-col gap-1">
                  <span>Modifié {formatDistanceToNow(new Date(sheet.updatedAt), { addSuffix: true, locale: fr })}</span>
                  <span>Par {sheet.ownerName}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
