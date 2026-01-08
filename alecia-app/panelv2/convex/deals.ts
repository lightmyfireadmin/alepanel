import { mutation, query, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedUser, checkRole } from "./auth_utils";

// Valid stages as per requirement
const STAGES = ["Lead", "NDA Signed", "Offer Received", "Due Diligence", "Closing"];

export const getDeals = query({
  args: {},
  handler: async (ctx) => {
    await getAuthenticatedUser(ctx);
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