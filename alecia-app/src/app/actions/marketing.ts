"use server";

import { mistral } from "@/lib/mistral";
import { groq } from "@/lib/groq";
import { logger } from "@/lib/logger";

export type ContentType =
  | "article"
  | "email"
  | "linkedin"
  | "advice"
  | "translation"
  | "carrousel";

interface GenerateContentParams {
  prompt: string;
  type: ContentType;
  context?: string;
  model?: "mistral" | "groq";
}

export async function generateContent({ prompt, type, context, model = "mistral" }: GenerateContentParams) {
  try {
    const systemPrompts: Record<ContentType, string> = {
      article: "Tu es un expert en rédaction d'articles professionnels pour le secteur M&A (Fusions & Acquisitions). Rédige un article structuré, perspicace et engageant.",
      email: "Tu es un expert en communication professionnelle. Rédige un email clair, poli et efficace pour le contexte donné.",
      linkedin: "Tu es un expert en marketing digital sur LinkedIn. Rédige un post engageant, professionnel, avec des émojis appropriés et des hashtags pertinents.",
      advice: "Tu es un consultant senior en stratégie. Donne des conseils avisés, pratiques et bien argumentés.",
      translation: "Tu es un traducteur professionnel expert. Traduis le texte suivant en conservant le ton et les nuances.",
      carrousel: "Tu es un expert en création de contenu pour les réseaux sociaux. Crée le contenu textuel pour un carrousel (slide par slide) sur le sujet donné. Sois concis et percutant.",
    };

    const systemMessage = systemPrompts[type] || "Tu es un assistant IA utile.";
    const userMessage = context
      ? `Contexte: ${context}\n\nDemande: ${prompt}`
      : prompt;

    let content = "";

    if (model === "mistral" && mistral) {
      const response = await mistral.chat.complete({
        model: "mistral-large-latest",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage },
        ],
      });
      content = response.choices?.[0]?.message?.content?.toString() || "";
    } else if (model === "groq" && groq) {
      const response = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage },
        ],
        model: "mixtral-8x7b-32768",
      });
      content = response.choices[0]?.message?.content || "";
    } else {
        // Fallback or error if selected model is not available but other might be?
        // For now, if default is missing, try the other.
        if (!mistral && groq) {
             const response = await groq.chat.completions.create({
                messages: [
                  { role: "system", content: systemMessage },
                  { role: "user", content: userMessage },
                ],
                model: "mixtral-8x7b-32768",
              });
              content = response.choices[0]?.message?.content || "";
        } else if (!groq && mistral) {
            const response = await mistral.chat.complete({
                model: "mistral-large-latest",
                messages: [
                  { role: "system", content: systemMessage },
                  { role: "user", content: userMessage },
                ],
              });
            content = response.choices?.[0]?.message?.content?.toString() || "";
        } else {
            throw new Error("Aucun service IA n'est configuré (Mistral ou Groq).");
        }
    }

    return { success: true, content };
  } catch (error) {
    logger.error("Error generating content:", error);
    return { success: false, error: "Une erreur est survenue lors de la génération du contenu." };
  }
}
