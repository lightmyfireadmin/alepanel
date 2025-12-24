import { getSheets } from "@/lib/actions/sheets";
import { Plus, Table, Trash2, MoreVertical, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { SheetsList } from "./SheetsList";

export default async function SheetsPage() {
  const result = await getSheets();
  const sheets = result.success ? result.data || [] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-black dark:text-white">Feuilles de calcul</h1>
        <p className="text-bodydark2">Analysez vos données et préparez vos reportings financiers.</p>
      </div>

      <SheetsList initialSheets={sheets} />
    </div>
  );
}
