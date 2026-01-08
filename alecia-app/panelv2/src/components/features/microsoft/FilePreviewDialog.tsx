"use client";

import { useState, useEffect } from "react";
import { X, Download, ExternalLink, Maximize2, FileText, FileSpreadsheet, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface FilePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: {
    id: string;
    name: string;
    webUrl: string;
    downloadUrl?: string;
    mimeType?: string;
    previewUrl?: string;
  } | null;
}

function getPreviewType(mimeType: string | undefined): "image" | "pdf" | "office" | "unsupported" {
  if (!mimeType) return "unsupported";
  
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (
    mimeType.includes("word") ||
    mimeType.includes("document") ||
    mimeType.includes("spreadsheet") ||
    mimeType.includes("excel") ||
    mimeType.includes("presentation") ||
    mimeType.includes("powerpoint")
  ) {
    return "office";
  }
  
  return "unsupported";
}

function getFileIcon(mimeType: string | undefined) {
  if (!mimeType) return <FileText className="h-16 w-16" />;
  
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
    return <FileSpreadsheet className="h-16 w-16 text-green-600" />;
  }
  if (mimeType.startsWith("image/")) {
    return <ImageIcon className="h-16 w-16 text-purple-500" />;
  }
  return <FileText className="h-16 w-16 text-blue-600" />;
}

export function FilePreviewDialog({ open, onOpenChange, file }: FilePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      setPreviewError(false);
    }
  }, [open, file?.id]);

  if (!file) return null;

  const previewType = getPreviewType(file.mimeType);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setPreviewError(true);
  };

  const renderPreview = () => {
    if (previewError) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
          {getFileIcon(file.mimeType)}
          <p className="mt-4 text-sm">Aperçu non disponible</p>
          <p className="text-xs mt-1">Ouvrir dans Microsoft 365 pour visualiser</p>
        </div>
      );
    }

    switch (previewType) {
      case "image":
        return (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="w-full h-full" />
              </div>
            )}
            <img
              src={file.previewUrl || file.webUrl}
              alt={file.name}
              className={cn(
                "max-w-full max-h-[70vh] object-contain mx-auto",
                isLoading && "invisible"
              )}
              onLoad={handleLoad}
              onError={handleError}
            />
          </>
        );

      case "pdf":
        return (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="w-full h-[70vh]" />
              </div>
            )}
            <iframe
              src={`${file.webUrl}?embedded=true`}
              className={cn("w-full h-[70vh] border-0", isLoading && "invisible")}
              onLoad={handleLoad}
              onError={handleError}
              title={file.name}
            />
          </>
        );

      case "office":
        // Use Microsoft Office Online viewer
        const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.webUrl)}`;
        return (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="w-full h-[70vh]" />
              </div>
            )}
            <iframe
              src={officeViewerUrl}
              className={cn("w-full h-[70vh] border-0", isLoading && "invisible")}
              onLoad={handleLoad}
              onError={handleError}
              title={file.name}
            />
          </>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
            {getFileIcon(file.mimeType)}
            <p className="mt-4 text-sm">Type de fichier non pris en charge</p>
            <p className="text-xs mt-1">Téléchargez le fichier pour le visualiser</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-2 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-medium truncate pr-4">
              {file.name}
            </DialogTitle>
            <div className="flex items-center gap-2 shrink-0">
              {file.downloadUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={file.downloadUrl} download>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </a>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href={file.webUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ouvrir
                </a>
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="relative mt-4">
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
