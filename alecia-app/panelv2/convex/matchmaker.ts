import { query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// --- Internal Mutations (Called by Actions) ---

export const saveDealEmbedding = internalMutation({
    args: {
        dealId: v.id("deals"),
        vector: v.array(v.float64())
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("embeddings")
            .filter(q => q.and(
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
    }
});

// --- Public Queries (Called by UI) ---

export const findMatchingBuyers = query({
    args: { dealId: v.id("deals") },
    handler: async (ctx, args) => {
        // 1. Get the deal's embedding
        const dealEmbedding = await ctx.db
            .query("embeddings")
            .filter(q => q.and(
                q.eq(q.field("targetId"), args.dealId),
                q.eq(q.field("targetType"), "deal")
            ))
            .first();

        if (!dealEmbedding) return [];

        // 2. Vector Search for buyers
        // Note: We are searching for "buyer" embeddings that are similar to the "deal" embedding
        const results = await ctx.db.vectorSearch("embeddings", "by_vector", {
            vector: dealEmbedding.vector,
            limit: 5,
            filter: (q) => q.eq(q.field("targetType"), "buyer")
        });

        // 3. Map results to contacts/companies and format for UI
        const matches = await Promise.all(results.map(async (res) => {
            const contactId = res.targetId as any; 
            
            // Try to fetch contact details
            let contact = null;
            try {
                // If targetId is a valid ID string for contacts table
                // This assumes embeddings for buyers store Contact ID in targetId
                contact = await ctx.db.get(contactId);
            } catch (e) {
                // Handle invalid ID
            }

            if (!contact) return null;

            // Optional: Fetch company for the contact to show context
            const company = await ctx.db.get(contact.companyId);

            return {
                matchId: res._id,
                score: res._score,
                contact: {
                    ...contact,
                    companyName: company?.name
                }
            };
        }));

        return matches.filter(m => m !== null);
    }
});
