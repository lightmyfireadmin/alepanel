"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Smartphone, 
  Download,
  Wifi,
  WifiOff,
  RefreshCw,
  Bell,
  Check,
  X,
  HardDrive,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface PWAInstallerProps {
  className?: string;
}

export function PWAInstaller({ className = "" }: PWAInstallerProps) {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [offlineDataSize, setOfflineDataSize] = useState("0 MB");
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "offline">("synced");

  useEffect(() => {
    // Check if app is installed
    if (typeof window !== "undefined") {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      setIsInstalled(isStandalone);
      
      // Listen for install prompt
      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsInstallable(true);
      };

      // Listen for online/offline
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      setIsOnline(navigator.onLine);

      // Check notification permission
      if ("Notification" in window) {
        setNotificationsEnabled(Notification.permission === "granted");
      }

      // Estimate storage usage
      if (navigator.storage && navigator.storage.estimate) {
        navigator.storage.estimate().then((estimate) => {
          const usedMB = ((estimate.usage || 0) / (1024 * 1024)).toFixed(1);
          setOfflineDataSize(`${usedMB} MB`);
        });
      }

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
      toast.success("Application installée avec succès");
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleEnableNotifications = async () => {
    if (!("Notification" in window)) {
      toast.error("Notifications non supportées");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotificationsEnabled(true);
      toast.success("Notifications activées");
    } else {
      toast.error("Permission refusée");
    }
  };

  const handleSyncData = async () => {
    setSyncStatus("syncing");
    
    // Simulate sync
    await new Promise((r) => setTimeout(r, 2000));
    
    setSyncStatus("synced");
    toast.success("Données synchronisées");
  };

  const handleClearOfflineData = async () => {
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      setOfflineDataSize("0 MB");
      toast.success("Cache vidé");
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-blue-500" />
          Application Mobile
        </CardTitle>
        <CardDescription>
          Installez l'app et gérez les paramètres hors-ligne
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm font-medium">
              {isOnline ? "En ligne" : "Hors ligne"}
            </span>
          </div>
          <Badge variant={isOnline ? "default" : "destructive"}>
            {isOnline ? "Connecté" : "Déconnecté"}
          </Badge>
        </div>

        {/* Install PWA */}
        {!isInstalled && (
          <div className="space-y-3">
            <Label>Installation</Label>
            {isInstallable ? (
              <Button onClick={handleInstall} className="w-full gap-2">
                <Download className="h-4 w-4" />
                Installer l'application
              </Button>
            ) : (
              <div className="text-sm text-muted-foreground p-3 border rounded-lg">
                <p>L'installation est disponible depuis Chrome ou Safari mobile.</p>
                <p className="mt-1 text-xs">
                  Safari: Partager → "Sur l'écran d'accueil"
                </p>
              </div>
            )}
          </div>
        )}

        {isInstalled && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">
              Application installée
            </span>
          </div>
        )}

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Notifications push</Label>
            <p className="text-xs text-muted-foreground">
              Recevez des alertes en temps réel
            </p>
          </div>
          {notificationsEnabled ? (
            <Badge variant="outline" className="gap-1 text-green-600">
              <Check className="h-3 w-3" />
              Activées
            </Badge>
          ) : (
            <Button size="sm" variant="outline" onClick={handleEnableNotifications}>
              <Bell className="h-4 w-4 mr-1" />
              Activer
            </Button>
          )}
        </div>

        {/* Offline Data */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Données hors-ligne</Label>
            <Badge variant="outline">{offlineDataSize}</Badge>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncData}
              disabled={!isOnline || syncStatus === "syncing"}
              className="flex-1 gap-1"
            >
              {syncStatus === "syncing" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
              Synchroniser
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearOfflineData}
              className="gap-1"
            >
              <HardDrive className="h-3 w-3" />
              Vider le cache
            </Button>
          </div>
        </div>

        {/* Sync Status */}
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">État de synchronisation</span>
            <Badge 
              variant="outline"
              className={
                syncStatus === "synced" ? "text-green-600" :
                syncStatus === "syncing" ? "text-amber-600" : "text-red-600"
              }
            >
              {syncStatus === "synced" && "Synchronisé"}
              {syncStatus === "syncing" && "En cours..."}
              {syncStatus === "offline" && "Hors ligne"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
