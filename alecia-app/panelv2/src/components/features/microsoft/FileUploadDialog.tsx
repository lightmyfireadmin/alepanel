"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMicrosoft } from "@/hooks/use-microsoft";
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader2, FolderOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UploadFile {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetFolder?: {
    id: string;
    name: string;
  };
  onUploadComplete?: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUploadDialog({ 
  open, 
  onOpenChange, 
  targetFolder,
  onUploadComplete 
}: FileUploadDialogProps) {
  const { uploadFile } = useMicrosoft();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
      file,
      status: "pending",
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.status === "success") continue;

      // Update status to uploading
      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === i ? { ...f, status: "uploading", progress: 0 } : f
        )
      );

      try {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i && f.status === "uploading"
                ? { ...f, progress: Math.min(f.progress + 10, 90) }
                : f
            )
          );
        }, 100);

        await uploadFile(file.file, targetFolder?.id);

        clearInterval(progressInterval);

        // Mark as success
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: "success", progress: 100 } : f
          )
        );
        successCount++;
      } catch (error) {
        // Mark as error
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, status: "error", error: "Échec de l'upload" }
              : f
          )
        );
        errorCount++;
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      toast.success(`${successCount} fichier(s) uploadé(s)`);
      onUploadComplete?.();
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} fichier(s) en erreur`);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setFiles([]);
      onOpenChange(false);
    }
  };

  const pendingFiles = files.filter((f) => f.status !== "success");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload vers OneDrive
          </DialogTitle>
          <DialogDescription>
            {targetFolder ? (
              <span className="flex items-center gap-1">
                <FolderOpen className="h-4 w-4" />
                Destination: {targetFolder.name}
              </span>
            ) : (
              "Glissez-déposez des fichiers ou cliquez pour sélectionner"
            )}
          </DialogDescription>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="h-10 w-10 mx-auto text-muted-foreground/50 mb-4" />
          {isDragActive ? (
            <p className="text-sm text-primary">Déposez les fichiers ici...</p>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground">
                Glissez-déposez des fichiers ici
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                ou cliquez pour sélectionner
              </p>
            </div>
          )}
        </div>

        {files.length > 0 && (
          <div className="max-h-[200px] overflow-y-auto space-y-2 mt-4">
            {files.map((uploadFile, index) => (
              <div
                key={`${uploadFile.file.name}-${index}`}
                className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
              >
                <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                  {uploadFile.status === "success" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : uploadFile.status === "error" ? (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  ) : uploadFile.status === "uploading" ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {uploadFile.file.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(uploadFile.file.size)}
                    </span>
                    {uploadFile.status === "uploading" && (
                      <Progress value={uploadFile.progress} className="h-1 flex-1" />
                    )}
                    {uploadFile.status === "error" && (
                      <span className="text-xs text-destructive">
                        {uploadFile.error}
                      </span>
                    )}
                  </div>
                </div>
                {uploadFile.status === "pending" && !isUploading && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Annuler
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={pendingFiles.length === 0 || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Uploader ({pendingFiles.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
