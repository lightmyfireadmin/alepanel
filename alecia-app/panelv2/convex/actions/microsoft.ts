"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import "isomorphic-fetch";
import { Client } from "@microsoft/microsoft-graph-client";

// Helper to init client with user's access token from Clerk OAuth
const getGraphClient = (accessToken: string) => {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
};

/**
 * List files in OneDrive root or a specific folder
 */
export const getOneDriveFiles = action({
  args: {
    accessToken: v.string(),
    folderId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const client = getGraphClient(args.accessToken);

    try {
      const endpoint = args.folderId
        ? `/me/drive/items/${args.folderId}/children`
        : "/me/drive/root/children";

      const response = await client
        .api(endpoint)
        .select("id,name,webUrl,size,lastModifiedDateTime,folder,file,parentReference")
        .orderby("name")
        .get();

      return response.value.map((item: Record<string, unknown>) => ({
        id: item.id,
        name: item.name,
        webUrl: item.webUrl,
        size: item.size || 0,
        lastModified: item.lastModifiedDateTime,
        type: item.folder ? "folder" : "file",
        mimeType: (item.file as Record<string, string>)?.mimeType,
        driveId: (item.parentReference as Record<string, string>)?.driveId,
      }));
    } catch (error) {
      console.error("Graph API Error:", error);
      throw new Error("Failed to fetch OneDrive files");
    }
  },
});

/**
 * Search for files in OneDrive by name or content
 */
export const searchOneDriveFiles = action({
  args: {
    accessToken: v.string(),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const client = getGraphClient(args.accessToken);

    try {
      const response = await client
        .api(`/me/drive/root/search(q='${encodeURIComponent(args.query)}')`)
        .select("id,name,webUrl,size,lastModifiedDateTime,file,parentReference")
        .top(25)
        .get();

      return response.value.map((item: Record<string, unknown>) => ({
        id: item.id,
        name: item.name,
        webUrl: item.webUrl,
        size: item.size || 0,
        lastModified: item.lastModifiedDateTime,
        mimeType: (item.file as Record<string, string>)?.mimeType,
        driveId: (item.parentReference as Record<string, string>)?.driveId,
        path: (item.parentReference as Record<string, string>)?.path,
      }));
    } catch (error) {
      console.error("Graph API Search Error:", error);
      throw new Error("Failed to search OneDrive files");
    }
  },
});

/**
 * Get an editable link for a file (opens in Office Online)
 */
export const getEditableLink = action({
  args: {
    accessToken: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const client = getGraphClient(args.accessToken);
    const item = await client
      .api(`/me/drive/items/${args.fileId}`)
      .select("webUrl")
      .get();
    return item.webUrl;
  },
});

/**
 * Create a sharing link with edit permissions
 */
export const createSharingLink = action({
  args: {
    accessToken: v.string(),
    driveId: v.string(),
    fileId: v.string(),
    scope: v.optional(v.union(v.literal("anonymous"), v.literal("organization"))),
  },
  handler: async (ctx, args) => {
    const client = getGraphClient(args.accessToken);

    try {
      const response = await client
        .api(`/drives/${args.driveId}/items/${args.fileId}/createLink`)
        .post({
          type: "edit",
          scope: args.scope || "organization",
        });

      return {
        shareId: response.id,
        webUrl: response.link.webUrl,
        scope: response.link.scope,
      };
    } catch (error) {
      console.error("Graph API Sharing Error:", error);
      throw new Error("Failed to create sharing link");
    }
  },
});

/**
 * Read data from an Excel file range
 * This is the "Game Changer" for M&A - import financial data directly!
 */
export const readExcelRange = action({
  args: {
    accessToken: v.string(),
    driveId: v.string(),
    fileId: v.string(),
    sheetName: v.string(),
    range: v.string(), // e.g., "A1:D10" or "B2:B50"
  },
  handler: async (ctx, args) => {
    const client = getGraphClient(args.accessToken);

    try {
      const response = await client
        .api(
          `/drives/${args.driveId}/items/${args.fileId}/workbook/worksheets/${encodeURIComponent(args.sheetName)}/range(address='${args.range}')`
        )
        .get();

      return {
        values: response.values,
        address: response.address,
        rowCount: response.rowCount,
        columnCount: response.columnCount,
        formulas: response.formulas,
      };
    } catch (error) {
      console.error("Excel Read Error:", error);
      throw new Error(`Failed to read Excel range: ${args.range}`);
    }
  },
});

/**
 * Get list of worksheets in an Excel file
 */
export const getExcelWorksheets = action({
  args: {
    accessToken: v.string(),
    driveId: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const client = getGraphClient(args.accessToken);

    try {
      const response = await client
        .api(`/drives/${args.driveId}/items/${args.fileId}/workbook/worksheets`)
        .get();

      return response.value.map((sheet: Record<string, unknown>) => ({
        id: sheet.id,
        name: sheet.name,
        position: sheet.position,
        visibility: sheet.visibility,
      }));
    } catch (error) {
      console.error("Excel Worksheets Error:", error);
      throw new Error("Failed to get Excel worksheets");
    }
  },
});

/**
 * Get used range (auto-detect data bounds) from an Excel worksheet
 */
export const getExcelUsedRange = action({
  args: {
    accessToken: v.string(),
    driveId: v.string(),
    fileId: v.string(),
    sheetName: v.string(),
  },
  handler: async (ctx, args) => {
    const client = getGraphClient(args.accessToken);

    try {
      const response = await client
        .api(
          `/drives/${args.driveId}/items/${args.fileId}/workbook/worksheets/${encodeURIComponent(args.sheetName)}/usedRange`
        )
        .get();

      return {
        values: response.values,
        address: response.address,
        rowCount: response.rowCount,
        columnCount: response.columnCount,
      };
    } catch (error) {
      console.error("Excel Used Range Error:", error);
      throw new Error("Failed to get Excel used range");
    }
  },
});

/**
 * Write data to an Excel file range
 */
export const writeExcelRange = action({
  args: {
    accessToken: v.string(),
    driveId: v.string(),
    fileId: v.string(),
    sheetName: v.string(),
    range: v.string(),
    values: v.array(v.array(v.union(v.string(), v.number(), v.boolean(), v.null()))),
  },
  handler: async (ctx, args) => {
    const client = getGraphClient(args.accessToken);

    try {
      await client
        .api(
          `/drives/${args.driveId}/items/${args.fileId}/workbook/worksheets/${encodeURIComponent(args.sheetName)}/range(address='${args.range}')`
        )
        .patch({ values: args.values });

      return { success: true };
    } catch (error) {
      console.error("Excel Write Error:", error);
      throw new Error(`Failed to write to Excel range: ${args.range}`);
    }
  },
});

/**
 * Get Microsoft user profile from Graph API
 */
export const getMicrosoftProfile = action({
  args: {
    accessToken: v.string(),
  },
  handler: async (ctx, args) => {
    const client = getGraphClient(args.accessToken);

    try {
      const user = await client
        .api("/me")
        .select("id,displayName,mail,userPrincipalName,jobTitle,officeLocation")
        .get();

      return {
        id: user.id,
        displayName: user.displayName,
        email: user.mail || user.userPrincipalName,
        jobTitle: user.jobTitle,
        officeLocation: user.officeLocation,
      };
    } catch (error) {
      console.error("Profile Error:", error);
      throw new Error("Failed to get Microsoft profile");
    }
  },
});

/**
 * Create a folder in OneDrive (useful for Data Room structure)
 */
export const createOneDriveFolder = action({
  args: {
    accessToken: v.string(),
    parentFolderId: v.optional(v.string()),
    folderName: v.string(),
  },
  handler: async (ctx, args) => {
    const client = getGraphClient(args.accessToken);

    try {
      const endpoint = args.parentFolderId
        ? `/me/drive/items/${args.parentFolderId}/children`
        : "/me/drive/root/children";

      const response = await client.api(endpoint).post({
        name: args.folderName,
        folder: {},
        "@microsoft.graph.conflictBehavior": "rename",
      });

      return {
        id: response.id,
        name: response.name,
        webUrl: response.webUrl,
        driveId: response.parentReference?.driveId,
      };
    } catch (error) {
      console.error("Create Folder Error:", error);
      throw new Error("Failed to create OneDrive folder");
    }
  },
});

/**
 * Helper: Extract key financial metrics from Excel data
 * Maps common French accounting terms to standard fields
 */
export const parseFinancialExcelData = action({
  args: {
    values: v.array(v.array(v.union(v.string(), v.number(), v.boolean(), v.null()))),
  },
  handler: async (ctx, args) => {
    const data = args.values;
    const metrics: Record<string, number | undefined> = {};

    // Common French financial terms to look for
    const patterns: Record<string, RegExp> = {
      revenue: /chiffre\s*d['']?affaires|ca\s*ht|total\s*ventes/i,
      ebitda: /ebitda|ebe|excédent\s*brut/i,
      netResult: /résultat\s*net|bénéfice\s*net/i,
      equity: /capitaux\s*propres|fonds\s*propres/i,
      netDebt: /dette\s*nette|endettement/i,
      employees: /effectif|salariés|employés/i,
    };

    // Scan for patterns in labels and extract adjacent values
    for (let row = 0; row < data.length; row++) {
      for (let col = 0; col < data[row].length; col++) {
        const cell = data[row][col];
        if (typeof cell !== "string") continue;

        for (const [key, pattern] of Object.entries(patterns)) {
          if (pattern.test(cell)) {
            // Look for number in next column or same row
            const nextCell = data[row][col + 1];
            if (typeof nextCell === "number") {
              metrics[key] = nextCell;
            }
          }
        }
      }
    }

    return metrics;
  },
});
