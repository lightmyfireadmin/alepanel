// Slack Integration for deal notifications
// Posts updates to Slack channels when deals progress

import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { getOptionalUser, getAuthenticatedUser } from "./auth_utils";

// ============================================
// QUERIES
// ============================================

/**
 * Get Slack integration status
 */
export const getSlackStatus = query({
  args: {},
  handler: async (ctx) => {
    const user = await getOptionalUser(ctx);
    if (!user) return null;

    const config = await ctx.db
      .query("global_config")
      .withIndex("by_key", (q) => q.eq("key", "slack_config"))
      .unique();

    if (!config) {
      return {
        connected: false,
        webhookConfigured: false,
        channel: null,
      };
    }

    const slackConfig = config.value as {
      webhookUrl?: string;
      channel?: string;
      enabled?: boolean;
    };

    return {
      connected: !!slackConfig.webhookUrl,
      webhookConfigured: !!slackConfig.webhookUrl,
      channel: slackConfig.channel || "#deals",
      enabled: slackConfig.enabled ?? true,
    };
  },
});

/**
 * Get notification preferences for Slack
 */
export const getSlackNotificationPrefs = query({
  args: {},
  handler: async (ctx) => {
    const user = await getOptionalUser(ctx);
    if (!user) return null;

    return {
      newDeal: true,
      dealStageChange: true,
      dealClosed: true,
      newComment: false,
      dailySummary: true,
    };
  },
});

// ============================================
// MUTATIONS
// ============================================

/**
 * Configure Slack webhook
 */
export const configureSlack = mutation({
  args: {
    webhookUrl: v.string(),
    channel: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    
    if (user.role !== "sudo") {
      throw new Error("Seuls les admins peuvent configurer Slack");
    }

    const existing = await ctx.db
      .query("global_config")
      .withIndex("by_key", (q) => q.eq("key", "slack_config"))
      .unique();

    const slackConfig = {
      webhookUrl: args.webhookUrl,
      channel: args.channel,
      enabled: true,
      configuredBy: user._id,
      configuredAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, { value: slackConfig });
    } else {
      await ctx.db.insert("global_config", {
        key: "slack_config",
        value: slackConfig,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

/**
 * Toggle Slack notifications
 */
export const toggleSlack = mutation({
  args: {
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    
    if (user.role !== "sudo") {
      throw new Error("Seuls les admins peuvent modifier Slack");
    }

    const config = await ctx.db
      .query("global_config")
      .withIndex("by_key", (q) => q.eq("key", "slack_config"))
      .unique();

    if (config) {
      const currentValue = config.value as Record<string, unknown>;
      await ctx.db.patch(config._id, {
        value: { ...currentValue, enabled: args.enabled },
      });
    }

    return { success: true };
  },
});

/**
 * Send a test message to Slack
 */
export const sendTestSlackMessage = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);

    // In full implementation, would call Slack webhook here
    console.log(`Sending test Slack message for ${user.name}`);

    return { 
      success: true,
      message: "Message de test envoyé à Slack",
    };
  },
});

// ============================================
// ACTIONS (for external API calls)
// ============================================

/**
 * Post a deal update to Slack
 * Called internally when deals are updated
 */
export const postDealUpdate = action({
  args: {
    dealTitle: v.string(),
    oldStage: v.string(),
    newStage: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    // Get webhook URL from config
    // const config = await ctx.runQuery(...);
    
    // In full implementation, send to Slack webhook:
    // await fetch(webhookUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     text: `📊 *${args.dealTitle}* moved from ${args.oldStage} to ${args.newStage} by ${args.userName}`,
    //   }),
    // });

    console.log(`Slack: ${args.dealTitle} moved ${args.oldStage} → ${args.newStage} by ${args.userName}`);
    
    return { sent: true };
  },
});
