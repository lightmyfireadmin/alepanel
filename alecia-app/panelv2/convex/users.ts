import { query } from "./_generated/server";
import { getOptionalUser } from "./auth_utils";

// Re-export for signature panel and other components
export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getOptionalUser(ctx);
    if (!currentUser) return []; // Not authenticated
    
    const users = await ctx.db.query("users").collect();
    return users.map((u) => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatarUrl: u.avatarUrl,
    }));
  },
});

