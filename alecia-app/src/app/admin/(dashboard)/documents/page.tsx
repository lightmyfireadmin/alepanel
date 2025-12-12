"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Upload, FileText, Image, File, Link2, 
  Lock, Unlock, Trash2, Copy, Check, Download
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

// Mock documents data
const mockDocuments = [
  { id: "1", name: "Teaser_TechCorp.pdf", mimeType: "application/pdf", size: 2400000, isConfidential: true, hasLink: true, createdAt: "2025-01-10" },
  { id: "2", name: "Comptes_2024.xlsx", mimeType: "application/vnd.ms-excel", size: 450000, isConfidential: true, hasLink: false, createdAt: "2025-01-08" },
  { id: "3", name: "Logo_MediSante.png", mimeType: "image/png", size: 125000, isConfidential: false, hasLink: true, createdAt: "2025-01-05" },
  { id: "4", name: "Business_Plan.pdf", mimeType: "application/pdf", size: 3200000, isConfidential: true, hasLink: false, createdAt: "2025-01-03" },
];

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes("pdf")) return FileText;
  if (mimeType.includes("image")) return Image;
  return File;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export default function DocumentsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadingFiles(acceptedFiles);
    // Mock upload - in real app, upload to Vercel Blob
    setTimeout(() => {
      setUploadingFiles([]);
      // Add to documents list
    }, 2000);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
      "application/vnd.ms-excel": [".xls", ".xlsx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
  });

  const copyMagicLink = (docId: string) => {
    // In real app, generate/get actual magic link
    const magicLink = `https://alecia.fr/shared/${docId}`;
    navigator.clipboard.writeText(magicLink);
    setCopiedId(docId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)] font-[family-name:var(--font-playfair)]">
            Documents
          </h1>
          <p className="text-[var(--foreground-muted)] mt-1">
            Data Room et partage sécurisé
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardContent className="pt-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              isDragActive
                ? "border-[var(--accent)] bg-[var(--accent)]/5"
                : "border-[var(--border)] hover:border-[var(--accent)]/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-[var(--foreground)] font-medium">
                  {isDragActive
                    ? "Déposez les fichiers ici..."
                    : "Glissez-déposez vos fichiers ici"}
                </p>
                <p className="text-sm text-[var(--foreground-muted)] mt-1">
                  ou cliquez pour sélectionner • PDF, Images, Excel
                </p>
              </div>
            </div>
          </div>

          {/* Upload Progress */}
          {uploadingFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {uploadingFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--background-tertiary)]"
                >
                  <FileText className="w-5 h-5 text-[var(--accent)]" />
                  <div className="flex-1">
                    <p className="text-sm text-[var(--foreground)]">{file.name}</p>
                    <div className="mt-1 h-1 bg-[var(--border)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                        className="h-full bg-[var(--accent)]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card className="bg-[var(--card)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--foreground)]">Fichiers</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[var(--border)]">
            {mockDocuments.map((doc, idx) => {
              const FileIcon = getFileIcon(doc.mimeType);
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--background-tertiary)] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center">
                    <FileIcon className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--foreground)] font-medium truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-[var(--foreground-muted)]">
                      {formatFileSize(doc.size)} • {new Date(doc.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Confidential Badge */}
                    <span className={`p-1.5 rounded-md ${
                      doc.isConfidential 
                        ? "bg-red-500/10 text-red-400" 
                        : "bg-emerald-500/10 text-emerald-400"
                    }`}>
                      {doc.isConfidential ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    </span>

                    {/* Magic Link */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 border-[var(--border)]"
                      onClick={() => copyMagicLink(doc.id)}
                    >
                      {copiedId === doc.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-xs">Copié</span>
                        </>
                      ) : (
                        <>
                          <Link2 className="w-3.5 h-3.5" />
                          <span className="text-xs">Partager</span>
                        </>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Download className="w-4 h-4 text-[var(--foreground-muted)]" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
