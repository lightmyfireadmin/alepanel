"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slack, Send, CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function SlackSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  
  // In full implementation:
  // const status = useQuery(api.slack.getSlackStatus);
  // const configure = useMutation(api.slack.configureSlack);
  // const toggle = useMutation(api.slack.toggleSlack);
  // const sendTest = useMutation(api.slack.sendTestSlackMessage);

  const [config, setConfig] = useState({
    webhookUrl: "",
    channel: "#deals",
    enabled: false,
    connected: false,
  });

  const [notifications, setNotifications] = useState({
    newDeal: true,
    dealStageChange: true,
    dealClosed: true,
    newComment: false,
    dailySummary: true,
  });

  const handleSaveWebhook = async () => {
    if (!config.webhookUrl) {
      toast.error("Veuillez entrer l'URL du webhook");
      return;
    }

    setIsSaving(true);
    try {
      // await configure({ webhookUrl: config.webhookUrl, channel: config.channel });
      await new Promise((r) => setTimeout(r, 1000)); // Simulate
      setConfig({ ...config, connected: true, enabled: true });
      toast.success("Slack configuré avec succès");
    } catch (error) {
      toast.error("Erreur lors de la configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = async () => {
    try {
      // await toggle({ enabled: !config.enabled });
      setConfig({ ...config, enabled: !config.enabled });
      toast.success(config.enabled ? "Slack désactivé" : "Slack activé");
    } catch (error) {
      toast.error("Erreur");
    }
  };

  const handleSendTest = async () => {
    setIsSendingTest(true);
    try {
      // await sendTest();
      await new Promise((r) => setTimeout(r, 1000)); // Simulate
      toast.success("Message de test envoyé à Slack");
    } catch (error) {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    toast.success("Préférence mise à jour");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Slack className="h-5 w-5 text-[#4A154B]" />
            <CardTitle className="text-lg">Slack</CardTitle>
          </div>
          {config.connected && (
            <Badge variant={config.enabled ? "default" : "secondary"}>
              {config.enabled ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connecté
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Désactivé
                </>
              )}
            </Badge>
          )}
        </div>
        <CardDescription>
          Recevez les mises à jour des dossiers directement dans Slack
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Webhook Configuration */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL du Webhook</Label>
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={config.webhookUrl}
              onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Créez un webhook entrant dans{" "}
              <a
                href="https://api.slack.com/messaging/webhooks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                Slack API
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel">Canal</Label>
            <Input
              id="channel"
              placeholder="#deals"
              value={config.channel}
              onChange={(e) => setConfig({ ...config, channel: e.target.value })}
            />
          </div>

          <Button onClick={handleSaveWebhook} disabled={isSaving} className="w-full">
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            {config.connected ? "Mettre à jour" : "Connecter"}
          </Button>
        </div>

        {/* Enable/Disable Toggle */}
        {config.connected && (
          <>
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="space-y-0.5">
                <Label>Notifications actives</Label>
                <p className="text-sm text-muted-foreground">
                  Activer/désactiver les envois
                </p>
              </div>
              <Switch checked={config.enabled} onCheckedChange={handleToggle} />
            </div>

            {/* Notification Types */}
            <div className="space-y-3">
              <Label>Types de notifications</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notif-new" className="cursor-pointer text-sm">
                    Nouveau dossier créé
                  </Label>
                  <Switch
                    id="notif-new"
                    checked={notifications.newDeal}
                    onCheckedChange={() => handleNotificationToggle("newDeal")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notif-stage" className="cursor-pointer text-sm">
                    Changement d'étape
                  </Label>
                  <Switch
                    id="notif-stage"
                    checked={notifications.dealStageChange}
                    onCheckedChange={() => handleNotificationToggle("dealStageChange")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notif-closed" className="cursor-pointer text-sm">
                    Dossier clôturé (Won/Lost)
                  </Label>
                  <Switch
                    id="notif-closed"
                    checked={notifications.dealClosed}
                    onCheckedChange={() => handleNotificationToggle("dealClosed")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notif-summary" className="cursor-pointer text-sm">
                    Résumé quotidien
                  </Label>
                  <Switch
                    id="notif-summary"
                    checked={notifications.dailySummary}
                    onCheckedChange={() => handleNotificationToggle("dailySummary")}
                  />
                </div>
              </div>
            </div>

            {/* Test Message */}
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleSendTest}
                disabled={isSendingTest || !config.enabled}
                className="w-full gap-2"
              >
                {isSendingTest ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Envoyer un message de test
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
