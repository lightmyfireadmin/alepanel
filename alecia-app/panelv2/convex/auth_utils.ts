import { QueryCtx, MutationCtx } from "./_generated/server";

export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: Not logged in");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique();

  if (!user) {
    throw new Error("Unauthorized: User not found in database");
  }

  return user;
}

export async function checkRole(
  ctx: QueryCtx | MutationCtx, 
  allowedRoles: ("sudo" | "partner" | "advisor")[]
) {
  const user = await getAuthenticatedUser(ctx);
  if (!allowedRoles.includes(user.role)) {
    throw new Error(`Forbidden: Role ${user.role} does not have access`);
  }
  return user;
}
