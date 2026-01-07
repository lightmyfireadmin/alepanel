"use node";
// Pipedrive Integration with OAuth Flow
// Uses official pipedrive package with OAuth instead of API key

import { action, internalMutation, internalQuery, httpAction } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// ============================================
// OAUTH CONFIGURATION
// ============================================

const PIPEDRIVE_CLIENT_ID = process.env.PIPEDRIVE_CLIENT_ID;
const PIPEDRIVE_CLIENT_SECRET = process.env.PIPEDRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/pipedrive/callback`
  : "http://localhost:3000/api/auth/pipedrive/callback";

// ============================================
// OAUTH FLOW ACTIONS
// ============================================

export const getAuthUrl = action({
  args: {},
  handler: async () => {
    if (!PIPEDRIVE_CLIENT_ID) {
      throw new Error("PIPEDRIVE_CLIENT_ID non configuré");
    }

    const scopes = [
      "deals:read",
      "deals:write", 
      "organizations:read",
      "organizations:write",
      "persons:read",
      "persons:write",
    ].join(" ");

    const authUrl = new URL("https://oauth.pipedrive.com/oauth/authorize");
    authUrl.searchParams.set("client_id", PIPEDRIVE_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.set("scope", scopes);
    authUrl.searchParams.set("state", crypto.randomUUID());

    return authUrl.toString();
  },
});

export const exchangeCodeForToken = action({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    if (!PIPEDRIVE_CLIENT_ID || !PIPEDRIVE_CLIENT_SECRET) {
      throw new Error("Pipedrive OAuth credentials non configurés");
    }

    const tokenResponse = await fetch("https://oauth.pipedrive.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${PIPEDRIVE_CLIENT_ID}:${PIPEDRIVE_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: args.code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      throw new Error(`Erreur OAuth: ${error}`);
    }

    const tokens = await tokenResponse.json();
    
    // Store tokens securely (in a real app, encrypt and store per-user)
    await ctx.runMutation(internal.pipedrive.storeTokens, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + tokens.expires_in * 1000,
      apiDomain: tokens.api_domain,
    });

    return { success: true, apiDomain: tokens.api_domain };
  },
});

// ============================================
// SYNC FROM PIPEDRIVE (Pull using OAuth token)
// ============================================

export const syncFromPipedrive = action({
  args: {},
  handler: async (ctx) => {
    // Get stored token
    const tokenData = await ctx.runQuery(internal.pipedrive.getStoredTokens);
    if (!tokenData) {
      throw new Error("Non connecté à Pipedrive. Veuillez vous authentifier.");
    }

    // Check if token needs refresh
    let accessToken = tokenData.accessToken;
    if (Date.now() > tokenData.expiresAt - 60000) {
      // Refresh token
      accessToken = await refreshAccessToken(ctx, tokenData.refreshToken);
    }

    const baseUrl = `https://${tokenData.apiDomain}`;
    const results = { companies: 0, deals: 0, contacts: 0 };

    // 1. Sync Organizations → Companies
    const orgsResponse = await fetch(`${baseUrl}/v1/organizations?limit=500`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (orgsResponse.ok) {
      const orgsData = await orgsResponse.json();
      if (orgsData.data) {
        for (const org of orgsData.data) {
          await ctx.runMutation(internal.pipedrive.upsertCompany, {
            pipedriveId: org.id,
            name: org.name || "Sans nom",
            address: org.address || undefined,
          });
          results.companies++;
        }
      }
    }

    // 2. Sync Persons → Contacts
    const personsResponse = await fetch(`${baseUrl}/v1/persons?limit=500`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (personsResponse.ok) {
      const personsData = await personsResponse.json();
      if (personsData.data) {
        for (const person of personsData.data) {
          let companyId = null;
          if (person.org_id?.value) {
            companyId = await ctx.runQuery(internal.pipedrive.getCompanyByPipedriveId, {
              pipedriveId: person.org_id.value,
            });
          }
          
          if (companyId) {
            await ctx.runMutation(internal.pipedrive.upsertContact, {
              companyId,
              fullName: person.name || "Sans nom",
              email: person.email?.[0]?.value,
              phone: person.phone?.[0]?.value,
            });
            results.contacts++;
          }
        }
      }
    }

    // 3. Sync Deals
    const dealsResponse = await fetch(`${baseUrl}/v1/deals?limit=500`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (dealsResponse.ok) {
      const dealsData = await dealsResponse.json();
      if (dealsData.data) {
        for (const deal of dealsData.data) {
          let stage = "Lead";
          if (deal.status === "won") stage = "Closing";
          else if (deal.status === "lost") stage = "Closing";
          else if (deal.probability >= 80) stage = "Due Diligence";
          else if (deal.probability >= 50) stage = "Offer Received";
          else if (deal.probability >= 20) stage = "NDA Signed";

          let companyId = null;
          if (deal.org_id?.value) {
            companyId = await ctx.runQuery(internal.pipedrive.getCompanyByPipedriveId, {
              pipedriveId: deal.org_id.value,
            });
          }

          if (companyId) {
            await ctx.runMutation(internal.pipedrive.upsertDeal, {
              pipedriveId: deal.id,
              title: deal.title,
              amount: deal.value || 0,
              stage,
              companyId,
            });
            results.deals++;
          }
        }
      }
    }

    return results;
  },
});

// Helper: Refresh access token
async function refreshAccessToken(ctx: any, refreshToken: string): Promise<string> {
  if (!PIPEDRIVE_CLIENT_ID || !PIPEDRIVE_CLIENT_SECRET) {
    throw new Error("OAuth credentials missing");
  }

  const response = await fetch("https://oauth.pipedrive.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${PIPEDRIVE_CLIENT_ID}:${PIPEDRIVE_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Échec du rafraîchissement du token");
  }

  const tokens = await response.json();
  
  await ctx.runMutation(internal.pipedrive.storeTokens, {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + tokens.expires_in * 1000,
    apiDomain: tokens.api_domain,
  });

  return tokens.access_token;
}

// ============================================
// PUSH TO PIPEDRIVE (Write back)
// ============================================

export const pushDealToPipedrive = action({
  args: { dealId: v.id("deals") },
  handler: async (ctx, args) => {
    const tokenData = await ctx.runQuery(internal.pipedrive.getStoredTokens);
    if (!tokenData) {
      throw new Error("Non connecté à Pipedrive");
    }

    let accessToken = tokenData.accessToken;
    if (Date.now() > tokenData.expiresAt - 60000) {
      accessToken = await refreshAccessToken(ctx, tokenData.refreshToken);
    }

    const deal = await ctx.runQuery(internal.pipedrive.getDealById, { dealId: args.dealId });
    if (!deal) throw new Error("Deal non trouvé");

    const baseUrl = `https://${tokenData.apiDomain}/v1`;
    const status = deal.stage === "Closing" ? "won" : "open";

    if (deal.pipedriveId) {
      await fetch(`${baseUrl}/deals/${deal.pipedriveId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: deal.title, value: deal.amount, status }),
      });
    } else {
      const response = await fetch(`${baseUrl}/deals`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: deal.title, value: deal.amount, status }),
      });
      const data = await response.json();
      if (data.data?.id) {
        await ctx.runMutation(internal.pipedrive.linkPipedriveDeal, {
          dealId: args.dealId,
          pipedriveId: data.data.id,
        });
      }
    }

    return { success: true };
  },
});

// ============================================
// TOKEN STORAGE (Internal)
// ============================================

export const storeTokens = internalMutation({
  args: {
    accessToken: v.string(),
    refreshToken: v.string(),
    expiresAt: v.number(),
    apiDomain: v.string(),
  },
  handler: async (ctx, args) => {
    // Store in global_settings or a dedicated table
    // For simplicity, using a singleton pattern
    const existing = await ctx.db.query("global_settings").first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        // @ts-ignore - extending schema dynamically
        pipedriveTokens: args,
      });
    }
    // If no global_settings yet, tokens will be stored when settings are created
  },
});

export const getStoredTokens = internalQuery({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("global_settings").first();
    // @ts-ignore
    return settings?.pipedriveTokens as {
      accessToken: string;
      refreshToken: string;
      expiresAt: number;
      apiDomain: string;
    } | null;
  },
});

// ============================================
// INTERNAL MUTATIONS (Database operations)
// ============================================

export const upsertCompany = internalMutation({
  args: {
    pipedriveId: v.number(),
    name: v.string(),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("companies")
      .withIndex("by_pipedriveId", (q) => q.eq("pipedriveId", String(args.pipedriveId)))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { name: args.name });
      return existing._id;
    } else {
      return await ctx.db.insert("companies", {
        name: args.name,
        pipedriveId: String(args.pipedriveId),
      });
    }
  },
});

export const upsertContact = internalMutation({
  args: {
    companyId: v.id("companies"),
    fullName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = args.email
      ? await ctx.db.query("contacts").filter((q) => q.eq(q.field("email"), args.email)).first()
      : null;

    if (existing) {
      await ctx.db.patch(existing._id, { fullName: args.fullName, phone: args.phone });
      return existing._id;
    } else {
      return await ctx.db.insert("contacts", {
        companyId: args.companyId,
        fullName: args.fullName,
        email: args.email,
        phone: args.phone,
      });
    }
  },
});

export const upsertDeal = internalMutation({
  args: {
    pipedriveId: v.number(),
    title: v.string(),
    amount: v.number(),
    stage: v.string(),
    companyId: v.id("companies"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("deals")
      .withIndex("by_pipedriveId", (q) => q.eq("pipedriveId", args.pipedriveId))
      .first();

    const defaultOwner = await ctx.db.query("users").first();
    if (!defaultOwner) throw new Error("Aucun utilisateur - créez d'abord un compte");

    if (existing) {
      await ctx.db.patch(existing._id, { title: args.title, amount: args.amount, stage: args.stage });
      return existing._id;
    } else {
      return await ctx.db.insert("deals", {
        pipedriveId: args.pipedriveId,
        title: args.title,
        amount: args.amount,
        stage: args.stage,
        companyId: args.companyId,
        ownerId: defaultOwner._id,
      });
    }
  },
});

export const linkPipedriveDeal = internalMutation({
  args: { dealId: v.id("deals"), pipedriveId: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.dealId, { pipedriveId: args.pipedriveId });
  },
});

export const getCompanyByPipedriveId = internalQuery({
  args: { pipedriveId: v.number() },
  handler: async (ctx, args) => {
    const company = await ctx.db
      .query("companies")
      .withIndex("by_pipedriveId", (q) => q.eq("pipedriveId", String(args.pipedriveId)))
      .first();
    return company?._id ?? null;
  },
});

export const getDealById = internalQuery({
  args: { dealId: v.id("deals") },
  handler: async (ctx, args) => await ctx.db.get(args.dealId),
});

// Check if connected to Pipedrive
export const isConnected = action({
  args: {},
  handler: async (ctx): Promise<boolean> => {
    const tokens = await ctx.runQuery(internal.pipedrive.getStoredTokens);
    return !!tokens && Date.now() < tokens.expiresAt;
  },
});
