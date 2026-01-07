// Convex Import Mutation for Neon Migration
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Import Transactions
export const importTransactions = internalMutation({
  args: {
    transactions: v.array(
      v.object({
        slug: v.string(),
        clientName: v.string(),
        clientLogo: v.optional(v.string()),
        acquirerName: v.optional(v.string()),
        acquirerLogo: v.optional(v.string()),
        sector: v.string(),
        region: v.optional(v.string()),
        year: v.number(),
        mandateType: v.string(),
        description: v.optional(v.string()),
        isConfidential: v.boolean(),
        isPriorExperience: v.boolean(),
        context: v.optional(v.string()),
        intervention: v.optional(v.string()),
        result: v.optional(v.string()),
        testimonialText: v.optional(v.string()),
        testimonialAuthor: v.optional(v.string()),
        roleType: v.optional(v.string()),
        dealSize: v.optional(v.string()),
        keyMetrics: v.optional(v.any()),
        displayOrder: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    let count = 0;
    for (const t of args.transactions) {
      // Check if already exists by slug
      const existing = await ctx.db
        .query("transactions")
        .withIndex("by_slug", (q) => q.eq("slug", t.slug))
        .first();
      
      if (!existing) {
        await ctx.db.insert("transactions", t);
        count++;
      }
    }
    return { imported: count, skipped: args.transactions.length - count };
  },
});

// Import Team Members
export const importTeamMembers = internalMutation({
  args: {
    members: v.array(
      v.object({
        slug: v.string(),
        name: v.string(),
        role: v.string(),
        photo: v.optional(v.string()),
        bioFr: v.optional(v.string()),
        bioEn: v.optional(v.string()),
        linkedinUrl: v.optional(v.string()),
        email: v.optional(v.string()),
        sectorsExpertise: v.array(v.string()),
        transactionSlugs: v.array(v.string()),
        displayOrder: v.number(),
        isActive: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    let count = 0;
    for (const m of args.members) {
      const existing = await ctx.db
        .query("team_members")
        .withIndex("by_slug", (q) => q.eq("slug", m.slug))
        .first();
      
      if (!existing) {
        await ctx.db.insert("team_members", m);
        count++;
      }
    }
    return { imported: count, skipped: args.members.length - count };
  },
});

// Import Marketing Tiles
export const importMarketingTiles = internalMutation({
  args: {
    tiles: v.array(
      v.object({
        title: v.string(),
        description: v.optional(v.string()),
        soundUrl: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        displayOrder: v.number(),
        styleConfig: v.optional(v.any()),
      })
    ),
  },
  handler: async (ctx, args) => {
    let count = 0;
    for (const t of args.tiles) {
      // No unique key for tiles, just insert
      await ctx.db.insert("marketing_tiles", t);
      count++;
    }
    return { imported: count };
  },
});
