import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getOptionalUser, getAuthenticatedUser } from "./auth_utils";

// ============================================
// RESEARCH TASKS
// ============================================

export const getTasks = query({
  args: {
    status: v.optional(v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done")
    )),
    assigneeId: v.optional(v.id("users")),
    dealId: v.optional(v.id("deals")),
  },
  handler: async (ctx, args) => {
    const user = await getOptionalUser(ctx);
    if (!user) return []; // Not authenticated

    let tasks;
    if (args.status) {
      tasks = await ctx.db
        .query("research_tasks")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    } else if (args.assigneeId) {
      tasks = await ctx.db
        .query("research_tasks")
        .withIndex("by_assigneeId", (q) => q.eq("assigneeId", args.assigneeId))
        .order("desc")
        .collect();
    } else if (args.dealId) {
      tasks = await ctx.db
        .query("research_tasks")
        .withIndex("by_dealId", (q) => q.eq("dealId", args.dealId))
        .order("desc")
        .collect();
    } else {
      tasks = await ctx.db.query("research_tasks").order("desc").collect();
    }

    // Enrich with user info
    const enriched = await Promise.all(
      tasks.map(async (task) => {
        const assignee = task.assigneeId ? await ctx.db.get(task.assigneeId) : null;
        const creator = await ctx.db.get(task.creatorId);
        const deal = task.dealId ? await ctx.db.get(task.dealId) : null;
        const company = task.companyId ? await ctx.db.get(task.companyId) : null;

        return {
          ...task,
          assigneeName: assignee?.name ?? "Non assigné",
          assigneeAvatar: assignee?.avatarUrl,
          creatorName: creator?.name ?? "Inconnu",
          dealTitle: deal?.title,
          companyName: company?.name,
        };
      })
    );

    return enriched;
  },
});

export const getMyTasks = query({
  args: {},
  handler: async (ctx) => {
    const user = await getOptionalUser(ctx);
    if (!user) return []; // Not authenticated

    const tasks = await ctx.db
      .query("research_tasks")
      .withIndex("by_assigneeId", (q) => q.eq("assigneeId", user._id))
      .order("desc")
      .collect();

    // Enrich
    const enriched = await Promise.all(
      tasks.map(async (task) => {
        const deal = task.dealId ? await ctx.db.get(task.dealId) : null;
        return {
          ...task,
          dealTitle: deal?.title,
        };
      })
    );

    return enriched;
  },
});

export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    dealId: v.optional(v.id("deals")),
    companyId: v.optional(v.id("companies")),
    assigneeId: v.optional(v.id("users")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);

    return await ctx.db.insert("research_tasks", {
      ...args,
      creatorId: user._id,
      status: "todo",
    });
  },
});

export const updateTask = mutation({
  args: {
    taskId: v.id("research_tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    assigneeId: v.optional(v.id("users")),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    status: v.optional(v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done")
    )),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Tâche non trouvée");

    const { taskId, ...updates } = args;

    // Set completedAt if marking as done
    if (updates.status === "done" && task.status !== "done") {
      (updates as any).completedAt = Date.now();
    }

    await ctx.db.patch(taskId, updates);
  },
});

export const deleteTask = mutation({
  args: { taskId: v.id("research_tasks") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    const task = await ctx.db.get(args.taskId);

    if (!task) throw new Error("Tâche non trouvée");
    if (task.creatorId !== user._id && user.role !== "sudo") {
      throw new Error("Permission refusée");
    }

    await ctx.db.delete(args.taskId);
  },
});

// Quick status change
export const moveTask = mutation({
  args: {
    taskId: v.id("research_tasks"),
    newStatus: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done")
    ),
  },
  handler: async (ctx, args) => {
    await getAuthenticatedUser(ctx);

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Tâche non trouvée");

    const updates: any = { status: args.newStatus };
    if (args.newStatus === "done" && task.status !== "done") {
      updates.completedAt = Date.now();
    }

    await ctx.db.patch(args.taskId, updates);
  },
});

// Get task statistics
export const getTaskStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getOptionalUser(ctx);
    if (!user) return { total: 0, todo: 0, inProgress: 0, review: 0, done: 0, overdue: 0 };

    const tasks = await ctx.db.query("research_tasks").collect();

    const stats = {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in_progress").length,
      review: tasks.filter((t) => t.status === "review").length,
      done: tasks.filter((t) => t.status === "done").length,
      overdue: tasks.filter(
        (t) => t.dueDate && t.dueDate < Date.now() && t.status !== "done"
      ).length,
    };

    return stats;
  },
});
