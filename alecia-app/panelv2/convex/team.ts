// Team Members CRUD Mutations
// Admin functions for managing team profiles

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============================================
// QUERIES (Admin)
// ============================================

export const list = query({
  args: { includeInactive: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let members = await ctx.db.query("team_members").collect();
    
    if (!args.includeInactive) {
      members = members.filter(m => m.isActive);
    }
    
    return members.sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

export const getById = query({
  args: { id: v.id("team_members") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// ============================================
// MUTATIONS
// ============================================

export const create = mutation({
  args: {
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
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const members = await ctx.db.query("team_members").collect();
    const maxOrder = members.length > 0
      ? Math.max(...members.map(m => m.displayOrder))
      : -1;

    return await ctx.db.insert("team_members", {
      ...args,
      displayOrder: maxOrder + 1,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("team_members"),
    slug: v.optional(v.string()),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    photo: v.optional(v.string()),
    bioFr: v.optional(v.string()),
    bioEn: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    email: v.optional(v.string()),
    sectorsExpertise: v.optional(v.array(v.string())),
    transactionSlugs: v.optional(v.array(v.string())),
    isActive: v.optional(v.boolean()),
    displayOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    
    await ctx.db.patch(id, cleanUpdates);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("team_members") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const toggleActive = mutation({
  args: { id: v.id("team_members") },
  handler: async (ctx, args) => {
    const member = await ctx.db.get(args.id);
    if (!member) throw new Error("Team member not found");
    
    await ctx.db.patch(args.id, { isActive: !member.isActive });
  },
});

export const reorder = mutation({
  args: {
    orderedIds: v.array(v.id("team_members")),
  },
  handler: async (ctx, args) => {
    for (let i = 0; i < args.orderedIds.length; i++) {
      await ctx.db.patch(args.orderedIds[i], { displayOrder: i });
    }
  },
});
