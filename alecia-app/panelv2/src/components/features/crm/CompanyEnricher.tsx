"use client";

import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Sparkles, ArrowRight, Database, Loader2 } from "lucide-react";
import { Id } from "../../../../../convex/_generated/dataModel";

interface CompanyEnricherProps {
  companyId: Id<"companies">;
  currentData: {
    name: string;
    address?: any;
    financials?: any;
    siren?: string;
    nafCode?: string;
  };
}

export function CompanyEnricher({ companyId, currentData }: CompanyEnricherProps) {
  const searchPappers = useAction(api.actions.intelligence.searchCompanyPappers);
  const updateCompany = useMutation(api.mutations.updateCompany);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [enrichmentResult, setEnrichmentResult] = useState<any>(null);

  const handleEnrich = async () => {
    setIsLoading(true);
    try {
      const results = await searchPappers({ query: currentData.name });
      
      if (results && results.length > 0) {
        setEnrichmentResult(results[0]);
      } else {
        toast.error("Aucune correspondance trouvée sur Pappers");
        setIsOpen(false);
      }
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la récupération des données");
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!enrichmentResult) return;

    try {
        await updateCompany({
            id: companyId,
            patch: {
                siren: enrichmentResult.siren,
                nafCode: enrichmentResult.nafCode,
                vatNumber: enrichmentResult.vatNumber,
                address: enrichmentResult.address,
                financials: enrichmentResult.financials,
                pappersId: enrichmentResult.pappersId
            }
        });
        toast.success("Données enrichies avec succès");
        setIsOpen(false);
    } catch (e) {
        console.error(e);
        toast.error("Échec de la mise à jour");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-100"
            onClick={handleEnrich} 
        >
          <Sparkles className="w-3.5 h-3.5" />
          Enrichir via Pappers
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            Comparaison des données
          </DialogTitle>
          <DialogDescription>
            Analysez les différences avant d'appliquer les données certifiées Pappers.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
            {isLoading ? (
                <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Recherche Pappers en cours...
                </div>
            ) : enrichmentResult ? (
                <div className="space-y-4 text-sm border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-[100px_1fr_20px_1fr] gap-4 bg-muted/30 p-3 font-semibold text-xs uppercase text-muted-foreground border-b">
                        <span>Champ</span>
                        <span className="text-right">Actuel</span>
                        <span></span>
                        <span>Pappers (Nouveau)</span>
                    </div>
                    
                    <DiffRow label="SIREN" oldVal={currentData.siren} newVal={enrichmentResult.siren} />
                    <DiffRow label="Code NAF" oldVal={currentData.nafCode} newVal={enrichmentResult.nafCode} />
                    <DiffRow 
                        label="Adresse" 
                        oldVal={currentData.address?.city} 
                        newVal={enrichmentResult.address?.city} 
                        subVal={`${enrichmentResult.address?.street}, ${enrichmentResult.address?.zip}`}
                    />
                    <DiffRow 
                        label="CA (Revenus)" 
                        oldVal={currentData.financials?.revenue} 
                        newVal={enrichmentResult.financials?.revenue}
                        isCurrency 
                    />
                    <DiffRow 
                        label="EBE (EBITDA)" 
                        oldVal={currentData.financials?.ebitda} 
                        newVal={enrichmentResult.financials?.ebitda}
                        isCurrency 
                    />
                </div>
            ) : (
                <div className="text-center py-8 bg-muted/10 rounded-lg border border-dashed">
                    <Button onClick={handleEnrich} disabled={isLoading}>Lancer la recherche</Button>
                </div>
            )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
          <Button onClick={handleConfirm} disabled={!enrichmentResult || isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Appliquer les modifications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DiffRow({ label, oldVal, newVal, subVal, isCurrency }: any) {
    const format = (v: any) => {
        if (!v && v !== 0) return <span className="text-muted-foreground/50 italic">Vide</span>;
        if (isCurrency && typeof v === 'number') return `€${v.toLocaleString()}`;
        return v;
    };

    const isDifferent = oldVal !== newVal && newVal;

    return (
        <div className="grid grid-cols-[100px_1fr_20px_1fr] gap-4 items-center p-3 border-b last:border-0 hover:bg-muted/10 transition-colors">
            <span className="font-medium text-muted-foreground text-xs uppercase">{label}</span>
            <div className="text-right text-muted-foreground text-xs opacity-80 truncate" title={String(oldVal)}>
                {format(oldVal)}
            </div>
            <ArrowRight className={`w-3 h-3 ${isDifferent ? "text-indigo-500" : "text-muted-foreground/30"}`} />
            <div className={`font-medium truncate ${isDifferent ? "text-indigo-700 bg-indigo-50/50 px-1 py-0.5 rounded" : "text-foreground"}`} title={String(newVal)}>
                {format(newVal)}
                {subVal && <div className="text-[10px] font-normal text-muted-foreground mt-0.5 truncate">{subVal}</div>}
            </div>
        </div>
    );
}