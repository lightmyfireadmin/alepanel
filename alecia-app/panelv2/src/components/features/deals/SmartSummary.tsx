"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  RefreshCw, 
  Copy, 
  Check, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Target,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DealData {
  name: string;
  stage: string;
  amount?: number;
  targetCompany?: {
    name: string;
    sector?: string;
    employees?: number;
    financials?: {
      revenue?: number;
      ebitda?: number;
      netResult?: number;
    };
  };
  acquirer?: {
    name: string;
  };
  createdAt?: string;
  lastActivity?: string;
  notes?: string[];
  contacts?: { name: string; role?: string }[];
}

interface SmartSummaryProps {
  deal: DealData;
  className?: string;
  onSummaryGenerated?: (summary: string) => void;
}

interface SummaryResult {
  overview: string;
  strengths: string[];
  risks: string[];
  nextSteps: string[];
  sentiment: "positive" | "neutral" | "negative";
}

/**
 * AI-powered deal summary component
 * Generates a structured analysis of deal status
 */
export function SmartSummary({ deal, className, onSummaryGenerated }: SmartSummaryProps) {
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateSummary = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build context for AI
      const context = buildDealContext(deal);
      
      // Call AI endpoint (can be Groq, OpenAI, or Gemini)
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: "deal_summary",
          context,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération");
      }

      const result = await response.json();
      setSummary(result);
      onSummaryGenerated?.(result.overview);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      
      // Fallback to mock summary for demo
      setSummary(generateMockSummary(deal));
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!summary) return;
    
    const text = `
📋 Synthèse: ${deal.name}

${summary.overview}

✅ Points forts:
${summary.strengths.map(s => `• ${s}`).join("\n")}

⚠️ Risques identifiés:
${summary.risks.map(r => `• ${r}`).join("\n")}

📌 Prochaines étapes:
${summary.nextSteps.map(n => `• ${n}`).join("\n")}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Synthèse copiée");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Synthèse IA
            </CardTitle>
            <CardDescription>
              Analyse automatique du dossier
            </CardDescription>
          </div>
          {summary && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {!summary && !isLoading && (
          <div className="text-center py-6">
            <Sparkles className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground mb-4">
              Générez une synthèse IA du dossier
            </p>
            <Button onClick={generateSummary} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Générer la synthèse
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
            <Skeleton className="h-16 w-full" />
          </div>
        )}

        {error && !summary && (
          <div className="text-center py-6 text-sm text-destructive">
            {error}
          </div>
        )}

        {summary && (
          <div className="space-y-4">
            {/* Sentiment Badge */}
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "gap-1",
                  summary.sentiment === "positive" && "text-green-600 border-green-200 bg-green-50",
                  summary.sentiment === "negative" && "text-red-600 border-red-200 bg-red-50",
                  summary.sentiment === "neutral" && "text-amber-600 border-amber-200 bg-amber-50"
                )}
              >
                {summary.sentiment === "positive" && <TrendingUp className="h-3 w-3" />}
                {summary.sentiment === "negative" && <TrendingDown className="h-3 w-3" />}
                {summary.sentiment === "neutral" && <Target className="h-3 w-3" />}
                {summary.sentiment === "positive" && "Positif"}
                {summary.sentiment === "negative" && "À risque"}
                {summary.sentiment === "neutral" && "Neutre"}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Généré à l'instant
              </span>
            </div>

            {/* Overview */}
            <div className="p-3 bg-muted/30 rounded-lg text-sm">
              {summary.overview}
            </div>

            {/* Strengths & Risks */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Points forts
                </h4>
                <ul className="space-y-1">
                  {summary.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-green-500">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Risques
                </h4>
                <ul className="space-y-1">
                  {summary.risks.map((r, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-amber-500">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Next Steps */}
            <div className="p-3 border rounded-lg space-y-2">
              <h4 className="text-xs font-semibold flex items-center gap-1">
                <Target className="h-3 w-3" />
                Prochaines étapes suggérées
              </h4>
              <ol className="space-y-1">
                {summary.nextSteps.map((step, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-2">
                    <span className="font-medium text-primary">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Regenerate button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={generateSummary}
              disabled={isLoading}
              className="w-full gap-2 text-muted-foreground"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
              Régénérer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper to build context string for AI
function buildDealContext(deal: DealData): string {
  const parts = [
    `Dossier: ${deal.name}`,
    `Stade: ${deal.stage}`,
    deal.amount && `Montant: ${(deal.amount / 1e6).toFixed(1)}M€`,
    deal.targetCompany && `Cible: ${deal.targetCompany.name}`,
    deal.targetCompany?.sector && `Secteur: ${deal.targetCompany.sector}`,
    deal.targetCompany?.financials?.revenue && 
      `CA: ${(deal.targetCompany.financials.revenue / 1e6).toFixed(1)}M€`,
    deal.targetCompany?.financials?.ebitda &&
      `EBITDA: ${(deal.targetCompany.financials.ebitda / 1e6).toFixed(1)}M€`,
    deal.acquirer && `Acquéreur: ${deal.acquirer.name}`,
    deal.contacts && deal.contacts.length > 0 &&
      `Contacts: ${deal.contacts.map(c => c.name).join(", ")}`,
    deal.notes && deal.notes.length > 0 &&
      `Notes récentes: ${deal.notes.slice(0, 3).join("; ")}`,
  ].filter(Boolean);

  return parts.join("\n");
}

// Mock summary for demo/fallback
function generateMockSummary(deal: DealData): SummaryResult {
  const hasFinancials = deal.targetCompany?.financials?.revenue;
  const isEarlyStage = ["Origination", "Prospection", "NDA"].includes(deal.stage);

  return {
    overview: `Le dossier "${deal.name}" est actuellement en phase ${deal.stage}. ${
      hasFinancials 
        ? `La cible présente un CA de ${((deal.targetCompany?.financials?.revenue || 0) / 1e6).toFixed(1)}M€ avec une marge EBITDA de ${
          deal.targetCompany?.financials?.ebitda && deal.targetCompany?.financials?.revenue
            ? ((deal.targetCompany.financials.ebitda / deal.targetCompany.financials.revenue) * 100).toFixed(1)
            : "N/A"
        }%.`
        : "Les données financières complètes doivent encore être collectées."
    }`,
    strengths: [
      hasFinancials ? "Données financières disponibles" : "Identification préliminaire réalisée",
      deal.contacts && deal.contacts.length > 0 ? "Contacts identifiés" : "Dossier en cours de qualification",
      isEarlyStage ? "Phase préliminaire - flexibilité" : "Avancement significatif",
    ],
    risks: [
      !hasFinancials ? "Données financières manquantes" : "Valorisation à confirmer",
      isEarlyStage ? "Stade précoce - incertitude élevée" : "Due diligence à approfondir",
      "Concurrence potentielle sur le dossier",
    ],
    nextSteps: [
      isEarlyStage ? "Compléter la fiche entreprise" : "Avancer sur la due diligence",
      "Planifier un point d'équipe",
      hasFinancials ? "Préparer une note de valorisation" : "Collecter les états financiers",
    ],
    sentiment: hasFinancials ? "positive" : isEarlyStage ? "neutral" : "negative",
  };
}
