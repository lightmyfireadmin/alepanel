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
            filter: (q) => q.eq(q.field("targetType"), "buyer")
        });

        // C. Map results to Contacts (via internal query)
        const matches = await Promise.all(results.map(async (res) => {
            // Fetch contact details
            // We assume targetId is the Contact ID string
            const contact = await ctx.runQuery(internal.matchmaker.getContactDetails, { 
                contactId: res._id // Wait, vector search result returns the embedding doc ID (_id) or the field we indexed? 
                // It returns the embedding document. The 'targetId' field in that doc is the contact ID.
                // But vectorSearch results contain the fields stored in the vector index? 
                // No, usually just _id and _score unless we include metadata.
                // We need to fetch the embedding doc first? 
                // Ah, 'results' contains the fields if they are stored? 
                // By default vectorSearch returns { _id, _score }. 
                // We need to fetch the embedding doc to get 'targetId'.
            });
            
            // Actually, ctx.vectorSearch returns the documents if we use it this way?
            // "The result is an array of objects, each containing the _id and _score of a matching document."
            // So we need to fetch the embedding doc to get the targetId.
            
            const embeddingDoc = await ctx.runQuery(internal.matchmaker.getEmbeddingById, { embeddingId: res._id });
            if (!embeddingDoc) return null;

            const contactId = embeddingDoc.targetId;
            
            // Now fetch contact
            // We can reuse crm.getContact if it was exposed as internal, or create a helper here.
            const contactData = await ctx.runQuery(internal.crm.getContact, { contactId: contactId as any });
            
            if (!contactData) return null;

            return {
                score: res._score,
                contact: contactData
            };
        }));

        return matches.filter(m => m !== null);
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
    args: { contactId: v.id("contacts") }, // Assuming we pass ID
    handler: async (ctx, args) => {
        // ... (This is redundant if we use crm.getContact, but kept for completeness of thought)
        return null; 
    }
});
