// Activity Digest - Scheduled email summaries
// Uses Convex scheduled functions to send daily/weekly digests

import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getOptionalUser, getAuthenticatedUser } from "./auth_utils";

// ============================================
// QUERIES
// ============================================

/**
 * Get user's digest preferences
 */
export const getDigestPreferences = query({
  args: {},
  handler: async (ctx) => {
    const user = await getOptionalUser(ctx);
    if (!user) return null;

    // Return default preferences if none set
    return {
      enabled: user.digestEnabled ?? true,
      frequency: user.digestFrequency ?? "daily", // "daily" | "weekly" | "none"
      includeDeals: true,
      includeComments: true,
      includeMentions: true,
    };
  },
});

/**
 * Get recent activity for digest preview
 */
export const getActivitySummary = query({
  args: {
    since: v.optional(v.number()), // Unix timestamp
  },
  handler: async (ctx, args) => {
    const user = await getOptionalUser(ctx);
    if (!user) return { deals: [], comments: [], mentions: [] };

    const since = args.since || Date.now() - 24 * 60 * 60 * 1000; // Last 24h default

    // Get recent deals
    const deals = await ctx.db
      .query("deals")
      .order("desc")
      .take(10);

    const recentDeals = deals.filter((d) => d._creationTime > since);

    // Would also fetch comments and mentions in full implementation
    return {
      deals: recentDeals.map((d) => ({
        id: d._id,
        title: d.title,
        stage: d.stage,
        createdAt: d._creationTime,
      })),
      comments: [],
      mentions: [],
      period: {
        from: new Date(since).toISOString(),
        to: new Date().toISOString(),
      },
    };
  },
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Update digest preferences
 */
export const updateDigestPreferences = mutation({
  args: {
    enabled: v.boolean(),
    frequency: v.union(v.literal("daily"), v.literal("weekly"), v.literal("none")),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    await ctx.db.patch(user._id, {
      digestEnabled: args.enabled,
      digestFrequency: args.frequency,
    });

    return { success: true };
  },
});

/**
 * Send a test digest email (for preview)
 */
export const sendTestDigest = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);

    // In full implementation, would call Resend API here
    console.log(`Sending test digest to ${user.email}`);

    return { 
      success: true, 
      message: `Test digest envoyé à ${user.email}`,
    };
  },
});

// ============================================
// SCHEDULED FUNCTIONS (Internal)
// ============================================

/**
 * Internal mutation called by scheduler to send digests
 */
export const sendScheduledDigests = internalMutation({
  args: {
    frequency: v.union(v.literal("daily"), v.literal("weekly")),
  },
  handler: async (ctx, args) => {
    // Get all users with this frequency preference
    const users = await ctx.db.query("users").collect();
    
    const eligibleUsers = users.filter(
      (u) => u.digestEnabled && u.digestFrequency === args.frequency
    );

    console.log(`Sending ${args.frequency} digest to ${eligibleUsers.length} users`);

    // In full implementation, iterate and send emails via Resend
    for (const user of eligibleUsers) {
      // await sendDigestEmail(user);
      console.log(`Would send digest to: ${user.email}`);
    }

    return { sent: eligibleUsers.length };
  },
});
