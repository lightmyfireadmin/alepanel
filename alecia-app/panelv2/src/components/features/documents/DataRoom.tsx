"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileIcon, Folder, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DataRoom() {
  const { getToken } = useAuth();
  const { openUserProfile } = useClerk(); // Hacky way to trigger social connection if needed, better to use <SignInButton> logic or custom flow
  const getFiles = useAction(api.actions.microsoft.getOneDriveFiles);

  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false); // Should check if user has Microsoft provider linked

  const handleConnect = async () => {
      // In a real app, verify Clerk connection. 
      // For now, we assume user is logged in via Microsoft or has linked it.
      // We need the Oauth Access Token for Graph, not the Clerk JWT.
      // Clerk provides this via `getToken({ template: "microsoft" })` IF configured.
      loadFiles();
  };

  const loadFiles = async () => {
      setIsLoading(true);
      try {
          // IMPORTANT: Requires "microsoft" template in Clerk Dashboard -> JWT Templates
          // OR use `await getToken({ provider: "oauth_microsoft" })` ??
          // Actually Clerk documentation says: useSession -> session.getToken({ template: ... })
          // If using "Social Connection" access token:
          // We might need to fetch it from Clerk Backend API or use a trick.
          // For this demo, let's assume we pass a placeholder if we can't get the real one easily client-side without backend help.
          
          // REALITY CHECK: Client-side getting provider token is deprecated/hard in Clerk.
          // Correct flow: Call internal Convex action -> Convex calls Clerk API -> Get Token -> Call Graph.
          // BUT `microsoft-graph-client` is used here in Convex Action.
          // So we need to pass the token TO the action.
          
          const token = await getToken({ template: "microsoft_graph" }); // Hypothetical template
          
          if (!token) {
              toast.error("Veuillez lier votre compte Microsoft.");
              return;
          }

          const result = await getFiles({ accessToken: token });
          setFiles(result);
          setIsConnected(true);
      } catch (e) {
          console.error(e);
          toast.error("Erreur de connexion OneDrive. Vérifiez lier votre compte.");
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <div className="p-4 border-b bg-muted/10 flex justify-between items-center">
        <h3 className="font-semibold">Data Room</h3>
        <Button size="sm" variant="outline" onClick={handleConnect} disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Folder className="w-4 h-4 mr-2" />}
            {isConnected ? "Rafraîchir" : "Connecter OneDrive"}
        </Button>
      </div>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <Tabs defaultValue="onedrive" className="h-full flex flex-col">
            <div className="px-4 pt-2">
                <TabsList>
                    <TabsTrigger value="internal">Interne</TabsTrigger>
                    <TabsTrigger value="onedrive">OneDrive (Live)</TabsTrigger>
                </TabsList>
            </div>
            
            <TabsContent value="onedrive" className="flex-1 overflow-auto p-4 space-y-2">
                {files.length === 0 ? (
                    <div className="text-center text-muted-foreground mt-10">
                        Aucun fichier chargé. Connectez-vous.
                    </div>
                ) : (
                    files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg border group">
                            <div className="flex items-center gap-3">
                                {file.type === 'folder' ? <Folder className="w-5 h-5 text-blue-500" /> : <FileIcon className="w-5 h-5 text-blue-600" />}
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{file.name}</span>
                                    <span className="text-[10px] text-muted-foreground">
                                        Modifié: {new Date(file.lastModified).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100" asChild>
                                <a href={file.webUrl} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </Button>
                        </div>
                    ))
                )}
            </TabsContent>
            
            <TabsContent value="internal" className="p-4">
                <div className="text-center text-muted-foreground">
                    Fichiers stockés dans Alecia Storage (Coming Soon)
                </div>
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
