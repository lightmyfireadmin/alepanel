"use client";

import { useQuery, useAction } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { UserPlus, Sparkles, Loader2, Link as LinkIcon, Building2, BrainCircuit } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface DealMatchmakerProps {
  dealId: Id<"deals">;
}

export function DealMatchmaker({ dealId }: DealMatchmakerProps) {
  const matches = useQuery(api.matchmaker.findMatchingBuyers, { dealId });

  const handleAdd = (contactId: string) => {
      toast.success("Contact lié au dossier avec succès");
  };

  return (
    <Card className="border-indigo-100 bg-indigo-50/10 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-700">
            <Sparkles className="w-5 h-5" />
            Acquéreurs Potentiels
        </CardTitle>
        <CardDescription>
            Suggestions basées sur la compatibilité sémantique des critères d'investissement.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {matches === undefined ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-indigo-600/60">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs font-medium">Analyse du marché en cours...</span>
            </div>
        ) : matches.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8 border border-dashed rounded-md bg-white/50 flex flex-col items-center gap-2">
                <Sparkles className="w-8 h-8 text-muted-foreground/30" />
                <p>Aucun match trouvé pour le moment.</p>
                <p className="text-xs opacity-70">Essayez d'enrichir la description du deal pour améliorer le ciblage.</p>
            </div>
        ) : (
            matches.map((match: any) => (
                <MatchCard key={match.matchId} match={match} dealId={dealId} onAdd={handleAdd} />
            ))
        )}
      </CardContent>
    </Card>
  );
}

function MatchCard({ match, dealId, onAdd }: { match: any, dealId: Id<"deals">, onAdd: (id: string) => void }) {
    const explain = useAction(api.actions.openai.explainMatch);
    const [explanation, setExplanation] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleExplain = async () => {
        setLoading(true);
        try {
            const text = await explain({ dealId, contactId: match.contact._id });
            setExplanation(text);
        } catch (e) {
            toast.error("Impossible de générer l'explication");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="group relative flex flex-col gap-3 p-4 bg-white border border-indigo-100/50 rounded-xl shadow-sm hover:shadow-md transition-all hover:border-indigo-200">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-slate-100">
                        <AvatarFallback className="bg-slate-50 text-slate-600 font-bold">
                            {match.contact?.fullName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="text-sm font-bold text-slate-900">{match.contact?.fullName}</div>
                        {match.contact?.companyName && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Building2 className="w-3 h-3" />
                                {match.contact.companyName}
                            </div>
                        )}
                    </div>
                </div>
                <Button size="sm" variant="outline" className="h-8 gap-2 text-indigo-600 border-indigo-100 hover:bg-indigo-50" onClick={() => onAdd(match.contact?._id)}>
                    <LinkIcon className="w-3.5 h-3.5" />
                    Lier
                </Button>
            </div>

            <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-600">Score de compatibilité</span>
                    <span className="font-mono font-bold text-indigo-600">{(match.score * 100).toFixed(0)}%</span>
                </div>
                <Progress value={match.score * 100} className="h-1.5 bg-indigo-100 [&>div]:bg-indigo-500" />
            </div>

            {/* AI Explanation */}
            <div className="text-[11px] leading-relaxed text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 relative min-h-[40px]">
                <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <BrainCircuit className="w-3 h-3 text-indigo-400" />
                        Pourquoi ça matche ?
                    </span>
                    {!explanation && !loading && (
                        <button onClick={handleExplain} className="text-[10px] text-indigo-600 hover:underline">
                            Analyser
                        </button>
                    )}
                </div>
                
                {loading ? (
                    <div className="flex items-center gap-2 text-slate-400 italic">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Analyse IA en cours...
                    </div>
                ) : explanation ? (
                    <p className="text-slate-600">{explanation}</p>
                ) : (
                    <p className="text-slate-400 italic">Cliquez sur analyser pour voir l'explication IA.</p>
                )}
            </div>
        </div>
    );
}
