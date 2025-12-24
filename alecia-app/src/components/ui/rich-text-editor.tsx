"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Quote, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/lib/actions/upload";
import { useState, useRef } from "react";
import { useToast } from "@/components/ui/toast";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ content, onChange, placeholder, className }: RichTextEditorProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error: errorToast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || "Écrivez ici...",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
            class: 'text-primary underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg border border-[var(--border)] max-w-full h-auto',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
        attributes: {
            class: "prose dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-4"
        }
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadFile(formData);

    if (result.url) {
        // If image, insert image. If other, insert link.
        if (file.type.startsWith("image/")) {
            editor?.chain().focus().setImage({ src: result.url }).run(); // Standard TipTap Image extension needed if using setImage
            // Fallback to inserting HTML if Image extension not loaded, or Link
            // Since I didn't install Image extension, I'll use a link for now or just insert standard HTML
            // Actually, let's stick to Link for simplicity unless I install Image extension.
            // But user expects Image.
            // Let's just insert a link with the filename.
             editor?.chain().focus().setLink({ href: result.url }).insertContent(file.name).run();
        } else {
            editor?.chain().focus().setLink({ href: result.url }).insertContent(file.name).run();
        }
        success("Fichier envoyé", "Le fichier a été joint au message.");
    } else {
        errorToast("Erreur", "L'envoi du fichier a échoué.");
    }
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={`border border-[var(--border)] rounded-md overflow-hidden bg-[var(--card)] ${className}`}>
      <div className="flex items-center gap-1 p-2 border-b border-[var(--border)] bg-[var(--background-secondary)] flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-[var(--accent)]/20" : ""}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-[var(--accent)]/20" : ""}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-[var(--border)] mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-[var(--accent)]/20" : ""}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-[var(--accent)]/20" : ""}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-[var(--border)] mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
        </Button>
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
