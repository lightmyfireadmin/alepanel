"use client";

import { useState, useEffect } from "react";
import { useMicrosoft } from "@/hooks/use-microsoft";
import { FileText, FileSpreadsheet, Image as ImageIcon, File, Clock, ExternalLink, RefreshCw, FolderOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface RecentFile {
  id: string;
  name: string;
  webUrl: string;
  lastModifiedDateTime: string;
  size: number;
  file?: { mimeType: string };
  folder?: object;
}

function getFileIcon(file: RecentFile) {
  if (file.folder) return <FolderOpen className="h-4 w-4 text-amber-500" />;
  
  const mimeType = file.file?.mimeType || "";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
    return <FileSpreadsheet className="h-4 w-4 text-green-600" />;
  }
  if (mimeType.includes("document") || mimeType.includes("word")) {
    return <FileText className="h-4 w-4 text-blue-600" />;
  }
  if (mimeType.includes("image")) {
    return <ImageIcon className="h-4 w-4 text-purple-500" />;
  }
  if (mimeType.includes("pdf")) {
    return <FileText className="h-4 w-4 text-red-500" />;
  }
  return <File className="h-4 w-4 text-muted-foreground" />;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function RecentFilesWidget({ className }: { className?: string }) {
  const { listRecentFiles, isLoading: hookLoading } = useMicrosoft();
  const [files, setFiles] = useState<RecentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await listRecentFiles();
      if (result && Array.isArray(result)) {
        // Map MicrosoftFile to RecentFile format
        const mappedFiles = result.slice(0, 8).map((f) => ({
          id: f.id,
          name: f.name,
          webUrl: f.webUrl,
          lastModifiedDateTime: (f as { lastModifiedDateTime?: string }).lastModifiedDateTime || f.lastModified || new Date().toISOString(),
          size: f.size,
          file: f.mimeType ? { mimeType: f.mimeType } : undefined,
          folder: (f as { folder?: object }).folder,
        }));
        setFiles(mappedFiles);
      }
    } catch (err) {
      console.error("Failed to fetch recent files:", err);
      setError("Connexion Microsoft requise");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Fichiers Récents
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              OneDrive & SharePoint
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={fetchFiles}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <Skeleton className="h-8 w-8 rounded" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-[140px]" />
                <Skeleton className="h-2 w-[80px]" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="link" size="sm" className="mt-2">
              Connecter Microsoft 365
            </Button>
          </div>
        ) : files.length === 0 ? (
          <div className="py-6 text-center">
            <FolderOpen className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Aucun fichier récent</p>
          </div>
        ) : (
          files.map((file) => (
            <a
              key={file.id}
              href={file.webUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                {getFileIcon(file)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(file.lastModifiedDateTime), { 
                    addSuffix: true, 
                    locale: fr 
                  })} • {formatFileSize(file.size)}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))
        )}
      </CardContent>
    </Card>
  );
}
