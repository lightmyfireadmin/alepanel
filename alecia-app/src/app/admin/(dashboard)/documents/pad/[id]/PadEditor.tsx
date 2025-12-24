"use client";

import { useState, useEffect, useCallback } from "react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { updatePad } from "@/lib/actions/pads";
import { Button } from "@/components/ui/button";
import { Save, FileDown, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface PadEditorProps {
  id: string;
  initialContent: string;
  initialTitle: string;
}

export function PadEditor({ id, initialContent, initialTitle }: PadEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { success, error: errorToast } = useToast();

  const handleSave = useCallback(async (isAuto = false) => {
    if (content === initialContent && !isAuto) return;
    
    setSaving(true);
    const res = await updatePad(id, content);
    if (res.success) {
      setLastSaved(new Date());
      if (!isAuto) success("Enregistré");
    } else if (!isAuto) {
      errorToast("Erreur de sauvegarde");
    }
    setSaving(false);
  }, [id, content, initialContent, success, errorToast]);

  // Auto-save every 10 seconds if content changed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content !== initialContent) {
        handleSave(true);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [content, initialContent, handleSave]);

  const handleExportPDF = () => {
    // Simple browser print to PDF for now
    window.print();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-stroke dark:border-strokedark bg-gray-50 dark:bg-meta-4/20 flex items-center justify-between">
        <div className="flex items-center gap-4 px-2">
            {saving ? (
                <div className="flex items-center gap-2 text-xs text-bodydark2">
                    <Loader2 className="w-3 h-3 animate-spin" /> Sauvegarde...
                </div>
            ) : lastSaved ? (
                <div className="flex items-center gap-2 text-xs text-success">
                    <CheckCircle2 className="w-3 h-3" /> Enregistré
                </div>
            ) : null}
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPDF} className="h-8">
                <FileDown className="w-4 h-4 mr-2" /> Export PDF
            </Button>
            <Button size="sm" onClick={() => handleSave()} disabled={saving || content === initialContent} className="h-8 bg-[var(--accent)] text-white">
                <Save className="w-4 h-4 mr-2" /> Sauvegarder
            </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <RichTextEditor 
            content={content} 
            onChange={setContent} 
            className="border-0 h-full rounded-none"
        />
      </div>
      {/* Styles for printing only the editor content */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .prose, .prose * {
            visibility: visible;
          }
          .prose {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
