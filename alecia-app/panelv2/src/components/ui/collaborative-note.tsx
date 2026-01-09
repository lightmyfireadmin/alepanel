"use client";

import { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Mention from "@tiptap/extension-mention";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading2, 
  Undo, 
  Redo,
  Save,
  Users,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface CollaborativeNoteProps {
  noteId: string;
  initialContent?: string;
  title?: string;
  onSave?: (content: string) => Promise<void>;
  readonly?: boolean;
  className?: string;
}

// Mock active editors for demo
const mockActiveEditors = [
  { id: "1", name: "Marie D.", color: "#3b82f6" },
  { id: "2", name: "Pierre M.", color: "#10b981" },
];

export function CollaborativeNote({
  noteId,
  initialContent = "",
  title = "Notes",
  onSave,
  readonly = false,
  className = "",
}: CollaborativeNoteProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeEditors] = useState(mockActiveEditors);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Commencez à écrire... Utilisez @ pour mentionner quelqu'un.",
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention bg-primary/10 text-primary px-1 rounded",
        },
        suggestion: {
          items: ({ query }: { query: string }) => {
            const users = ["Jean Dupont", "Marie Martin", "Pierre Durand"];
            return users
              .filter((name) => name.toLowerCase().includes(query.toLowerCase()))
              .slice(0, 5);
          },
        },
      }),
    ],
    content: initialContent,
    editable: !readonly,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4",
      },
    },
    immediatelyRender: false,
  });

  const handleSave = useCallback(async () => {
    if (!editor || !onSave) return;

    setIsSaving(true);
    try {
      await onSave(editor.getHTML());
      setLastSaved(new Date());
      toast.success("Notes enregistrées");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  }, [editor, onSave]);

  if (!editor) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          
          {/* Active editors */}
          <div className="flex items-center gap-2">
            {activeEditors.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="flex -space-x-1">
                        {activeEditors.map((e) => (
                          <div
                            key={e.id}
                            className="w-5 h-5 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-medium text-white"
                            style={{ backgroundColor: e.color }}
                          >
                            {e.name[0]}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{activeEditors.length} éditeurs actifs</p>
                    {activeEditors.map((e) => (
                      <p key={e.id} className="text-xs">{e.name}</p>
                    ))}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {lastSaved && (
              <Badge variant="outline" className="text-xs">
                Sauvegardé {lastSaved.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Toolbar */}
        {!readonly && (
          <div className="flex items-center gap-1 px-4 py-2 border-b bg-muted/30">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    data-active={editor.isActive("bold")}
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Gras (Cmd+B)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    data-active={editor.isActive("italic")}
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Italique (Cmd+I)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    data-active={editor.isActive("heading", { level: 2 })}
                  >
                    <Heading2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Titre</TooltipContent>
              </Tooltip>

              <div className="w-px h-4 bg-border mx-1" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    data-active={editor.isActive("bulletList")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Liste à puces</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    data-active={editor.isActive("orderedList")}
                  >
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Liste numérotée</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    data-active={editor.isActive("blockquote")}
                  >
                    <Quote className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Citation</TooltipContent>
              </Tooltip>

              <div className="w-px h-4 bg-border mx-1" />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Annuler (Cmd+Z)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Rétablir (Cmd+Shift+Z)</TooltipContent>
              </Tooltip>

              <div className="flex-1" />

              {onSave && (
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gap-1"
                >
                  {isSaving ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Save className="h-3 w-3" />
                  )}
                  Enregistrer
                </Button>
              )}
            </TooltipProvider>
          </div>
        )}



        {/* Editor content */}
        <EditorContent editor={editor} className="border-0" />
      </CardContent>
    </Card>
  );
}
