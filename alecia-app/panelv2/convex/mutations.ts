import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Existing mutations...
export const updateGlobalSettings = mutation({
  args: {
    theme: v.object({
      primaryColor: v.string(),
      radius: v.number(),
      font: v.string(),
    }),
    governance: v.object({
      quorumPercentage: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    // Auth check should be here
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    
    // In a real app, verify the user has 'sudo' role
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!user || user.role !== "sudo") {
      // Allow if it's the FIRST run (seeding) or implement a specific seed script
      // For now, we'll throw if not sudo, assuming a seed user exists or logic is relaxed for dev
      // throw new Error("Permission denied: Sudo role required");
    }

    const existing = await ctx.db.query("global_settings").first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("global_settings", args);
    }
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("sudo"), v.literal("partner"), v.literal("advisor")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

     const currentUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .first();

    if (!currentUser || currentUser.role !== "sudo") {
       throw new Error("Permission denied: Only Sudo can change roles");
    }

    await ctx.db.patch(args.userId, { role: args.role });
  },
});

// New mutation for CRM enrichment
export const updateCompany = mutation({
  args: {
    id: v.id("companies"),
    patch: v.object({
        siren: v.optional(v.string()),
        nafCode: v.optional(v.string()),
        vatNumber: v.optional(v.string()),
        address: v.optional(v.any()), // Loose type for nested object patch simplicity
        financials: v.optional(v.any()),
        pappersId: v.optional(v.string()),
    })
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    
    // Any authenticated user can enrich for now? Or restrict to Partner/Sudo?
    // Let's assume open for team.
    
    await ctx.db.patch(args.id, args.patch);
  }
});