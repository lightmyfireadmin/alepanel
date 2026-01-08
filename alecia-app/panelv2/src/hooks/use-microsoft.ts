"use client";

import { useAuth, useSession } from "@clerk/nextjs";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useCallback, useState } from "react";

// Types for Microsoft files
interface MicrosoftFile {
  id: string;
  name: string;
  webUrl: string;
  size: number;
  lastModified: string;
  type: "file" | "folder";
  mimeType?: string;
  driveId?: string;
  path?: string;
}

interface ExcelData {
  values: (string | number | boolean | null)[][];
  address: string;
  rowCount: number;
  columnCount: number;
  formulas?: (string | null)[][];
}

interface MicrosoftProfile {
  id: string;
  displayName: string;
  email: string;
  jobTitle?: string;
  officeLocation?: string;
}

interface ExcelWorksheet {
  id: string;
  name: string;
  position: number;
  visibility: string;
}

interface FinancialMetrics {
  revenue?: number;
  ebitda?: number;
  netResult?: number;
  equity?: number;
  netDebt?: number;
  employees?: number;
}

/**
 * Hook to integrate with Microsoft 365 via Clerk OAuth
 * 
 * Usage:
 * 1. Ensure user is logged in with Microsoft via Clerk SSO
 * 2. Call `getMicrosoftToken()` to get the access token
 * 3. Use the token with other actions (listFiles, readExcel, etc.)
 */
export function useMicrosoft() {
  const { isLoaded, isSignedIn } = useAuth();
  const { session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convex actions
  const getOneDriveFilesAction = useAction(api.actions.microsoft.getOneDriveFiles);
  const searchOneDriveFilesAction = useAction(api.actions.microsoft.searchOneDriveFiles);
  const getEditableLinkAction = useAction(api.actions.microsoft.getEditableLink);
  const readExcelRangeAction = useAction(api.actions.microsoft.readExcelRange);
  const getExcelWorksheetsAction = useAction(api.actions.microsoft.getExcelWorksheets);
  const getExcelUsedRangeAction = useAction(api.actions.microsoft.getExcelUsedRange);
  const writeExcelRangeAction = useAction(api.actions.microsoft.writeExcelRange);
  const getMicrosoftProfileAction = useAction(api.actions.microsoft.getMicrosoftProfile);
  const createFolderAction = useAction(api.actions.microsoft.createOneDriveFolder);
  const createSharingLinkAction = useAction(api.actions.microsoft.createSharingLink);
  const parseFinancialDataAction = useAction(api.actions.microsoft.parseFinancialExcelData);

  /**
   * Get the Microsoft access token from Clerk session
   * Returns null if not available (user not signed in with Microsoft)
   */
  const getMicrosoftToken = useCallback(async (): Promise<string | null> => {
    if (!session) return null;

    try {
      // Get OAuth access token from Clerk for the Microsoft provider
      const token = await session.getToken({ template: "microsoft" });
      return token;
    } catch (err) {
      console.error("Failed to get Microsoft token:", err);
      setError("Microsoft connection not available. Please sign in with Microsoft.");
      return null;
    }
  }, [session]);

  /**
   * Check if Microsoft OAuth is connected
   */
  const isMicrosoftConnected = useCallback(async (): Promise<boolean> => {
    const token = await getMicrosoftToken();
    return token !== null;
  }, [getMicrosoftToken]);

  /**
   * List files in OneDrive
   */
  const listFiles = useCallback(async (folderId?: string): Promise<MicrosoftFile[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await getMicrosoftToken();
      if (!token) throw new Error("Not connected to Microsoft");

      const files = await getOneDriveFilesAction({ accessToken: token, folderId });
      return files as MicrosoftFile[];
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to list files");
      return [];
    } finally {
      setLoading(false);
    }
  }, [getMicrosoftToken, getOneDriveFilesAction]);

  /**
   * Search files in OneDrive
   */
  const searchFiles = useCallback(async (query: string): Promise<MicrosoftFile[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await getMicrosoftToken();
      if (!token) throw new Error("Not connected to Microsoft");

      const files = await searchOneDriveFilesAction({ accessToken: token, query });
      return files as MicrosoftFile[];
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search files");
      return [];
    } finally {
      setLoading(false);
    }
  }, [getMicrosoftToken, searchOneDriveFilesAction]);

  /**
   * Open a file in Office Online (Word, Excel, PowerPoint)
   */
  const openInOffice = useCallback(async (fileId: string): Promise<void> => {
    try {
      const token = await getMicrosoftToken();
      if (!token) throw new Error("Not connected to Microsoft");

      const webUrl = await getEditableLinkAction({ accessToken: token, fileId });
      window.open(webUrl, "_blank");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open file");
    }
  }, [getMicrosoftToken, getEditableLinkAction]);

  /**
   * Read an Excel range for financial data import
   */
  const readExcelRange = useCallback(async (
    driveId: string,
    fileId: string,
    sheetName: string,
    range: string
  ): Promise<ExcelData | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await getMicrosoftToken();
      if (!token) throw new Error("Not connected to Microsoft");

      const data = await readExcelRangeAction({
        accessToken: token,
        driveId,
        fileId,
        sheetName,
        range,
      });
      return data as ExcelData;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to read Excel data");
      return null;
    } finally {
      setLoading(false);
    }
  }, [getMicrosoftToken, readExcelRangeAction]);

  /**
   * Get list of worksheets in an Excel file
   */
  const getExcelSheets = useCallback(async (
    driveId: string,
    fileId: string
  ): Promise<ExcelWorksheet[]> => {
    try {
      const token = await getMicrosoftToken();
      if (!token) throw new Error("Not connected to Microsoft");

      const sheets = await getExcelWorksheetsAction({
        accessToken: token,
        driveId,
        fileId,
      });
      return sheets as ExcelWorksheet[];
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get sheets");
      return [];
    }
  }, [getMicrosoftToken, getExcelWorksheetsAction]);

  /**
   * Auto-detect and read used data range from Excel sheet
   */
  const readExcelAutoRange = useCallback(async (
    driveId: string,
    fileId: string,
    sheetName: string
  ): Promise<ExcelData | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await getMicrosoftToken();
      if (!token) throw new Error("Not connected to Microsoft");

      const data = await getExcelUsedRangeAction({
        accessToken: token,
        driveId,
        fileId,
        sheetName,
      });
      return data as ExcelData;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to read Excel data");
      return null;
    } finally {
      setLoading(false);
    }
  }, [getMicrosoftToken, getExcelUsedRangeAction]);

  /**
   * Write data to an Excel range
   */
  const writeExcel = useCallback(async (
    driveId: string,
    fileId: string,
    sheetName: string,
    range: string,
    values: (string | number | boolean | null)[][]
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await getMicrosoftToken();
      if (!token) throw new Error("Not connected to Microsoft");

      await writeExcelRangeAction({
        accessToken: token,
        driveId,
        fileId,
        sheetName,
        range,
        values,
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to write Excel data");
      return false;
    } finally {
      setLoading(false);
    }
  }, [getMicrosoftToken, writeExcelRangeAction]);

  /**
   * Get Microsoft user profile
   */
  const getProfile = useCallback(async (): Promise<MicrosoftProfile | null> => {
    try {
      const token = await getMicrosoftToken();
      if (!token) return null;

      const profile = await getMicrosoftProfileAction({ accessToken: token });
      return profile as MicrosoftProfile;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get profile");
      return null;
    }
  }, [getMicrosoftToken, getMicrosoftProfileAction]);

  /**
   * Create a folder in OneDrive
   */
  const createFolder = useCallback(async (
    folderName: string,
    parentFolderId?: string
  ): Promise<MicrosoftFile | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await getMicrosoftToken();
      if (!token) throw new Error("Not connected to Microsoft");

      const folder = await createFolderAction({
        accessToken: token,
        folderName,
        parentFolderId,
      });
      return folder as MicrosoftFile;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create folder");
      return null;
    } finally {
      setLoading(false);
    }
  }, [getMicrosoftToken, createFolderAction]);

  /**
   * Create a sharing link for a file
   */
  const createShareLink = useCallback(async (
    driveId: string,
    fileId: string,
    scope: "anonymous" | "organization" = "organization"
  ): Promise<string | null> => {
    try {
      const token = await getMicrosoftToken();
      if (!token) throw new Error("Not connected to Microsoft");

      const result = await createSharingLinkAction({
        accessToken: token,
        driveId,
        fileId,
        scope,
      });
      return result.webUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create link");
      return null;
    }
  }, [getMicrosoftToken, createSharingLinkAction]);

  /**
   * Parse financial data from Excel values
   */
  const parseFinancialData = useCallback(async (
    values: (string | number | boolean | null)[][]
  ): Promise<FinancialMetrics> => {
    const result = await parseFinancialDataAction({ values });
    return result as FinancialMetrics;
  }, [parseFinancialDataAction]);

  /**
   * List recent files from OneDrive (uses Graph API /me/drive/recent)
   */
  const listRecentFiles = useCallback(async (): Promise<MicrosoftFile[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await getMicrosoftToken();
      if (!token) throw new Error("Not connected to Microsoft");

      // Use the Graph API to get recent files
      const response = await fetch("https://graph.microsoft.com/v1.0/me/drive/recent", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recent files");
      }

      const data = await response.json();
      return (data.value || []).map((item: Record<string, unknown>) => ({
        id: item.id,
        name: item.name,
        webUrl: item.webUrl,
        size: (item as { size?: number }).size || 0,
        lastModifiedDateTime: (item as { lastModifiedDateTime?: string }).lastModifiedDateTime || "",
        file: item.file,
        folder: item.folder,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to list recent files");
      return [];
    } finally {
      setLoading(false);
    }
  }, [getMicrosoftToken]);

  /**
   * Upload a file to OneDrive
   */
  const uploadFile = useCallback(async (
    file: File,
    folderId?: string
  ): Promise<MicrosoftFile | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const token = await getMicrosoftToken();
      if (!token) throw new Error("Not connected to Microsoft");

      // Build upload URL
      let uploadUrl: string;
      if (folderId) {
        uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${folderId}:/${encodeURIComponent(file.name)}:/content`;
      } else {
        uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/${encodeURIComponent(file.name)}:/content`;
      }

      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const result = await response.json();
      return {
        id: result.id,
        name: result.name,
        webUrl: result.webUrl,
        size: result.size,
        lastModified: result.lastModifiedDateTime,
        type: "file",
        mimeType: result.file?.mimeType,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
      return null;
    } finally {
      setLoading(false);
    }
  }, [getMicrosoftToken]);

  return {
    // State
    isLoaded,
    isSignedIn,
    isLoading: loading,
    loading,
    error,
    
    // Auth
    getMicrosoftToken,
    isMicrosoftConnected,
    getProfile,
    
    // Files
    listFiles,
    listRecentFiles,
    searchFiles,
    openInOffice,
    createFolder,
    createShareLink,
    uploadFile,
    
    // Excel
    readExcelRange,
    readExcelAutoRange,
    getExcelSheets,
    writeExcel,
    parseFinancialData,
  };
}
