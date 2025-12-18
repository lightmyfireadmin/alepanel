"use client";

import { useState, useCallback } from "react";
import Breadcrumb from "@/components/admin/ui/Breadcrumb";
import { 
  Upload, FileText, Image, File, Link2, 
  Lock, Unlock, Trash2, Check, Download
} from "lucide-react";
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
    <>
      <Breadcrumb pageName="Documents" />

      {/* Upload Zone */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
        <div className="p-6.5">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-stroke hover:border-primary/50 dark:border-strokedark"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-black dark:text-white font-medium">
                  {isDragActive
                    ? "Drop files here..."
                    : "Drag & drop files here"}
                </p>
                <p className="text-sm text-bodydark2 mt-1">
                  or click to select • PDF, Images, Excel
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
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-2 dark:bg-meta-4"
                >
                  <FileText className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm text-black dark:text-white">{file.name}</p>
                    <div className="mt-1 h-1 bg-stroke dark:border-strokedark rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-full animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Documents List */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Files
          </h3>
        </div>
        <div className="p-0">
          <div className="flex flex-col">
            {mockDocuments.map((doc) => {
              const FileIcon = getFileIcon(doc.mimeType);
              return (
                <div
                  key={doc.id}
                  className="flex items-center justify-between gap-4 px-6 py-4 border-b border-stroke dark:border-strokedark last:border-0 hover:bg-gray-2 dark:hover:bg-meta-4 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileIcon className="w-5 h-5 text-primary" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-black dark:text-white font-medium truncate">
                          {doc.name}
                        </p>
                        <p className="text-xs text-bodydark2">
                          {formatFileSize(doc.size)} • {new Date(doc.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Confidential Badge */}
                    <span className={`p-1.5 rounded-md ${
                      doc.isConfidential 
                        ? "bg-danger/10 text-danger"
                        : "bg-success/10 text-success"
                    }`}>
                      {doc.isConfidential ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </span>

                    {/* Magic Link */}
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded border border-stroke dark:border-strokedark hover:text-primary text-sm"
                      onClick={() => copyMagicLink(doc.id)}
                    >
                      {copiedId === doc.id ? (
                        <>
                          <Check className="w-4 h-4 text-success" />
                          <span className="hidden sm:inline text-success">Copied</span>
                        </>
                      ) : (
                        <>
                          <Link2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Share</span>
                        </>
                      )}
                    </button>

                    <button className="p-1.5 hover:text-primary">
                      <Download className="w-4 h-4" />
                    </button>

                    <button className="p-1.5 hover:text-danger">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
