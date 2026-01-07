import { query } from "./_generated/server";

// Dashboard statistics query
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    // Get all deals
    const deals = await ctx.db.query("deals").collect();
    
    // Calculate pipeline value
    const pipelineValue = deals.reduce((sum, deal) => sum + (deal.amount || 0), 0);
    
    // Get user count
    const users = await ctx.db.query("users").collect();
    
    // Get companies count
    const companies = await ctx.db.query("companies").collect();

    // Recent deals (last 5)
    const recentDeals = deals
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, 5)
      .map(deal => ({
        id: deal._id,
        title: deal.title,
        stage: deal.stage,
        amount: deal.amount,
      }));

    // Deals by stage
    const dealsByStage = deals.reduce((acc, deal) => {
      acc[deal.stage] = (acc[deal.stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      activeDeals: deals.length,
      pipelineValue,
      teamSize: users.length,
      companiesCount: companies.length,
      recentDeals,
      dealsByStage,
    };
  },
});
