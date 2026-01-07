"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import "isomorphic-fetch"; 
import { Client } from "@microsoft/microsoft-graph-client";

// Helper to init client
const getGraphClient = (accessToken: string) => {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
};

export const getOneDriveFiles = action({
  args: { 
    accessToken: v.string(), // Passed from Clerk on client side
    folderId: v.optional(v.string()) 
  },
  handler: async (ctx, args) => {
    const client = getGraphClient(args.accessToken);

    try {
      const endpoint = args.folderId 
        ? `/me/drive/items/${args.folderId}/children` 
        : "/me/drive/root/children"; // Or /me/drive/recent

      const response = await client.api(endpoint).select("id,name,webUrl,lastModifiedDateTime,folder,file").get();
      
      return response.value.map((item: any) => ({
        id: item.id,
        name: item.name,
        webUrl: item.webUrl, // The Edit Link!
        lastModified: item.lastModifiedDateTime,
        type: item.folder ? "folder" : "file"
      }));

    } catch (error) {
      console.error("Graph API Error:", error);
      throw new Error("Failed to fetch OneDrive files");
    }
  },
});

export const getEditableLink = action({
    args: {
        accessToken: v.string(),
        fileId: v.string()
    },
    handler: async (ctx, args) => {
        const client = getGraphClient(args.accessToken);
        // Usually webUrl from list is enough, but we can specifically ask for a permission link
        // For simplicity, we just return the item's webUrl which opens in Office Online
        const item = await client.api(`/me/drive/items/${args.fileId}`).select("webUrl").get();
        return item.webUrl;
    }
});
