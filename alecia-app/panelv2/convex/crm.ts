import { query, internalQuery } from "./_generated/server";
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

export const getContact = internalQuery({
    args: { contactId: v.id("contacts") },
    handler: async (ctx, args) => {
        const contact = await ctx.db.get(args.contactId);
        if (!contact) return null;
        
        const company = await ctx.db.get(contact.companyId);
        return { ...contact, companyName: company?.name };
    }
});