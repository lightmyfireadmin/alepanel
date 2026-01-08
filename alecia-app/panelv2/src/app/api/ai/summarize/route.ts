import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = "llama-3.3-70b-versatile";

interface SummarizeRequest {
  type: "deal_summary" | "company_analysis" | "meeting_notes";
  context: string;
}

export async function POST(request: NextRequest) {
  try {
    const { type, context } = await request.json() as SummarizeRequest;

    if (!context) {
      return NextResponse.json(
        { error: "Context is required" },
        { status: 400 }
      );
    }

    // If no API key, return a structured mock response
    if (!GROQ_API_KEY) {
      return NextResponse.json(generateMockResponse(type, context));
    }

    const systemPrompt = getSystemPrompt(type);
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: context },
        ],
        temperature: 0.7,
        max_tokens: 1024,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      return NextResponse.json(generateMockResponse(type, context));
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(generateMockResponse(type, context));
    }

    try {
      const parsed = JSON.parse(content);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json(generateMockResponse(type, context));
    }
  } catch (error) {
    console.error("Summarize API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getSystemPrompt(type: string): string {
  const basePrompt = `Tu es un expert M&A français. Réponds toujours en JSON valide avec la structure exacte demandée. Sois concis et professionnel.`;

  switch (type) {
    case "deal_summary":
      return `${basePrompt}
      
Génère une synthèse structurée d'un dossier M&A. 
Format JSON attendu:
{
  "overview": "Résumé en 2-3 phrases du dossier",
  "strengths": ["Point fort 1", "Point fort 2", "Point fort 3"],
  "risks": ["Risque 1", "Risque 2", "Risque 3"],
  "nextSteps": ["Action 1", "Action 2", "Action 3"],
  "sentiment": "positive" | "neutral" | "negative"
}`;

    case "company_analysis":
      return `${basePrompt}
      
Analyse une entreprise cible pour une opération M&A.
Format JSON attendu:
{
  "summary": "Analyse en 3-4 phrases",
  "sector": "Secteur d'activité",
  "positioning": "Fort" | "Moyen" | "Faible",
  "keyMetrics": ["Métrique clé 1", "Métrique clé 2"],
  "concerns": ["Préoccupation 1", "Préoccupation 2"]
}`;

    case "meeting_notes":
      return `${basePrompt}
      
Synthétise des notes de réunion M&A.
Format JSON attendu:
{
  "summary": "Résumé de la réunion",
  "decisions": ["Décision 1", "Décision 2"],
  "actionItems": ["Action 1 - Responsable", "Action 2 - Responsable"],
  "nextMeeting": "Suggestion de sujet pour la prochaine réunion"
}`;

    default:
      return basePrompt;
  }
}

function generateMockResponse(type: string, context: string) {
  // Extract some context for personalization
  const lines = context.split("\n");
  const dealName = lines.find(l => l.startsWith("Dossier:"))?.replace("Dossier:", "").trim() || "ce dossier";
  const stage = lines.find(l => l.startsWith("Stade:"))?.replace("Stade:", "").trim() || "En cours";

  switch (type) {
    case "deal_summary":
      return {
        overview: `Le dossier "${dealName}" est en phase ${stage}. Les éléments disponibles permettent une première analyse mais des informations complémentaires sont nécessaires pour une évaluation complète.`,
        strengths: [
          "Dossier correctement structuré",
          "Parties prenantes identifiées",
          "Documentation en cours de collecte",
        ],
        risks: [
          "Informations financières à compléter",
          "Timeline à définir précisément",
          "Valorisation à affiner",
        ],
        nextSteps: [
          "Compléter la collecte de documents",
          "Planifier un point d'équipe",
          "Préparer une première valorisation indicative",
        ],
        sentiment: "neutral",
      };

    case "company_analysis":
      return {
        summary: "Analyse préliminaire basée sur les informations disponibles. Une due diligence approfondie est recommandée.",
        sector: "À confirmer",
        positioning: "Moyen",
        keyMetrics: ["Données à collecter", "Analyse en cours"],
        concerns: ["Informations limitées", "Comparables à identifier"],
      };

    case "meeting_notes":
      return {
        summary: "Synthèse des points discutés lors de la réunion.",
        decisions: ["Avancer sur le dossier", "Approfondir l'analyse"],
        actionItems: ["Collecter documents - Équipe", "Préparer synthèse - Analyste"],
        nextMeeting: "Revue d'avancement dans 1 semaine",
      };

    default:
      return { message: "Analyse non disponible" };
  }
}
