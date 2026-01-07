"use node";
// Pipedrive Integration with OAuth Flow (Node.js Runtime - Actions Only)
// Database operations are in pipedrive_db.ts

import { action } from "./_generated/server";
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
    
    // Store tokens securely via V8 mutation
    await ctx.runMutation(internal.pipedrive_db.storeTokens, {
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
    // Get stored token from V8 query
    const tokenData = await ctx.runQuery(internal.pipedrive_db.getStoredTokens);
    if (!tokenData) {
      throw new Error("Non connecté à Pipedrive. Veuillez vous authentifier.");
    }

    // Check if token needs refresh
    let accessToken = tokenData.accessToken;
    if (Date.now() > tokenData.expiresAt - 60000) {
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
          await ctx.runMutation(internal.pipedrive_db.upsertCompany, {
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
            companyId = await ctx.runQuery(internal.pipedrive_db.getCompanyByPipedriveId, {
              pipedriveId: person.org_id.value,
            });
          }
          
          if (companyId) {
            await ctx.runMutation(internal.pipedrive_db.upsertContact, {
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
            companyId = await ctx.runQuery(internal.pipedrive_db.getCompanyByPipedriveId, {
              pipedriveId: deal.org_id.value,
            });
          }

          if (companyId) {
            await ctx.runMutation(internal.pipedrive_db.upsertDeal, {
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
  
  await ctx.runMutation(internal.pipedrive_db.storeTokens, {
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
    const tokenData = await ctx.runQuery(internal.pipedrive_db.getStoredTokens);
    if (!tokenData) {
      throw new Error("Non connecté à Pipedrive");
    }

    let accessToken = tokenData.accessToken;
    if (Date.now() > tokenData.expiresAt - 60000) {
      accessToken = await refreshAccessToken(ctx, tokenData.refreshToken);
    }

    const deal = await ctx.runQuery(internal.pipedrive_db.getDealById, { dealId: args.dealId });
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
        await ctx.runMutation(internal.pipedrive_db.linkPipedriveDeal, {
          dealId: args.dealId,
          pipedriveId: data.data.id,
        });
      }
    }

    return { success: true };
  },
});

// Check if connected to Pipedrive
export const isConnected = action({
  args: {},
  handler: async (ctx): Promise<boolean> => {
    const tokens = await ctx.runQuery(internal.pipedrive_db.getStoredTokens);
    return !!tokens && Date.now() < tokens.expiresAt;
  },
});
