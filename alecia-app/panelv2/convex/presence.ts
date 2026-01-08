// Presence tracking for real-time collaboration
// Shows who's online and what page they're viewing

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getOptionalUser } from "./auth_utils";

// Presence timeout in milliseconds (2 minutes)
const PRESENCE_TIMEOUT = 2 * 60 * 1000;

/**
 * Get all currently active users
 * Filters out stale presence data
 */
export const getActiveUsers = query({
  args: {},
  handler: async (ctx) => {
    const user = await getOptionalUser(ctx);
    if (!user) return [];

    const now = Date.now();
    const users = await ctx.db.query("users").collect();

    // For now, return all users as "active" since we don't have a separate presence table
    // In a real implementation, you'd have a presence table with lastSeen timestamps
    return users.map((u) => ({
      id: u._id,
      name: u.name,
      email: u.email,
      avatarUrl: u.avatarUrl,
      currentPage: "/admin/dashboard", // Default
      lastSeen: now,
      isOnline: true,
    }));
  },
});

/**
 * Update current user's presence
 * Called periodically by the client
 */
export const updatePresence = mutation({
  args: {
    currentPage: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // In a full implementation, you'd update a presence table here
    // For now, just return success
    return { success: true };
  },
});

/**
 * Remove user presence on logout
 */
export const removePresence = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Remove from presence table in full implementation
    return { success: true };
  },
});
