"use client";

import { useState, useCallback, useEffect } from "react";
import { useMicrosoft } from "@/hooks/use-microsoft";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  FolderIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  PresentationIcon,
  SearchIcon,
  ArrowLeftIcon,
  ExternalLinkIcon,
  RefreshCwIcon,
  CloudIcon,
  AlertCircleIcon,
} from "lucide-react";

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

interface OneDrivePickerProps {
  /**
   * Callback when a file is selected
   * Returns the file object with id, name, webUrl, driveId
   */
  onFileSelect?: (file: MicrosoftFile) => void;
  
  /**
   * Callback when user opens a file in Office Online
   */
  onFileOpen?: (file: MicrosoftFile) => void;
  
  /**
   * File types to filter (e.g., [".xlsx", ".docx", ".pptx"])
   * If empty, shows all files
   */
  allowedExtensions?: string[];
  
  /**
   * Whether to allow folder selection
   */
  allowFolders?: boolean;
  
  /**
   * Custom trigger button (default: "Browse OneDrive")
   */
  trigger?: React.ReactNode;
  
  /**
   * Dialog title
   */
  title?: string;
}

// Get icon based on file type
function getFileIcon(mimeType?: string, name?: string) {
  const ext = name?.split(".").pop()?.toLowerCase();
  
  // Excel files
  if (
    mimeType?.includes("spreadsheet") ||
    mimeType?.includes("excel") ||
    ext === "xlsx" ||
    ext === "xls" ||
    ext === "csv"
  ) {
    return <FileSpreadsheetIcon className="h-5 w-5 text-green-600" />;
  }
  
  // Word files
  if (
    mimeType?.includes("word") ||
    mimeType?.includes("document") ||
    ext === "docx" ||
    ext === "doc"
  ) {
    return <FileTextIcon className="h-5 w-5 text-blue-600" />;
  }
  
  // PowerPoint files
  if (
    mimeType?.includes("presentation") ||
    mimeType?.includes("powerpoint") ||
    ext === "pptx" ||
    ext === "ppt"
  ) {
    return <PresentationIcon className="h-5 w-5 text-orange-600" />;
  }
  
  return <FileIcon className="h-5 w-5 text-gray-500" />;
}

// Format file size
function formatSize(bytes: number): string {
  if (bytes === 0) return "";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Format relative date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function OneDrivePicker({
  onFileSelect,
  onFileOpen,
  allowedExtensions = [],
  allowFolders = false,
  trigger,
  title = "Fichiers OneDrive",
}: OneDrivePickerProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<MicrosoftFile[]>([]);
  const [folderStack, setFolderStack] = useState<{ id: string; name: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const {
    listFiles,
    searchFiles,
    openInOffice,
    loading,
    error,
    isMicrosoftConnected,
  } = useMicrosoft();
  
  const [connected, setConnected] = useState<boolean | null>(null);

  // Check connection status
  useEffect(() => {
    if (open) {
      isMicrosoftConnected().then((isConnected) => {
        setConnected(isConnected);
        if (isConnected) {
          loadFiles();
        }
      });
    }
  }, [open, isMicrosoftConnected]);

  // Load files from current folder
  const loadFiles = useCallback(async (folderId?: string) => {
    const currentFolderId = folderId || folderStack[folderStack.length - 1]?.id;
    const result = await listFiles(currentFolderId);
    
    // Filter files if extensions are specified
    const filtered = allowedExtensions.length > 0
      ? result.filter((f) => {
          if (f.type === "folder") return true;
          const ext = "." + f.name.split(".").pop()?.toLowerCase();
          return allowedExtensions.includes(ext);
        })
      : result;
    
    setFiles(filtered);
    setIsSearching(false);
  }, [listFiles, folderStack, allowedExtensions]);

  // Navigate into a folder
  const navigateToFolder = useCallback((folder: MicrosoftFile) => {
    setFolderStack((prev) => [...prev, { id: folder.id, name: folder.name }]);
    loadFiles(folder.id);
  }, [loadFiles]);

  // Go back one folder
  const navigateBack = useCallback(() => {
    if (folderStack.length === 0) return;
    
    const newStack = [...folderStack];
    newStack.pop();
    setFolderStack(newStack);
    
    const parentId = newStack[newStack.length - 1]?.id;
    loadFiles(parentId);
  }, [folderStack, loadFiles]);

  // Go to root
  const navigateToRoot = useCallback(() => {
    setFolderStack([]);
    loadFiles(undefined);
  }, [loadFiles]);

  // Search files
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      loadFiles();
      return;
    }
    
    setIsSearching(true);
    const result = await searchFiles(searchQuery);
    
    const filtered = allowedExtensions.length > 0
      ? result.filter((f) => {
          const ext = "." + f.name.split(".").pop()?.toLowerCase();
          return allowedExtensions.includes(ext);
        })
      : result;
    
    setFiles(filtered);
  }, [searchQuery, searchFiles, loadFiles, allowedExtensions]);

  // Handle file click
  const handleFileClick = (file: MicrosoftFile) => {
    if (file.type === "folder") {
      navigateToFolder(file);
    } else {
      onFileSelect?.(file);
      setOpen(false);
    }
  };

  // Handle open in Office
  const handleOpenInOffice = (file: MicrosoftFile, e: React.MouseEvent) => {
    e.stopPropagation();
    openInOffice(file.id);
    onFileOpen?.(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <CloudIcon className="h-4 w-4" />
            Parcourir OneDrive
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CloudIcon className="h-5 w-5 text-blue-500" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Sélectionnez un fichier depuis votre OneDrive
          </DialogDescription>
        </DialogHeader>

        {connected === false ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircleIcon className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              Connexion Microsoft requise
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Connectez-vous avec votre compte Microsoft pour accéder à vos fichiers OneDrive.
            </p>
            <Button onClick={() => setOpen(false)}>Fermer</Button>
          </div>
        ) : (
          <>
            {/* Search bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher des fichiers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button variant="secondary" onClick={handleSearch}>
                Rechercher
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => loadFiles()}
                disabled={loading}
              >
                <RefreshCwIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>

            {/* Breadcrumb */}
            {!isSearching && (
              <div className="flex items-center gap-1 text-sm overflow-x-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={navigateToRoot}
                  className="shrink-0"
                >
                  OneDrive
                </Button>
                {folderStack.map((folder, i) => (
                  <div key={folder.id} className="flex items-center">
                    <span className="text-muted-foreground">/</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newStack = folderStack.slice(0, i + 1);
                        setFolderStack(newStack);
                        loadFiles(folder.id);
                      }}
                      className="shrink-0"
                    >
                      {folder.name}
                    </Button>
                  </div>
                ))}
                {folderStack.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={navigateBack}
                    className="ml-auto shrink-0"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Retour
                  </Button>
                )}
              </div>
            )}

            {/* File list */}
            <ScrollArea className="h-[400px] border rounded-md">
              {error ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircleIcon className="h-8 w-8 text-red-500 mb-2" />
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => loadFiles()}
                    className="mt-2"
                  >
                    Réessayer
                  </Button>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCwIcon className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : files.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FolderIcon className="h-12 w-12 text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {isSearching
                      ? "Aucun résultat trouvé"
                      : "Ce dossier est vide"}
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => handleFileClick(file)}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      {file.type === "folder" ? (
                        <FolderIcon className="h-5 w-5 text-amber-500" />
                      ) : (
                        getFileIcon(file.mimeType, file.name)
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {file.size > 0 && (
                            <span>{formatSize(file.size)}</span>
                          )}
                          <span>{formatDate(file.lastModified)}</span>
                        </div>
                      </div>
                      
                      {file.type === "file" && (
                        <div className="flex items-center gap-2">
                          {file.mimeType?.includes("officedocument") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleOpenInOffice(file, e)}
                              className="gap-1"
                            >
                              <ExternalLinkIcon className="h-3 w-3" />
                              Ouvrir
                            </Button>
                          )}
                          <Badge variant="secondary" className="shrink-0">
                            Sélectionner
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Footer with extension filters */}
            {allowedExtensions.length > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Types autorisés:</span>
                {allowedExtensions.map((ext) => (
                  <Badge key={ext} variant="outline" className="text-xs">
                    {ext}
                  </Badge>
                ))}
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
