"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function DigestSettings() {
  const [isSending, setIsSending] = useState(false);
  
  // In full implementation, use these:
  // const preferences = useQuery(api.digest.getDigestPreferences);
  // const updatePreferences = useMutation(api.digest.updateDigestPreferences);
  // const sendTest = useMutation(api.digest.sendTestDigest);

  const [settings, setSettings] = useState({
    enabled: true,
    frequency: "daily" as "daily" | "weekly" | "none",
    includeDeals: true,
    includeComments: true,
    includeMentions: true,
  });

  const handleFrequencyChange = async (value: string) => {
    setSettings({ ...settings, frequency: value as "daily" | "weekly" | "none" });
    toast.success(`Fréquence mise à jour: ${value === "daily" ? "Quotidien" : value === "weekly" ? "Hebdomadaire" : "Désactivé"}`);
  };

  const handleToggle = async (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
    toast.success("Préférences mises à jour");
  };

  const handleSendTest = async () => {
    setIsSending(true);
    try {
      // await sendTest();
      await new Promise((r) => setTimeout(r, 1000)); // Simulate
      toast.success("Email de test envoyé");
    } catch (error) {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Résumé d'Activité</CardTitle>
        </div>
        <CardDescription>
          Recevez un email récapitulatif de l'activité de la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="digest-enabled">Activer les résumés</Label>
            <p className="text-sm text-muted-foreground">
              Recevoir des emails récapitulatifs
            </p>
          </div>
          <Switch
            id="digest-enabled"
            checked={settings.enabled}
            onCheckedChange={() => handleToggle("enabled")}
          />
        </div>

        {/* Frequency */}
        <div className="space-y-3">
          <Label>Fréquence</Label>
          <RadioGroup
            value={settings.frequency}
            onValueChange={handleFrequencyChange}
            className="flex flex-col gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily" className="cursor-pointer">
                Quotidien
                <span className="text-sm text-muted-foreground ml-2">
                  Chaque matin à 8h
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly" className="cursor-pointer">
                Hebdomadaire
                <span className="text-sm text-muted-foreground ml-2">
                  Chaque lundi à 8h
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label htmlFor="none" className="cursor-pointer">
                Désactivé
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Content preferences */}
        <div className="space-y-3">
          <Label>Contenu inclus</Label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="include-deals" className="cursor-pointer">
                Nouveaux dossiers
              </Label>
              <Switch
                id="include-deals"
                checked={settings.includeDeals}
                onCheckedChange={() => handleToggle("includeDeals")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="include-comments" className="cursor-pointer">
                Commentaires
              </Label>
              <Switch
                id="include-comments"
                checked={settings.includeComments}
                onCheckedChange={() => handleToggle("includeComments")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="include-mentions" className="cursor-pointer">
                Mentions (@vous)
              </Label>
              <Switch
                id="include-mentions"
                checked={settings.includeMentions}
                onCheckedChange={() => handleToggle("includeMentions")}
              />
            </div>
          </div>
        </div>

        {/* Test email */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleSendTest}
            disabled={isSending || !settings.enabled}
            className="w-full gap-2"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Envoyer un email de test
          </Button>
        </div>

        {/* Status */}
        {settings.enabled && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Prochain envoi:{" "}
            <Badge variant="outline">
              {settings.frequency === "daily"
                ? "Demain 8h00"
                : settings.frequency === "weekly"
                ? "Lundi 8h00"
                : "—"}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
