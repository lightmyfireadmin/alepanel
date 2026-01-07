import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedUser } from "./auth_utils";

// ============================================
// KANBAN COLUMNS
// ============================================

export const getKanbanColumns = query({
  args: { boardId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);
    
    const columns = await ctx.db
      .query("kanban_columns")
      .withIndex("by_boardId", (q) => q.eq("boardId", args.boardId))
      .collect();
    
    return columns.sort((a, b) => a.order - b.order);
  },
});

export const createKanbanColumn = mutation({
  args: {
    boardId: v.optional(v.string()),
    name: v.string(),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);
    
    // Get max order for this board
    const existing = await ctx.db
      .query("kanban_columns")
      .withIndex("by_boardId", (q) => q.eq("boardId", args.boardId))
      .collect();
    
    const maxOrder = existing.reduce((max, col) => Math.max(max, col.order), 0);
    
    return await ctx.db.insert("kanban_columns", {
      boardId: args.boardId,
      name: args.name,
      color: args.color,
      order: maxOrder + 1,
    });
  },
});

export const reorderKanbanColumns = mutation({
  args: {
    columnIds: v.array(v.id("kanban_columns")),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);
    
    // Update order based on array position
    await Promise.all(
      args.columnIds.map((id, index) =>
        ctx.db.patch(id, { order: index })
      )
    );
  },
});

export const deleteKanbanColumn = mutation({
  args: { columnId: v.id("kanban_columns") },
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);
    await ctx.db.delete(args.columnId);
  },
});

// ============================================
// PROJECT EVENTS (Activity Timeline)
// ============================================

export const getEvents = query({
  args: {
    dealId: v.optional(v.id("deals")),
    companyId: v.optional(v.id("companies")),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);
    
    let events;
    
    if (args.dealId) {
      events = await ctx.db
        .query("project_events")
        .withIndex("by_dealId", (q) => q.eq("dealId", args.dealId))
        .order("desc")
        .take(args.limit ?? 20);
    } else if (args.companyId) {
      events = await ctx.db
        .query("project_events")
        .withIndex("by_companyId", (q) => q.eq("companyId", args.companyId))
        .order("desc")
        .take(args.limit ?? 20);
    } else {
      // Get recent events across all
      events = await ctx.db
        .query("project_events")
        .order("desc")
        .take(args.limit ?? 20);
    }
    
    // Enrich with user info
    const enriched = await Promise.all(
      events.map(async (event) => {
        const user = await ctx.db.get(event.userId);
        return {
          ...event,
          userName: user?.name ?? "Inconnu",
          userAvatar: user?.avatarUrl,
        };
      })
    );
    
    return enriched;
  },
});

export const logEvent = mutation({
  args: {
    dealId: v.optional(v.id("deals")),
    companyId: v.optional(v.id("companies")),
    contactId: v.optional(v.id("contacts")),
    eventType: v.union(
      v.literal("status_change"),
      v.literal("note_added"),
      v.literal("document_uploaded"),
      v.literal("meeting_scheduled"),
      v.literal("email_sent"),
      v.literal("call_logged")
    ),
    title: v.string(),
    description: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    
    return await ctx.db.insert("project_events", {
      ...args,
      userId: user._id,
    });
  },
});

// Internal mutation for automatic event logging (e.g., from deal stage changes)
export const logEventInternal = internalMutation({
  args: {
    dealId: v.optional(v.id("deals")),
    companyId: v.optional(v.id("companies")),
    eventType: v.string(),
    title: v.string(),
    userId: v.id("users"),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("project_events", {
      dealId: args.dealId,
      companyId: args.companyId,
      eventType: args.eventType as any,
      title: args.title,
      userId: args.userId,
      metadata: args.metadata,
    });
  },
});
