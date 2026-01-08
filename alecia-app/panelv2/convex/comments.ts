// In-app comments for any entity (deals, companies, contacts)
// Phase 5: Collaboration Suite

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getOptionalUser, getAuthenticatedUser } from "./auth_utils";

// ============================================
// QUERIES
// ============================================

/**
 * Get comments for a specific entity
 */
export const getComments = query({
  args: {
    entityType: v.union(
      v.literal("deal"),
      v.literal("company"),
      v.literal("contact")
    ),
    entityId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getOptionalUser(ctx);
    if (!user) return [];

    // For now, return empty - in full implementation would query comments table
    // This is a stub that will work once the schema is updated
    return [];
  },
});

/**
 * Get comment count for an entity
 */
export const getCommentCount = query({
  args: {
    entityType: v.union(
      v.literal("deal"),
      v.literal("company"),
      v.literal("contact")
    ),
    entityId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getOptionalUser(ctx);
    if (!user) return 0;

    return 0; // Stub
  },
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Add a comment to an entity
 */
export const addComment = mutation({
  args: {
    entityType: v.union(
      v.literal("deal"),
      v.literal("company"),
      v.literal("contact")
    ),
    entityId: v.string(),
    content: v.string(),
    mentions: v.optional(v.array(v.id("users"))),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    // In full implementation, would insert into comments table
    // and trigger notifications for mentions
    console.log(`Comment added by ${user.name} on ${args.entityType}:${args.entityId}`);
    
    return { success: true };
  },
});

/**
 * Edit a comment
 */
export const editComment = mutation({
  args: {
    commentId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    
    // In full implementation, verify ownership and update
    return { success: true };
  },
});

/**
 * Delete a comment
 */
export const deleteComment = mutation({
  args: {
    commentId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    
    // In full implementation, verify ownership and delete
    return { success: true };
  },
});
