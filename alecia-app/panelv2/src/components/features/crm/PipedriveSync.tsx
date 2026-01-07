"use client";

import { useState, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Link2, Check, AlertCircle, ExternalLink, Unlink } from "lucide-react";
import { toast } from "sonner";

type ConnectionStatus = "unknown" | "connected" | "disconnected";
type SyncStatus = "idle" | "syncing" | "success" | "error";

export function PipedriveSync() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("unknown");
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [results, setResults] = useState<{ companies: number; deals: number; contacts: number } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const isConnected = useAction(api.pipedrive.isConnected);
  const getAuthUrl = useAction(api.pipedrive.getAuthUrl);
  const syncFromPipedrive = useAction(api.pipedrive.syncFromPipedrive);

  // Check connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await isConnected();
        setConnectionStatus(connected ? "connected" : "disconnected");
      } catch {
        setConnectionStatus("disconnected");
      }
    };
    if (dialogOpen) checkConnection();
  }, [dialogOpen, isConnected]);

  const handleConnect = async () => {
    try {
      const authUrl = await getAuthUrl();
      // Open OAuth popup
      window.open(authUrl, "pipedrive_auth", "width=600,height=700,popup=true");
      
      // Listen for callback message
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.type === "PIPEDRIVE_AUTH_SUCCESS") {
          setConnectionStatus("connected");
          toast.success("Connexion Pipedrive réussie !");
          window.removeEventListener("message", handleMessage);
        }
      };
      window.addEventListener("message", handleMessage);
    } catch (error) {
      toast.error("Erreur de connexion", {
        description: error instanceof Error ? error.message : "Vérifiez la configuration OAuth.",
      });
    }
  };

  const handleSync = async () => {
    setSyncStatus("syncing");
    try {
      const result = await syncFromPipedrive();
      setResults(result);
      setSyncStatus("success");
      toast.success("Synchronisation terminée !", {
        description: `${result.companies} sociétés, ${result.deals} dossiers, ${result.contacts} contacts importés.`,
      });
    } catch (error) {
      setSyncStatus("error");
      toast.error("Erreur de synchronisation", {
        description: error instanceof Error ? error.message : "Vérifiez votre connexion Pipedrive.",
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Link2 className="w-4 h-4" />
          Pipedrive
          {connectionStatus === "connected" && (
            <span className="w-2 h-2 rounded-full bg-green-500" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Synchronisation Pipedrive
          </DialogTitle>
          <DialogDescription>
            Connectez-vous via OAuth pour synchroniser vos données sans clé API.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">Connexion</span>
            <Badge
              variant={connectionStatus === "connected" ? "default" : "secondary"}
              className={connectionStatus === "connected" ? "bg-green-100 text-green-700" : ""}
            >
              {connectionStatus === "unknown" && "Vérification..."}
              {connectionStatus === "connected" && "Connecté"}
              {connectionStatus === "disconnected" && "Non connecté"}
            </Badge>
          </div>

          {/* Connect Button (if not connected) */}
          {connectionStatus === "disconnected" && (
            <Button onClick={handleConnect} variant="outline" className="w-full gap-2">
              <ExternalLink className="w-4 h-4" />
              Se connecter à Pipedrive
            </Button>
          )}

          {/* Sync Results (if connected) */}
          {connectionStatus === "connected" && results && (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{results.companies}</div>
                <div className="text-xs text-muted-foreground">Sociétés</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{results.deals}</div>
                <div className="text-xs text-muted-foreground">Dossiers</div>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">{results.contacts}</div>
                <div className="text-xs text-muted-foreground">Contacts</div>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-xs text-blue-700 dark:text-blue-300">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>
              OAuth sécurisé : aucune clé API stockée. Vos données restent synchronisées entre les deux systèmes.
            </p>
          </div>
        </div>

        <DialogFooter>
          {connectionStatus === "connected" ? (
            <Button
              onClick={handleSync}
              disabled={syncStatus === "syncing"}
              className="w-full gap-2"
            >
              {syncStatus === "syncing" ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Synchronisation...
                </>
              ) : syncStatus === "success" ? (
                <>
                  <Check className="w-4 h-4" />
                  Re-synchroniser
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Lancer la synchronisation
                </>
              )}
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="w-full">
              Fermer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
