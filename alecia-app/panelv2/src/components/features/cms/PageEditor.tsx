"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Save, GitPullRequest, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageEditorProps {
  slug: string;
}

export function PageEditor({ slug }: PageEditorProps) {
  const user = useQuery(api.queries.getCurrentUser);
  const pageData = useQuery(api.cms.getPage, { slug });
  
  const updatePage = useMutation(api.cms.updatePage);
  const createProposal = useMutation(api.cms.createProposal);
  const generateDiff = useAction(api.actions.openai.generateDiffSummary);

  const [title, setTitle] = useState("");
  const [isCommitOpen, setIsCommitOpen] = useState(false);
  const [commitMessage, setCommitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[300px]",
      },
    },
  });

  // Load content when data is ready
  useEffect(() => {
    if (pageData && editor) {
        // Only set content if editor is empty to avoid overwriting user changes during re-renders
        // or checks if content matches database
        if (editor.isEmpty) {
            editor.commands.setContent(pageData.content || "");
            setTitle(pageData.title || "");
        }
    }
  }, [pageData, editor]);

  if (!user || pageData === undefined) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-muted-foreground" /></div>;
  }

  const handleSave = async () => {
    if (!editor) return;
    const content = editor.getHTML();
    
    try {
        await updatePage({
            slug,
            title,
            content,
            isPublished: true
        });
        toast.success("Page updated successfully");
    } catch (err) {
        toast.error("Failed to update page");
        console.error(err);
    }
  };

  const handlePropose = async () => {
    if (!editor) return;
    setIsSubmitting(true);
    const newContent = editor.getHTML();
    
    try {
        // 1. Generate AI Summary of changes
        // Only if there is old content to compare
        let aiSummary = "";
        if (pageData?.content) {
             try {
                aiSummary = await generateDiff({
                    oldContent: pageData.content,
                    newContent: newContent
                });
             } catch (e) {
                 console.warn("AI Diff failed, proceeding without summary", e);
             }
        }

        // 2. Create Proposal
        await createProposal({
            slug,
            title: commitMessage,
            newContent,
            aiSummary
        });
        
        toast.success("Proposal created successfully");
        setIsCommitOpen(false);
    } catch (err) {
        toast.error("Failed to create proposal");
        console.error(err);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-6 bg-card rounded-xl border shadow-sm">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-1">
             <Label htmlFor="page-title" className="text-xs font-semibold uppercase text-muted-foreground">Page Title</Label>
             <Input 
                id="page-title"
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="text-lg font-bold border-none shadow-none p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
                placeholder="Enter page title..."
             />
        </div>
        <div className="flex gap-2">
            {user.role === "sudo" && (
                <Button onClick={handleSave} className="gap-2">
                    <Save className="w-4 h-4" />
                    Direct Save
                </Button>
            )}
            
            <Dialog open={isCommitOpen} onOpenChange={setIsCommitOpen}>
                <DialogTrigger asChild>
                    <Button variant={user.role === "sudo" ? "outline" : "default"} className="gap-2">
                        <GitPullRequest className="w-4 h-4" />
                        Propose Changes
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Propose Changes</DialogTitle>
                        <DialogDescription>
                            Create a proposal for partners to vote on. Describe your changes below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="commit-msg">Commit Message</Label>
                        <Textarea 
                            id="commit-msg" 
                            placeholder="e.g. Updated valuation methodology section..."
                            value={commitMessage}
                            onChange={(e) => setCommitMessage(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={handlePropose} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Submit Proposal
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      <div className="min-h-[500px] border rounded-md p-4 bg-background">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
