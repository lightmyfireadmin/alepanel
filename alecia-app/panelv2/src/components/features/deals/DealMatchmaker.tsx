"use client";

import { useState } from "react";
import { useQuery, useAction, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, BrainCircuit, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DealMatchmaker({ dealId }: { dealId: Id<"deals"> }) {
  const matches = useQuery(api.matchmaker.findMatchingBuyers, { dealId });
  const generateEmbedding = useMutation(api.matchmaker.generateDealEmbedding); // Wait, this was internalMutation in my thought, but needs to be public OR wrapped by action
  // Ah, the plan said: Mutation generateDealEmbedding.
  // BUT I implemented it as 'internalMutation' in matchmaker.ts and 'action' in openai.ts.
  // The UI should call the ACTION 'api.actions.openai.generateDealEmbedding'.
  
  const runEmbedding = useAction(api.actions.openai.generateDealEmbedding);
  const explainMatch = useAction(api.actions.openai.explainMatch);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [explanations, setExplanations] = useState<Record<string, string>>({});

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
        await runEmbedding({ dealId });
        toast.success("Analyse sémantique terminée.");
    } catch (e) {
        toast.error("Erreur d'analyse.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleExplain = async (contactId: Id<"contacts">) => {
      const loadingToast = toast.loading("L'IA analyse la compatibilité...");
      try {
          const text = await explainMatch({ dealId, contactId });
          setExplanations(prev => ({ ...prev, [contactId]: text }));
          toast.dismiss(loadingToast);
      } catch (e) {
          toast.error("Erreur d'explication.");
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-purple-600" />
                Matchmaking IA
            </h3>
            <p className="text-sm text-muted-foreground">
                Algorithme vectoriel de recommandation d'acquéreurs.
            </p>
        </div>
        <Button onClick={handleAnalyze} disabled={isAnalyzing} className="bg-purple-600 hover:bg-purple-700">
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Lancer l'analyse
        </Button>
      </div>

      <div className="grid gap-4">
        {!matches ? (
            <div className="p-8 text-center text-muted-foreground text-sm border border-dashed rounded-lg">
                Aucune recommandation pour le moment. Lancez l'analyse.
            </div>
        ) : matches.length === 0 ? (
             <div className="p-8 text-center text-muted-foreground text-sm border border-dashed rounded-lg">
                Aucun match trouvé (Score trop faible).
            </div>
        ) : (
            matches.map((match: any) => (
                <Card key={match.contact._id} className="overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarFallback>{match.contact.fullName.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-semibold">{match.contact.fullName}</h4>
                                    <p className="text-sm text-muted-foreground">{match.contact.companyName}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-600">{(match.score * 100).toFixed(0)}%</div>
                                <div className="text-[10px] uppercase font-bold text-muted-foreground">Fit Score</div>
                            </div>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                            <Progress value={match.score * 100} className="h-2" />
                            
                            {explanations[match.contact._id] ? (
                                <div className="p-3 bg-purple-50 text-purple-800 text-sm rounded-md mt-2 italic">
                                    "{explanations[match.contact._id]}"
                                </div>
                            ) : (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-xs text-muted-foreground h-auto p-0 mt-1 hover:text-purple-600"
                                    onClick={() => handleExplain(match.contact._id)}
                                >
                                    Pourquoi ça matche ?
                                </Button>
                            )}
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button size="sm" variant="outline" className="gap-2">
                                <UserPlus className="w-4 h-4" />
                                Lier au dossier
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))
        )}
      </div>
    </div>
  );
}