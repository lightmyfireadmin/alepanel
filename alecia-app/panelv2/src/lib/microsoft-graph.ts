/**
 * Microsoft Graph Client Configuration
 * 
 * This module provides utilities for interacting with Microsoft 365 services
 * (OneDrive, SharePoint, Excel, etc.) via Microsoft Graph API.
 * 
 * Users authenticate via Microsoft SSO through Clerk, and their access tokens
 * are used to access their files without requiring separate API keys.
 */

import { Client } from "@microsoft/microsoft-graph-client";

// Microsoft Graph API scopes required for M&A operations
export const MICROSOFT_SCOPES = [
  "openid",
  "email",
  "profile",
  "offline_access",
  "User.Read",
  "Files.ReadWrite.All",      // Full OneDrive access (Data Room)
  "Sites.ReadWrite.All",       // SharePoint sites
  "Calendars.ReadWrite",       // Meeting scheduling
] as const;

// Type for Microsoft user profile
export interface MicrosoftUserProfile {
  id: string;
  displayName: string;
  email: string;
  jobTitle?: string;
  officeLocation?: string;
}

// Type for OneDrive/SharePoint file
export interface MicrosoftFile {
  id: string;
  name: string;
  webUrl: string;
  driveId: string;
  size: number;
  mimeType?: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
  parentPath?: string;
}

// Type for Excel range data
export interface ExcelRangeData {
  values: (string | number | boolean | null)[][];
  address: string;
  rowCount: number;
  columnCount: number;
}

/**
 * Creates an authenticated Microsoft Graph client
 * Uses the access token from Clerk's Microsoft OAuth
 */
export function createGraphClient(accessToken: string): Client {
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });
}

/**
 * Fetches the current user's Microsoft profile
 */
export async function getMicrosoftProfile(
  client: Client
): Promise<MicrosoftUserProfile> {
  const user = await client.api("/me").get();
  return {
    id: user.id,
    displayName: user.displayName,
    email: user.mail || user.userPrincipalName,
    jobTitle: user.jobTitle,
    officeLocation: user.officeLocation,
  };
}

/**
 * Lists files in the user's OneDrive root or a specific folder
 */
export async function listOneDriveFiles(
  client: Client,
  folderId?: string
): Promise<MicrosoftFile[]> {
  const endpoint = folderId
    ? `/me/drive/items/${folderId}/children`
    : "/me/drive/root/children";

  const response = await client
    .api(endpoint)
    .select("id,name,webUrl,size,file,createdDateTime,lastModifiedDateTime,parentReference")
    .get();

  return response.value.map((item: Record<string, unknown>) => ({
    id: item.id as string,
    name: item.name as string,
    webUrl: item.webUrl as string,
    driveId: (item.parentReference as Record<string, string>)?.driveId || "",
    size: item.size as number,
    mimeType: (item.file as Record<string, string>)?.mimeType,
    createdDateTime: item.createdDateTime as string,
    lastModifiedDateTime: item.lastModifiedDateTime as string,
    parentPath: (item.parentReference as Record<string, string>)?.path,
  }));
}

/**
 * Searches for files in OneDrive by name or content
 */
export async function searchOneDriveFiles(
  client: Client,
  query: string
): Promise<MicrosoftFile[]> {
  const response = await client
    .api(`/me/drive/root/search(q='${encodeURIComponent(query)}')`)
    .select("id,name,webUrl,size,file,createdDateTime,lastModifiedDateTime,parentReference")
    .top(20)
    .get();

  return response.value.map((item: Record<string, unknown>) => ({
    id: item.id as string,
    name: item.name as string,
    webUrl: item.webUrl as string,
    driveId: (item.parentReference as Record<string, string>)?.driveId || "",
    size: item.size as number,
    mimeType: (item.file as Record<string, string>)?.mimeType,
    createdDateTime: item.createdDateTime as string,
    lastModifiedDateTime: item.lastModifiedDateTime as string,
    parentPath: (item.parentReference as Record<string, string>)?.path,
  }));
}

/**
 * Gets an edit link for a file (opens in Word/Excel Online)
 */
export async function getFileEditLink(
  client: Client,
  driveId: string,
  fileId: string
): Promise<string> {
  // Create a sharing link with edit permissions
  const response = await client
    .api(`/drives/${driveId}/items/${fileId}/createLink`)
    .post({
      type: "edit",
      scope: "organization", // or "anonymous" for external sharing
    });

  return response.link.webUrl;
}

/**
 * Reads data from an Excel file range
 * Perfect for importing financial data (CA, EBITDA, etc.)
 */
export async function readExcelRange(
  client: Client,
  driveId: string,
  fileId: string,
  sheetName: string,
  range: string
): Promise<ExcelRangeData> {
  const response = await client
    .api(
      `/drives/${driveId}/items/${fileId}/workbook/worksheets/${sheetName}/range(address='${range}')`
    )
    .get();

  return {
    values: response.values,
    address: response.address,
    rowCount: response.rowCount,
    columnCount: response.columnCount,
  };
}

/**
 * Writes data to an Excel file range
 */
export async function writeExcelRange(
  client: Client,
  driveId: string,
  fileId: string,
  sheetName: string,
  range: string,
  values: (string | number | boolean | null)[][]
): Promise<void> {
  await client
    .api(
      `/drives/${driveId}/items/${fileId}/workbook/worksheets/${sheetName}/range(address='${range}')`
    )
    .patch({ values });
}

/**
 * Creates a new folder in OneDrive
 */
export async function createOneDriveFolder(
  client: Client,
  parentFolderId: string | null,
  folderName: string
): Promise<MicrosoftFile> {
  const endpoint = parentFolderId
    ? `/me/drive/items/${parentFolderId}/children`
    : "/me/drive/root/children";

  const response = await client.api(endpoint).post({
    name: folderName,
    folder: {},
    "@microsoft.graph.conflictBehavior": "rename",
  });

  return {
    id: response.id,
    name: response.name,
    webUrl: response.webUrl,
    driveId: response.parentReference?.driveId || "",
    size: 0,
    createdDateTime: response.createdDateTime,
    lastModifiedDateTime: response.lastModifiedDateTime,
  };
}

/**
 * Downloads file content as a buffer
 */
export async function downloadFileContent(
  client: Client,
  driveId: string,
  fileId: string
): Promise<ArrayBuffer> {
  const response = await client
    .api(`/drives/${driveId}/items/${fileId}/content`)
    .get();
  
  return response;
}

/**
 * Uploads a file to OneDrive
 */
export async function uploadFile(
  client: Client,
  parentFolderId: string | null,
  fileName: string,
  content: ArrayBuffer,
  mimeType: string
): Promise<MicrosoftFile> {
  const endpoint = parentFolderId
    ? `/me/drive/items/${parentFolderId}:/${fileName}:/content`
    : `/me/drive/root:/${fileName}:/content`;

  const response = await client
    .api(endpoint)
    .header("Content-Type", mimeType)
    .put(content);

  return {
    id: response.id,
    name: response.name,
    webUrl: response.webUrl,
    driveId: response.parentReference?.driveId || "",
    size: response.size,
    mimeType: response.file?.mimeType,
    createdDateTime: response.createdDateTime,
    lastModifiedDateTime: response.lastModifiedDateTime,
  };
}

/**
 * Helper to extract financial data from common Excel structures
 * Maps cell references to financial metrics
 */
export interface FinancialMetrics {
  revenue?: number;
  ebitda?: number;
  netResult?: number;
  netDebt?: number;
  equity?: number;
  employees?: number;
  year?: number;
}

export function parseFinancialData(
  values: (string | number | boolean | null)[][],
  mapping: Record<string, { row: number; col: number }>
): FinancialMetrics {
  const metrics: FinancialMetrics = {};

  for (const [key, { row, col }] of Object.entries(mapping)) {
    const value = values[row]?.[col];
    if (typeof value === "number") {
      (metrics as Record<string, number | undefined>)[key] = value;
    }
  }

  return metrics;
}
