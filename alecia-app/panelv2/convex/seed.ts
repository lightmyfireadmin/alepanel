import { mutation } from "./_generated/server";

export const initialSetup = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Initialize Global Settings if missing
    const settings = await ctx.db.query("global_settings").first();
    if (!settings) {
      await ctx.db.insert("global_settings", {
        theme: {
            primaryColor: "222.2 47.4% 11.2%",
            radius: 0.5,
            font: "Inter",
        },
        governance: {
            quorumPercentage: 50,
        }
      });
      console.log("Global settings initialized.");
    } else {
        console.log("Global settings already exist.");
    }
  },
});

export const bootstrapSudo = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized: Please log in first.");

    // Check if ANY sudo user exists
    const existingSudo = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("role"), "sudo"))
        .first();

    if (existingSudo) {
        throw new Error("Bootstrap failed: A Sudo admin already exists.");
    }

    // Check if the current user record exists (Clerk sync should handle this, 
    // but if we are manually bootstrapping, we might need to find/create)
    let user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .first();

    if (!user) {
        // Auto-create user record if it doesn't exist yet (first login scenario)
        const newUserId = await ctx.db.insert("users", {
            tokenIdentifier: identity.tokenIdentifier,
            name: identity.name || identity.email || "Unknown",
            email: identity.email || "",
            avatarUrl: identity.pictureUrl,
            role: "sudo", // PROMOTE TO SUDO
        });
        console.log(`User ${newUserId} created and promoted to Sudo.`);
    } else {
        // Promote existing user
        await ctx.db.patch(user._id, { role: "sudo" });
        console.log(`User ${user._id} promoted to Sudo.`);
    }
  },
});
