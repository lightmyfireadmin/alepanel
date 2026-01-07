"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import OpenAI from "openai"; // Keep for Embeddings
import Groq from "groq-sdk"; // New for Inference

// Initialize Clients
// Note: We use process.env.GROQ_API_KEY ?? "" to avoid instantiation crash 
// if key is not yet in dashboard during build/analyze
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "undefined", 
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "undefined",
});

// --- Constants: Model Strategy ---
const MODELS = {
    fast: "llama3-8b-8192", 
    smart: "llama3-70b-8192", 
    embedding: "text-embedding-3-small" 
};

// --- Actions ---

export const generateSummary = action({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY not configured");
    try {
      const completion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: "You are a helpful assistant. Summarize the user text concisely." },
            { role: "user", content: args.text }
        ],
        model: MODELS.fast,
      });
      return completion.choices[0]?.message?.content || "No summary generated.";
    } catch (error) {
      console.error("Error generating summary (Groq):", error);
      throw new Error("Failed to generate summary");
    }
  },
});

export const generateDiffSummary = action({
  args: { oldContent: v.string(), newContent: v.string() },
  handler: async (ctx, args) => {
    if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY not configured");
    try {
      const completion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: "You are an expert editor. Analyze the changes between two text versions." },
            { role: "user", content: `Compare the following versions and provide a concise natural language explanation of key changes for a governance vote:\n\nOld:\n${args.oldContent}\n\nNew:\n${args.newContent}` }
        ],
        model: MODELS.smart,
      });
      return completion.choices[0]?.message?.content || "No diff summary.";
    } catch (error) {
      console.error("Error generating diff summary (Groq):", error);
      throw new Error("Failed to generate diff summary");
    }
  },
});

export const generateDealEmbedding = action({
    args: { dealId: v.id("deals") },
    handler: async (ctx, args) => {
        if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");
        const deal = await ctx.runQuery(internal.deals.getDeal, { dealId: args.dealId });
        if (!deal) throw new Error("Deal not found");

        const textToEmbed = `Title: ${deal.title}\nStage: ${deal.stage}\nAmount: ${deal.amount}`;
        
        const response = await openai.embeddings.create({
            model: MODELS.embedding,
            input: textToEmbed,
            encoding_format: "float",
        });

        const vector = response.data[0].embedding;

        await ctx.runMutation(internal.matchmaker.saveDealEmbedding, {
            dealId: args.dealId,
            vector
        });

        return { success: true };
    }
});

export const explainMatch = action({
    args: { dealId: v.id("deals"), contactId: v.id("contacts") },
    handler: async (ctx, args): Promise<string> => {
        if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY not configured");
        const deal = await ctx.runQuery(internal.deals.getDeal, { dealId: args.dealId });
        const contact = await ctx.runQuery(internal.crm.getContact, { contactId: args.contactId });

        if (!deal || !contact) throw new Error("Data not found");

        const prompt = `
        Contexte: M&A Deal Matchmaking.
        Deal Cible: ${deal.title} (Montant: ${deal.amount}, Étape: ${deal.stage})
        Acquéreur Potentiel: ${contact.fullName} (Société: ${contact.companyName}, Rôle: ${contact.role}, Tags: ${contact.tags?.join(", ")})
        
        Tâche: Explique en UNE phrase concise (français) pourquoi cet acquéreur est pertinent pour ce deal.
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: MODELS.smart,
        });

        return completion.choices[0]?.message?.content || "Analyse impossible.";
    }
});