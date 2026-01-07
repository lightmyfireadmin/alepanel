import { internalMutation, action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// 1. Save Embedding (Internal Mutation called by OpenAI action)
export const saveDealEmbedding = internalMutation({
  args: { 
    dealId: v.id("deals"),
    vector: v.array(v.float64())
  },
  handler: async (ctx, args) => {
    // Check if embedding exists
    const existing = await ctx.db
      .query("embeddings")
      .filter((q) => q.and(
        q.eq(q.field("targetId"), args.dealId),
        q.eq(q.field("targetType"), "deal")
      ))
      .first();

    if (existing) {
        await ctx.db.patch(existing._id, { vector: args.vector });
    } else {
        await ctx.db.insert("embeddings", {
            targetId: args.dealId,
            targetType: "deal",
            vector: args.vector
        });
    }
  },
});

// 2. Find Matching Buyers (Vector Search Action)
export const findMatchingBuyers = action({
    args: { dealId: v.id("deals") },
    handler: async (ctx, args): Promise<any[]> => {
        // A. Get the deal's embedding (via internal query, as actions can't access db directly)
        // We need a helper query to fetch embedding by targetId
        // Assuming we can use internal.matchmaker.getEmbeddingByTarget
        // I will create that helper query below or inline if I could, but Actions can only run queries.
        
        // Let's assume we create a helper 'getEmbedding' query in this file or elsewhere.
        // I'll add it to this file as 'internalQuery' but need to export it.
        
        const dealEmbedding = await ctx.runQuery(internal.matchmaker.getEmbeddingByTarget, { 
            targetId: args.dealId, 
            targetType: "deal" 
        });

        if (!dealEmbedding) return []; 

        // B. Perform Vector Search
        const results = await ctx.vectorSearch("embeddings", "by_vector", {
            vector: dealEmbedding.vector,
            limit: 5,
            filter: (q) => q.eq("targetType", "buyer")
        });

        // C. Map results to Contacts (via internal query)
        const matches = await Promise.all(results.map(async (res) => {
            // Vector search returns { _id, _score } where _id is the embedding doc ID
            // First fetch the embedding doc to get the targetId (contact ID)
            const embeddingDoc = await ctx.runQuery(internal.matchmaker.getEmbeddingById, { embeddingId: res._id });
            if (!embeddingDoc) return null;

            // The targetId in the embedding doc is the contact ID (stored as string)
            const contactId = embeddingDoc.targetId;
            
            // Fetch the enriched contact details
            const contactData = await ctx.runQuery(internal.matchmaker.getContactDetails, { 
                contactId: contactId as any 
            });
            
            if (!contactData) return null;

            return {
                score: res._score,
                contact: contactData
            };
        }));

        return matches.filter((m): m is NonNullable<typeof m> => m !== null);
    }
});

// --- Helper Queries for Action ---

import { internalQuery } from "./_generated/server";

export const getEmbeddingByTarget = internalQuery({
    args: { targetId: v.string(), targetType: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("embeddings")
            .filter((q) => q.and(
                q.eq(q.field("targetId"), args.targetId),
                q.eq(q.field("targetType"), args.targetType)
            ))
            .first();
    }
});

export const getEmbeddingById = internalQuery({
    args: { embeddingId: v.id("embeddings") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.embeddingId);
    }
});

export const getContactDetails = internalQuery({
    args: { contactId: v.id("contacts") },
    handler: async (ctx, args) => {
        const contact = await ctx.db.get(args.contactId);
        if (!contact) return null;

        // Enrich with company data
        const company = await ctx.db.get(contact.companyId);
        
        // Get buyer criteria if exists
        const buyerCriteria = await ctx.db
            .query("buyer_criteria")
            .withIndex("by_contactId", (q) => q.eq("contactId", args.contactId))
            .first();

        return {
            ...contact,
            companyName: company?.name,
            companyLogo: company?.logoUrl,
            buyerCriteria: buyerCriteria ?? null,
        };
    }
});
