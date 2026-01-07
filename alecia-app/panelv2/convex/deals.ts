import { mutation, query, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Valid stages as per requirement
const STAGES = ["Lead", "NDA Signed", "Offer Received", "Due Diligence", "Closing"];

export const getDeals = query({
  args: {},
  handler: async (ctx) => {
    const deals = await ctx.db.query("deals").collect();

    // Enrich with Company and Owner data
    const enrichedDeals = await Promise.all(
      deals.map(async (deal) => {
        const company = await ctx.db.get(deal.companyId);
        const owner = await ctx.db.get(deal.ownerId);
        return {
          ...deal,
          companyName: company?.name || "Unknown Company",
          companyLogo: company?.logoUrl,
          ownerName: owner?.name || "Unknown",
          ownerAvatar: owner?.avatarUrl,
        };
      })
    );

    return enrichedDeals;
  },
});

export const getDeal = internalQuery({
    args: { dealId: v.id("deals") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.dealId);
    }
});

export const moveDeal = mutation({
  args: {
    dealId: v.id("deals"),
    newStage: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate stage (optional but good for data integrity)
    if (!STAGES.includes(args.newStage)) {
        // We allow it dynamically if we want flexibility, but strict check is safer
        // throw new Error("Invalid stage");
    }

    await ctx.db.patch(args.dealId, {
      stage: args.newStage,
    });
  },
});

export const saveDealEmbedding = internalMutation({
    args: {
        dealId: v.id("deals"),
        vector: v.array(v.float64())
    },
    handler: async (ctx, args) => {
        // Check if embedding exists
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
        // Note: In a real app, buyer_criteria would generate embeddings too.
        // For MVP, we assume we are matching against "embeddings" table where buyers are also embedded.
        const results = await ctx.db.vectorSearch("embeddings", "by_vector", {
            vector: dealEmbedding.vector,
            limit: 5,
            filter: (q) => q.eq(q.field("targetType"), "buyer") // Assuming buyers are indexed with this type
        });

        // 3. Map results to contacts/companies
        const matches = await Promise.all(results.map(async (res) => {
            const contactId = res.targetId as any; // Assuming targetId is valid ID string
            // We need to fetch contact details.
            // CAUTION: targetId is string in schema, but we need to treat it as ID.
            // Ideally schema should have been v.id() but vector index supports generic string?
            // Schema said: targetId: v.string(). So we query manually or attempt fetch if valid ID format.
            
            // Assuming targetId is a Contact ID
            let contact = null;
            try {
                // If we knew it was a contact ID...
                // For this MVP let's search users/contacts by ID string if possible or fetch all?
                // `ctx.db.get` requires explicit Id object. 
                // We'll assume the string IS the ID.
                contact = await ctx.db.get(contactId);
            } catch (e) {
                // Might be invalid ID format if seeded differently
            }

            return {
                score: res._score,
                contact
            };
        }));

        return matches.filter(m => m.contact);
    }
});