"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateSWOT } from "@/lib/actions/research";
import { Loader2, FileBarChart, FileDown } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export function ResearchActions({ taskId, isCompleted }: { taskId: string; isCompleted: boolean }) {
  const [loading, setLoading] = useState(false);
  const { success, error: errorToast } = useToast();

  const handleSWOT = async () => {
    setLoading(true);
    const res = await generateSWOT(taskId);
    if (res.success) {
      success("SWOT Généré", "L'analyse a été mise à jour.");
    } else {
      errorToast("Erreur", res.error || "Échec de la génération.");
    }
    setLoading(false);
  };

  if (!isCompleted) return null;

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleSWOT} disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileBarChart className="w-4 h-4 mr-2" />}
        Extraire SWOT
      </Button>
      <Button variant="outline" size="sm" onClick={() => window.print()}>
        <FileDown className="w-4 h-4 mr-2" />
        Exporter PDF
      </Button>
    </div>
  );
}
