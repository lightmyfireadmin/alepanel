// Marketing Website Public Queries
// No authentication required - for public website pages

import { query } from "./_generated/server";
import { v } from "convex/values";

// ============================================
// TRANSACTIONS (Track Record)
// ============================================

export const getTransactions = query({
  args: {
    sector: v.optional(v.string()),
    year: v.optional(v.number()),
    mandateType: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let transactions = await ctx.db.query("transactions").collect();
    
    // Filter by sector
    if (args.sector) {
      transactions = transactions.filter(t => t.sector === args.sector);
    }
    
    // Filter by year
    if (args.year) {
      transactions = transactions.filter(t => t.year === args.year);
    }
    
    // Filter by mandate type
    if (args.mandateType) {
      transactions = transactions.filter(t => t.mandateType === args.mandateType);
    }
    
    // Sort by display order, then by year descending
    transactions.sort((a, b) => {
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }
      return b.year - a.year;
    });
    
    // Limit results
    if (args.limit) {
      transactions = transactions.slice(0, args.limit);
    }
    
    return transactions;
  },
});

export const getTransactionBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("transactions")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getTransactionFilters = query({
  args: {},
  handler: async (ctx) => {
    const transactions = await ctx.db.query("transactions").collect();
    
    // Extract unique values for filters
    const sectors = [...new Set(transactions.map(t => t.sector))].sort();
    const years = [...new Set(transactions.map(t => t.year))].sort((a, b) => b - a);
    const mandateTypes = [...new Set(transactions.map(t => t.mandateType))].sort();
    const regions = [...new Set(transactions.map(t => t.region).filter(Boolean))].sort();
    
    return { sectors, years, mandateTypes, regions };
  },
});

// ============================================
// TEAM MEMBERS
// ============================================

export const getTeamMembers = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let members = await ctx.db.query("team_members").collect();
    
    // Filter active only (default: true)
    if (args.activeOnly !== false) {
      members = members.filter(m => m.isActive);
    }
    
    // Sort by display order
    members.sort((a, b) => a.displayOrder - b.displayOrder);
    
    return members;
  },
});

export const getTeamMemberBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("team_members")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// ============================================
// BLOG POSTS
// ============================================

export const getBlogPosts = query({
  args: { 
    status: v.optional(v.string()),
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("blog_posts").collect();
    
    // Filter by status (default: published)
    const targetStatus = args.status || "published";
    posts = posts.filter(p => p.status === targetStatus);
    
    // Filter by category
    if (args.category) {
      posts = posts.filter(p => p.category === args.category);
    }
    
    // Sort by published date descending
    posts.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
    
    // Limit results
    if (args.limit) {
      posts = posts.slice(0, args.limit);
    }
    
    return posts;
  },
});

export const getBlogPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blog_posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getBlogCategories = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("blog_posts").collect();
    return [...new Set(posts.map(p => p.category).filter(Boolean))].sort();
  },
});

// ============================================
// JOB OFFERS (Careers)
// ============================================

export const getJobOffers = query({
  args: { publishedOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let offers = await ctx.db.query("job_offers").collect();
    
    // Filter published only (default: true for public site)
    if (args.publishedOnly !== false) {
      offers = offers.filter(o => o.isPublished);
    }
    
    // Sort by display order
    offers.sort((a, b) => a.displayOrder - b.displayOrder);
    
    return offers;
  },
});

export const getJobOfferBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("job_offers")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// ============================================
// MARKETING TILES (Gallery)
// ============================================

export const getMarketingTiles = query({
  args: {},
  handler: async (ctx) => {
    const tiles = await ctx.db.query("marketing_tiles").collect();
    return tiles.sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

// ============================================
// FORUM CATEGORIES (Public)
// ============================================

export const getForumCategories = query({
  args: { includePrivate: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let categories = await ctx.db.query("forum_categories").collect();
    
    // Filter out private (default: exclude private)
    if (!args.includePrivate) {
      categories = categories.filter(c => !c.isPrivate);
    }
    
    // Sort by order
    categories.sort((a, b) => a.order - b.order);
    
    return categories;
  },
});

// ============================================
// GLOBAL CONFIG
// ============================================

export const getConfig = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const config = await ctx.db
      .query("global_config")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    return config?.value;
  },
});

export const getAllConfig = query({
  args: {},
  handler: async (ctx) => {
    const configs = await ctx.db.query("global_config").collect();
    const result: Record<string, unknown> = {};
    for (const c of configs) {
      result[c.key] = c.value;
    }
    return result;
  },
});
