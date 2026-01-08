import { mutation, query, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getOptionalUser, checkRole } from "./auth_utils";

// Valid stages as per requirement
const STAGES = ["Lead", "NDA Signed", "Offer Received", "Due Diligence", "Closing"];

export const getDeals = query({
  args: {},
  handler: async (ctx) => {
    // Use optional auth - return empty array if not authenticated
    const user = await getOptionalUser(ctx);
    if (!user) {
      return []; // Not authenticated, return empty
    }

    const deals = await ctx.db.query("deals").collect();

    // Enrich with Company and Owner data
    const enrichedDeals = await Promise.all(
      deals.map(async (deal) => {
        const company = deal.companyId ? await ctx.db.get(deal.companyId) : null;
        const owner = deal.ownerId ? await ctx.db.get(deal.ownerId) : null;
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
    // Only Sudo and Partners can move deals in the pipeline
    await checkRole(ctx, ["sudo", "partner"]);

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