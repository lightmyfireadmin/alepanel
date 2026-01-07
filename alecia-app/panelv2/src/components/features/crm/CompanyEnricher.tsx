"use client";

import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Sparkles, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";

interface CompanyEnricherProps {
  companyId: Id<"companies">;
  companyName: string;
  currentData: any; // The current company object
}

export function CompanyEnricher({ companyId, companyName, currentData }: CompanyEnricherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [pappersResult, setPappersResult] = useState<any>(null);
  
  const searchPappers = useAction(api.actions.intelligence.searchCompanyPappers);
  const updateCompany = useMutation(api.mutations.updateCompany);

  const handleEnrich = async () => {
    setIsLoading(true);
    try {
        const results = await searchPappers({ query: companyName });
        if (results && results.length > 0) {
            setPappersResult(results[0]); // Take best match
        } else {
            toast.error("Aucune entreprise trouvée sur Pappers.");
        }
    } catch (e) {
        toast.error("Erreur lors de la recherche Pappers.");
    } finally {
        setIsLoading(false);
    }
  };

  const applyChanges = async () => {
    if (!pappersResult) return;
    
    setIsApplying(true);
    try {
      await updateCompany({
        id: companyId,
        patch: {
          siren: pappersResult.siren,
          nafCode: pappersResult.nafCode,
          vatNumber: pappersResult.vatNumber,
          address: pappersResult.address,
          financials: pappersResult.financials,
          pappersId: pappersResult.pappersId || pappersResult.siren,
        },
      });
      toast.success("Données enrichies avec succès !");
      setIsOpen(false);
      setPappersResult(null);
    } catch (e) {
      toast.error("Erreur lors de la mise à jour.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100">
          <Sparkles className="w-3 h-3" />
          Enrichir via Pappers
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enrichissement Pappers</DialogTitle>
        </DialogHeader>

        {!pappersResult ? (
            <div className="flex flex-col items-center justify-center py-8">
                <p className="text-sm text-muted-foreground mb-4">
                    Recherche des données légales et financières pour <strong>{companyName}</strong>...
                </p>
                <Button onClick={handleEnrich} disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Lancer la recherche
                </Button>
            </div>
        ) : (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-4 border rounded-lg bg-muted/20">
                        <h4 className="font-semibold mb-2 text-muted-foreground">Données Actuelles</h4>
                        <div className="space-y-2">
                            <p><span className="text-xs text-muted-foreground">SIREN:</span> {currentData.siren || "-"}</p>
                            <p><span className="text-xs text-muted-foreground">NAF:</span> {currentData.nafCode || "-"}</p>
                            <p><span className="text-xs text-muted-foreground">CA:</span> {currentData.financials?.revenue || "-"}</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <ArrowRight className="text-muted-foreground" />
                    </div>
                    <div className="p-4 border rounded-lg bg-blue-50/50 border-blue-100">
                        <h4 className="font-semibold mb-2 text-blue-700">Données Pappers</h4>
                        <div className="space-y-2">
                            <p><span className="text-xs text-muted-foreground">SIREN:</span> {pappersResult.siren}</p>
                            <p><span className="text-xs text-muted-foreground">NAF:</span> {pappersResult.nafCode}</p>
                            <p><span className="text-xs text-muted-foreground">CA:</span> {pappersResult.financials?.revenue ? `${(pappersResult.financials.revenue / 1000000).toFixed(1)}M€` : "N/A"}</p>
                            <p><span className="text-xs text-muted-foreground">Adresse:</span> {pappersResult.address.city}</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Annuler</Button>
                    <Button onClick={applyChanges} className="bg-blue-600 hover:bg-blue-700">
                        <Check className="w-4 h-4 mr-2" />
                        Appliquer les modifications
                    </Button>
                </div>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
