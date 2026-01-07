import { query } from "./_generated/server";
import { v } from "convex/values";

// Get all companies with their details
export const getCompanies = query({
  args: {},
  handler: async (ctx) => {
    const companies = await ctx.db.query("companies").collect();
    return companies;
  },
});

// Get all contacts, optionally filtering or enriching
export const getContacts = query({
  args: {},
  handler: async (ctx) => {
    const contacts = await ctx.db.query("contacts").collect();
    
    // Enrich with company name efficiently
    // In a large scale app, we might denormalize 'companyName' onto contact or use an index join logic
    // For now, parallel fetch is fine for <1000 items
    const enriched = await Promise.all(contacts.map(async (c) => {
        const company = await ctx.db.get(c.companyId);
        return {
            ...c,
            companyName: company?.name || "Unknown Company",
            companyLogo: company?.logoUrl
        };
    }));

    return enriched;
  },
});
